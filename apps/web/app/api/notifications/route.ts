import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recipientId = searchParams.get('recipientId')
    const studentId = searchParams.get('studentId')
    const isRead = searchParams.get('isRead')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!recipientId) {
      return NextResponse.json(
        { error: 'recipientId is required' },
        { status: 400 }
      )
    }

    const where: any = { recipientId }
    if (studentId) where.studentId = studentId
    if (isRead !== null && isRead !== '') where.isRead = isRead === 'true'

    // Try Prisma query directly
    try {
      const notifications = await prisma.notification.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      return NextResponse.json(notifications)
    } catch (tableError: any) {
      // Log the actual error for debugging
      console.error('Error fetching notifications:', {
        code: tableError.code,
        message: tableError.message,
        meta: tableError.meta,
      })
      
      // If table doesn't exist, return empty array
      if (
        tableError.code === 'P2021' || 
        tableError.message?.includes('does not exist') ||
        tableError.message?.includes('notifications')
      ) {
        console.warn('Notifications table does not exist. Returning empty array.')
        return NextResponse.json([])
      }
      
      // For other errors, try without includes
      try {
        const notifications = await prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
        })
        return NextResponse.json(notifications)
      } catch (fallbackError: any) {
        console.error('Fallback query also failed:', fallbackError)
        return NextResponse.json([])
      }
    }
  } catch (error: any) {
    console.error('Error fetching notifications:', error)
    // Return empty array instead of error to prevent page crash
    // This handles cases where table doesn't exist or other database errors
    return NextResponse.json([])
  }
}

// Create notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      recipientId,
      studentId,
      senderType,
      senderId,
      type,
      title,
      message,
      actionUrl,
      metadata,
      expiresAt,
    } = body

    if (!recipientId || !senderType || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    try {
      const notification = await prisma.notification.create({
        data: {
          recipientId,
          studentId,
          senderType,
          senderId: senderId || null,
          type,
          title,
          message,
          actionUrl,
          metadata: metadata ? JSON.stringify(metadata) : null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      })

      return NextResponse.json(notification)
    } catch (tableError: any) {
      // If table doesn't exist, return error message
      if (tableError.code === 'P2021' || tableError.message?.includes('does not exist')) {
        console.warn('Notifications table does not exist yet. Run db:push to create it.')
        return NextResponse.json(
          { error: 'Notifications table not created yet. Please run db:push first.' },
          { status: 503 }
        )
      }
      throw tableError
    }
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

