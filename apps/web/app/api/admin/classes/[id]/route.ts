// Admin: Class by ID (GET, PUT, DELETE)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { handleApiError } from '@/lib/api/errors'
import { getBody } from '@/lib/api/middleware'
import { CreateClassSchema } from '@/lib/validations'
import { successResponse } from '@/lib/api/utils'

// GET /api/admin/classes/[id] - Get class by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const classData = await prisma.class.findUnique({
      where: { id: params.id },
      include: {
        classTeachers: {
          include: { teacher: true },
        },
        classStudents: {
          include: { student: true },
        },
      },
    })

    if (!classData) {
      return NextResponse.json({ success: false, error: 'Class not found' }, { status: 404 })
    }

    return successResponse(classData)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/admin/classes/[id] - Update class
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bodyResult = await getBody(request, CreateClassSchema.partial())
    if (!bodyResult.success) {
      return NextResponse.json({ success: false, error: bodyResult.error }, { status: 400 })
    }

    const classData = await prisma.class.update({
      where: { id: params.id },
      data: bodyResult.data,
    })

    return successResponse(classData, 'Class updated successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/admin/classes/[id] - Delete class
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.class.delete({
      where: { id: params.id },
    })

    return successResponse(null, 'Class deleted successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

