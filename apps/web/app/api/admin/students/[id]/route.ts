// Admin: Student by ID (GET, PUT, DELETE)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { handleApiError } from '@/lib/api/errors'
import { getBody } from '@/lib/api/middleware'
import { UpdateStudentSchema } from '@/lib/validations'
import { successResponse } from '@/lib/api/utils'

// GET /api/admin/students/[id] - Get student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        classStudents: {
          include: { class: true },
        },
        parentStudents: {
          include: { parent: true },
        },
        assessments: {
          include: {
            scores: {
              include: { domain: true },
            },
          },
          orderBy: { assessmentDate: 'desc' },
          take: 10,
        },
      },
    })

    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })
    }

    return successResponse(student)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/admin/students/[id] - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bodyResult = await getBody(request, UpdateStudentSchema)
    if (!bodyResult.success) {
      return NextResponse.json({ success: false, error: bodyResult.error }, { status: 400 })
    }

    const data: any = { ...bodyResult.data }
    if (data.dateOfBirth) data.dateOfBirth = new Date(data.dateOfBirth)
    if (data.enrollmentDate) data.enrollmentDate = new Date(data.enrollmentDate)

    const student = await prisma.student.update({
      where: { id: params.id },
      data,
    })

    return successResponse(student, 'Student updated successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/admin/students/[id] - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.student.delete({
      where: { id: params.id },
    })

    return successResponse(null, 'Student deleted successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

