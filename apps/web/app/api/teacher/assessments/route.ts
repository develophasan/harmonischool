// Teacher: List and create assessments
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { handleApiError } from '@/lib/api/errors'
import { getBody } from '@/lib/api/middleware'
import { CreateAssessmentWithScoresSchema } from '@/lib/validations'
import { successResponse } from '@/lib/api/utils'

// GET /api/teacher/assessments - List assessments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId')
    const studentId = searchParams.get('studentId')

    if (!teacherId) {
      return NextResponse.json({ success: false, error: 'Teacher ID required' }, { status: 400 })
    }

    // Öğretmenin sınıflarındaki öğrencileri bul
    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId },
      include: {
        class: {
          include: {
            classStudents: {
              where: { isActive: true },
              select: { studentId: true },
            },
          },
        },
      },
    })

    const studentIds = teacherClasses.flatMap((tc) =>
      tc.class.classStudents.map((cs) => cs.studentId)
    )

    if (studentIds.length === 0) {
      return successResponse([])
    }

    const whereClause: any = {
      studentId: { in: studentIds },
    }

    if (studentId) {
      whereClause.studentId = studentId
    }

    const assessments = await prisma.assessment.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        assessor: {
          select: { id: true, fullName: true },
        },
        scores: {
          include: { domain: true },
        },
      },
      orderBy: {
        assessmentDate: 'desc',
      },
    })

    return successResponse(assessments)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/teacher/assessments - Create assessment
export async function POST(request: NextRequest) {
  try {
    const bodyResult = await getBody(request, CreateAssessmentWithScoresSchema)
    if (!bodyResult.success) {
      return NextResponse.json({ success: false, error: bodyResult.error }, { status: 400 })
    }

    const { scores, ...assessmentData } = bodyResult.data

    const assessment = await prisma.assessment.create({
      data: {
        ...assessmentData,
        assessmentDate: assessmentData.assessmentDate
          ? new Date(assessmentData.assessmentDate)
          : new Date(),
        scores: {
          create: scores,
        },
      },
      include: {
        student: true,
        assessor: {
          select: { id: true, fullName: true, email: true },
        },
        scores: {
          include: { domain: true },
        },
      },
    })

    return successResponse(assessment, 'Assessment created successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

