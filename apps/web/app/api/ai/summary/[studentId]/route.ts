import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { generateChildSummary } from '@/services/ai-worker'

// Get AI summary for a student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params
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

      // If no summary exists, try to generate one using AI Worker
      if (!summary) {
        try {
          const generated = await generateChildSummary(studentId, targetDate)
          // Save to database (V3 format)
          summary = await prisma.aIChildSummary.create({
            data: {
              studentId,
              date: targetDate,
              summary: generated.summary,
              riskExplanation: generated.riskExplanation,
              homeActivity: generated.homeActivity,
              positiveNote: generated.positiveNote,
            },
          })
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
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params
    const body = await request.json()
    const date = body.date ? new Date(body.date) : new Date()
    date.setHours(0, 0, 0, 0)

    try {
      // Generate summary using AI Worker
      const generated = await generateChildSummary(studentId, date)
      
      // Save to database (V3 format)
      const summary = await prisma.aIChildSummary.upsert({
        where: {
          studentId_date: {
            studentId,
            date,
          },
        },
        update: {
          summary: generated.summary,
          riskExplanation: generated.riskExplanation,
          homeActivity: generated.homeActivity,
          positiveNote: generated.positiveNote,
        },
        create: {
          studentId,
          date,
          summary: generated.summary,
          riskExplanation: generated.riskExplanation,
          homeActivity: generated.homeActivity,
          positiveNote: generated.positiveNote,
        },
      })
      
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

// generateSummary function removed - now using AI Worker service

