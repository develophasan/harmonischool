import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { GoogleGenAI } from '@google/genai'

// Initialize AI client - API key must be in .env file
if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set in environment variables')
}

const ai = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  : null

// Get AI summary for a student
export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    const targetDate = date ? new Date(date) : new Date()
    targetDate.setHours(0, 0, 0, 0)

    try {
      let summary = await prisma.aIChildSummary.findUnique({
        where: {
          studentId_date: {
            studentId,
            date: targetDate,
          },
        },
      })

      // If no summary exists, try to generate one (only if table exists)
      if (!summary) {
        try {
          summary = await generateSummary(studentId, targetDate)
        } catch (genError: any) {
          // If table doesn't exist, return null
          if (genError.code === 'P2021' || genError.message?.includes('does not exist')) {
            console.warn('AI child summaries table does not exist yet. Run db:push to create it.')
            return NextResponse.json(null)
          }
          throw genError
        }
      }

      return NextResponse.json(summary)
    } catch (tableError: any) {
      // If table doesn't exist, return null
      if (tableError.code === 'P2021' || tableError.message?.includes('does not exist')) {
        console.warn('AI child summaries table does not exist yet. Run db:push to create it.')
        return NextResponse.json(null)
      }
      throw tableError
    }
  } catch (error) {
    console.error('Error fetching AI summary:', error)
    // Return null instead of error to prevent page crash
    return NextResponse.json(null)
  }
}

// Generate new AI summary
export async function POST(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params
    const body = await request.json()
    const date = body.date ? new Date(body.date) : new Date()
    date.setHours(0, 0, 0, 0)

    try {
      const summary = await generateSummary(studentId, date)
      return NextResponse.json(summary)
    } catch (tableError: any) {
      // If table doesn't exist, return error message
      if (tableError.code === 'P2021' || tableError.message?.includes('does not exist')) {
        console.warn('AI child summaries table does not exist yet. Run db:push to create it.')
        return NextResponse.json(
          { error: 'Table not created yet. Please run db:push first.' },
          { status: 503 }
        )
      }
      throw tableError
    }
  } catch (error) {
    console.error('Error generating AI summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI summary' },
      { status: 500 }
    )
  }
}

async function generateSummary(studentId: string, date: Date) {
  // Get student info
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      assessments: {
        include: {
          scores: {
            include: { domain: true },
          },
        },
        orderBy: { assessmentDate: 'desc' },
        take: 1,
      },
      emotionSnapshots: {
        where: {
          date: {
            gte: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000),
            lte: date,
          },
        },
        orderBy: { date: 'desc' },
      },
      dailyLogs: {
        where: {
          logDate: {
            gte: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000),
            lte: date,
          },
        },
        orderBy: { logDate: 'desc' },
        take: 7,
      },
    },
  })

  if (!student) {
    throw new Error('Student not found')
  }

  // Prepare context for AI
  const age = Math.floor(
    (new Date().getTime() - new Date(student.dateOfBirth).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
  )

  const recentScores = student.assessments[0]?.scores || []
  const avgMood =
    student.emotionSnapshots.length > 0
      ? student.emotionSnapshots.reduce((sum, s) => sum + s.mood, 0) /
        student.emotionSnapshots.length
      : 3

  const context = `
Çocuk: ${student.firstName} ${student.lastName}, ${age} yaşında
Son değerlendirme skorları: ${recentScores
    .map((s) => `${s.domain.nameTr}: ${s.percentage || s.score}/100`)
    .join(', ')}
Ortalama duygu durumu (1-5): ${avgMood.toFixed(1)}
Son günlük notlar: ${student.dailyLogs
    .map((log) => log.generalNotes)
    .filter(Boolean)
    .slice(0, 3)
    .join('; ')}
`

  // Generate summary using Google Gemini
  const systemPrompt = 'Sen Harmoni Anaokulu için çocuk gelişim uzmanısın. Velilere çocuklarının günlük gelişimini sıcak, samimi ve pozitif bir dille anlatıyorsun. Türkçe yazıyorsun.'
  
  const userPrompt = `Aşağıdaki bilgilere dayanarak ${student.firstName} için bugünün özetini ve evde yapılabilecek önerileri yaz:\n\n${context}`

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`

  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
  }

  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    config,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: fullPrompt,
          },
        ],
      },
    ],
  })

  // Extract text from response
  let aiResponse = ''
  if (response.text) {
    aiResponse = response.text
  } else if (response.candidates && response.candidates[0]?.content?.parts) {
    aiResponse = response.candidates[0].content.parts
      .map((part: any) => part.text || '')
      .join('')
  }
  
  // Split into progress text and recommendation
  const parts = aiResponse.split('\n\n')
  const progressText = parts[0] || aiResponse
  const homeRecommendation = parts[1] || null

  // Save to database
  const summary = await prisma.aIChildSummary.upsert({
    where: {
      studentId_date: {
        studentId,
        date,
      },
    },
    update: {
      progressText,
      homeRecommendation,
    },
    create: {
      studentId,
      date,
      progressText,
      homeRecommendation,
    },
  })

  return summary
}

