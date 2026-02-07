import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    try {
      const notification = await prisma.notification.update({
        where: { id },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      })

      return NextResponse.json(notification)
    } catch (tableError: any) {
      // If table doesn't exist, return success (graceful degradation)
      if (tableError.code === 'P2021' || tableError.message?.includes('does not exist')) {
        console.warn('Notifications table does not exist yet.')
        return NextResponse.json({ success: true })
      }
      throw tableError
    }
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

// Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    try {
      await prisma.notification.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (tableError: any) {
      // If table doesn't exist, return success (graceful degradation)
      if (tableError.code === 'P2021' || tableError.message?.includes('does not exist')) {
        console.warn('Notifications table does not exist yet.')
        return NextResponse.json({ success: true })
      }
      throw tableError
    }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}

