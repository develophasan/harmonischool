// Admin: Students CRUD
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { handleApiError } from '@/lib/api/errors'
import { getQueryParams, getBody } from '@/lib/api/middleware'
import { CreateStudentSchema } from '@/lib/validations'
import { PaginationSchema } from '@/lib/api/types'
import { successResponse, createPaginatedResponse } from '@/lib/api/utils'
import { z } from 'zod'

// GET /api/admin/students - List all students
export async function GET(request: NextRequest) {
  try {
    const queryResult = getQueryParams(request, PaginationSchema.extend({
      search: z.string().optional(),
      isActive: z.boolean().optional(),
      classId: z.string().uuid().optional(),
    }))

    if (!queryResult.success) {
      return NextResponse.json({ success: false, error: queryResult.error }, { status: 400 })
    }

    const { page = 1, limit = 20, search, isActive, classId } = queryResult.data
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (isActive !== undefined) where.isActive = isActive
    if (classId) {
      where.classStudents = {
        some: { classId, isActive: true },
      }
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          classStudents: {
            include: { class: true },
          },
          parentStudents: {
            include: { parent: true },
          },
        },
      }),
      prisma.student.count({ where }),
    ])

    return successResponse(createPaginatedResponse(students, total, { page, limit }))
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/admin/students - Create student
export async function POST(request: NextRequest) {
  try {
    const bodyResult = await getBody(request, CreateStudentSchema)
    if (!bodyResult.success) {
      return NextResponse.json({ success: false, error: bodyResult.error }, { status: 400 })
    }

    const data: any = {
      ...bodyResult.data,
    }
    if (bodyResult.data.dateOfBirth) {
      data.dateOfBirth = new Date(bodyResult.data.dateOfBirth)
    }
    if (bodyResult.data.enrollmentDate) {
      data.enrollmentDate = new Date(bodyResult.data.enrollmentDate)
    }

    const student = await prisma.student.create({
      data,
    })

    return successResponse(student, 'Student created successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

