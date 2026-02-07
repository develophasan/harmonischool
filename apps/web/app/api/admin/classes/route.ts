// Admin: Classes CRUD
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { handleApiError } from '@/lib/api/errors'
import { getQueryParams, getBody } from '@/lib/api/middleware'
import { CreateClassSchema } from '@/lib/validations'
import { PaginationSchema } from '@/lib/api/types'
import { successResponse, createPaginatedResponse } from '@/lib/api/utils'
import { z } from 'zod'

// GET /api/admin/classes - List all classes
export async function GET(request: NextRequest) {
  try {
    const queryResult = getQueryParams(request, PaginationSchema.extend({
      search: z.string().optional(),
      isActive: z.coerce.boolean().optional(), // Query string'den boolean'a çevir
      academicYear: z.string().optional(),
    }))

    if (!queryResult.success) {
      return NextResponse.json({ success: false, error: queryResult.error }, { status: 400 })
    }

    const { page = 1, limit = 20, search, isActive, academicYear } = queryResult.data
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { ageGroup: { contains: search } },
      ]
    }
    if (isActive !== undefined) where.isActive = isActive
    if (academicYear) where.academicYear = academicYear

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          classTeachers: {
            include: { teacher: true },
          },
          classStudents: {
            where: { isActive: true },
            include: { student: true },
          },
        },
      }),
      prisma.class.count({ where }),
    ])

    return successResponse(createPaginatedResponse(classes, total, { page, limit }))
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/admin/classes - Create class
export async function POST(request: NextRequest) {
  try {
    const bodyResult = await getBody(request, CreateClassSchema)
    if (!bodyResult.success) {
      return NextResponse.json({ success: false, error: bodyResult.error }, { status: 400 })
    }

    const classData = await prisma.class.create({
      data: bodyResult.data,
    })

    return successResponse(classData, 'Class created successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

