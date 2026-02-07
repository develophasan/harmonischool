import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

// Generate PDF report for a student
export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || new Date().getMonth() + 1
    const year = searchParams.get('year') || new Date().getFullYear()

    // Get student data
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        classStudents: {
          where: { isActive: true },
          include: { class: true },
        },
        assessments: {
          where: {
            assessmentDate: {
              gte: new Date(year, month - 1, 1),
              lt: new Date(year, month, 1),
            },
          },
          include: {
            scores: {
              include: { domain: true },
            },
          },
        },
        neuroProfile: true,
        emotionSnapshots: {
          where: {
            date: {
              gte: new Date(year, month - 1, 1),
              lt: new Date(year, month, 1),
            },
          },
        },
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    let y = 800

    // Header
    page.drawText('Harmoni Supported Development Report', {
      x: 50,
      y,
      size: 20,
      font: boldFont,
      color: rgb(0.06, 0.46, 0.43), // #0F766E
    })

    y -= 40

    // Student Info
    page.drawText(
      `Öğrenci: ${student.firstName} ${student.lastName}`,
      {
        x: 50,
        y,
        size: 14,
        font: boldFont,
      }
    )

    y -= 25

    const classInfo = student.classStudents[0]?.class
    if (classInfo) {
      page.drawText(`Sınıf: ${classInfo.name}`, {
        x: 50,
        y,
        size: 12,
        font,
      })
      y -= 20
    }

    page.drawText(
      `Dönem: ${month}/${year}`,
      {
        x: 50,
        y,
        size: 12,
        font,
      }
    )

    y -= 40

    // Neuro Profile
    if (student.neuroProfile) {
      page.drawText('🧠 Neuro DNA Profile', {
        x: 50,
        y,
        size: 14,
        font: boldFont,
      })
      y -= 25

      const domains = [
        { name: 'Yürütücü İşlevler', score: student.neuroProfile.executiveScore },
        { name: 'Dil ve İletişim', score: student.neuroProfile.languageScore },
        { name: 'Sosyal ve Duygusal', score: student.neuroProfile.emotionalScore },
        { name: 'Kaba Motor', score: student.neuroProfile.grossMotorScore },
        { name: 'İnce Motor', score: student.neuroProfile.fineMotorScore },
        { name: 'Mantıksal ve Sayısal', score: student.neuroProfile.logicScore },
        { name: 'Yaratıcı İfade', score: student.neuroProfile.creativeScore },
        { name: 'Mekansal Farkındalık', score: student.neuroProfile.spatialScore },
        { name: 'Dünya Keşfi', score: student.neuroProfile.discoveryScore },
        { name: 'Öz-Bakım ve Bağımsızlık', score: student.neuroProfile.independenceScore },
      ]

      domains.forEach((domain) => {
        page.drawText(`${domain.name}: ${domain.score.toFixed(1)}%`, {
          x: 70,
          y,
          size: 10,
          font,
        })
        y -= 18
      })

      y -= 20
    }

    // Assessments
    if (student.assessments.length > 0) {
      page.drawText('Değerlendirmeler', {
        x: 50,
        y,
        size: 14,
        font: boldFont,
      })
      y -= 25

      student.assessments.forEach((assessment) => {
        page.drawText(
          `Tarih: ${new Date(assessment.assessmentDate).toLocaleDateString('tr-TR')}`,
          {
            x: 70,
            y,
            size: 10,
            font,
          }
        )
        y -= 15

        assessment.scores.forEach((score) => {
          page.drawText(
            `  ${score.domain.nameTr}: ${score.percentage || score.score}/100`,
            {
              x: 90,
              y,
              size: 9,
              font,
            }
          )
          y -= 14
        })

        y -= 10
      })
    }

    // Footer
    page.drawText(
      'Bu rapor Harmoni Anaokulu Nörogelişim Platformu tarafından oluşturulmuştur.',
      {
        x: 50,
        y: 50,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      }
    )

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="harmoni-report-${student.firstName}-${student.lastName}-${month}-${year}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

