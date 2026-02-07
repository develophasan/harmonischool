import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Create quick assessment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, domain, score, assessedBy } = body

    // Validate score (1-5, or map from 🟢🟡🔴)
    let finalScore = score
    if (typeof score === 'string') {
      if (score === '🟢') finalScore = 5
      else if (score === '🟡') finalScore = 3
      else if (score === '🔴') finalScore = 1
      else finalScore = parseInt(score)
    }

    if (finalScore < 1 || finalScore > 5) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 5' },
        { status: 400 }
      )
    }

    const assessment = await prisma.quickAssessment.create({
      data: {
        studentId,
        domain,
        score: finalScore,
        assessedBy,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        assessor: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    })

    // Update neuro profile if exists
    const domainMap: Record<string, string> = {
      executive_functions: 'executiveScore',
      language_communication: 'languageScore',
      social_emotional: 'emotionalScore',
      gross_motor: 'grossMotorScore',
      fine_motor: 'fineMotorScore',
      logical_numerical: 'logicScore',
      creative_expression: 'creativeScore',
      spatial_awareness: 'spatialScore',
      discovery_world: 'discoveryScore',
      self_help: 'independenceScore',
    }

    const profileField = domainMap[domain]
    if (profileField) {
      const percentage = (finalScore / 5) * 100
      
      await prisma.childNeuroProfile.upsert({
        where: { studentId },
        update: {
          [profileField]: percentage,
          lastCalculated: new Date(),
        },
        create: {
          studentId,
          [profileField]: percentage,
        },
      })
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error('Error creating quick assessment:', error)
    return NextResponse.json(
      { error: 'Failed to create quick assessment' },
      { status: 500 }
    )
  }
}

// Get quick assessments for a student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required' },
        { status: 400 }
      )
    }

    const assessments = await prisma.quickAssessment.findMany({
      where: { studentId },
      include: {
        assessor: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(assessments)
  } catch (error) {
    console.error('Error fetching quick assessments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quick assessments' },
      { status: 500 }
    )
  }
}

