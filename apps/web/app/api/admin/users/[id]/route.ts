// Admin: User by ID (GET, PUT, DELETE)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { handleApiError } from '@/lib/api/errors'
import { getBody } from '@/lib/api/middleware'
import { UpdateUserSchema, IdParamSchema } from '@/lib/validations'
import { successResponse } from '@/lib/api/utils'

// GET /api/admin/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        classTeachers: {
          include: { class: true },
        },
        parentStudents: {
          include: { student: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return successResponse(user)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bodyResult = await getBody(request, UpdateUserSchema)
    if (!bodyResult.success) {
      return NextResponse.json({ success: false, error: bodyResult.error }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: bodyResult.data,
    })

    return successResponse(user, 'User updated successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    })

    return successResponse(null, 'User deleted successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

