// Admin: Users CRUD
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { handleApiError } from '@/lib/api/errors'
import { getQueryParams, getBody } from '@/lib/api/middleware'
import { CreateUserSchema, UpdateUserSchema } from '@/lib/validations'
import { PaginationSchema } from '@/lib/api/types'
import { successResponse, createPaginatedResponse } from '@/lib/api/utils'
import { z } from 'zod'

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  try {
    const queryResult = getQueryParams(request, PaginationSchema.extend({
      role: z.enum(['admin', 'teacher', 'parent']).optional(),
      search: z.string().optional(),
    }).passthrough())

    if (!queryResult.success) {
      return NextResponse.json({ success: false, error: queryResult.error }, { status: 400 })
    }

    const { page = 1, limit = 20, role, search } = queryResult.data
    const skip = (page - 1) * limit

    const where: any = {}
    if (role) where.role = role
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    return successResponse(createPaginatedResponse(users, total, { page, limit }))
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/admin/users - Create user
export async function POST(request: NextRequest) {
  try {
    const bodyResult = await getBody(request, CreateUserSchema)
    if (!bodyResult.success) {
      return NextResponse.json({ success: false, error: bodyResult.error }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: bodyResult.data,
    })

    return successResponse(user, 'User created successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

