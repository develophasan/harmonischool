import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    // İlk öğretmeni bul (test için)
    const teacher = await prisma.user.findFirst({
      where: {
        role: 'teacher',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    })

    if (!teacher) {
      return NextResponse.json({ error: 'No teacher found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      teacher,
    })
  } catch (error: any) {
    console.error('Error fetching teacher:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

