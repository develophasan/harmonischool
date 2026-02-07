import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Get or calculate Neuro Profile for a student
export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params

    // Check if profile exists
    let profile
    try {
      profile = await prisma.childNeuroProfile.findUnique({
        where: { studentId },
        include: { student: true },
      })
    } catch (tableError: any) {
      // If table doesn't exist, return null
      if (tableError.code === 'P2021' || tableError.message?.includes('does not exist')) {
        console.warn('Child neuro profiles table does not exist yet. Run db:push to create it.')
        return NextResponse.json(null)
      }
      throw tableError
    }

    // If no profile exists, calculate it from assessments
    if (!profile) {
      // Get all assessments for this student
      const assessments = await prisma.assessment.findMany({
        where: { studentId },
        include: {
          scores: {
            include: { domain: true },
          },
        },
        orderBy: { assessmentDate: 'desc' },
      })

      // Map domain codes to profile fields
      const domainMap: Record<string, keyof typeof profile> = {
        executive_functions: 'executiveScore',
        language_communication: 'languageScore',
        social_emotional: 'emotionalScore',
        gross_motor: 'grossMotorScore',
        fine_motor: 'fineMotorScore',
        logical_numerical: 'logicScore',
        creative_expression: 'creativeScore',
        spatial_awareness: 'spatialScore',
        discovery_world: 'discoveryScore',
        self_help: 'independenceScore',
      }

      // Calculate average scores per domain
      const domainScores: Record<string, number[]> = {}
      
      assessments.forEach((assessment) => {
        assessment.scores.forEach((score) => {
          const domainCode = score.domain.code
          if (!domainScores[domainCode]) {
            domainScores[domainCode] = []
          }
          // Use percentage if available, otherwise convert score (1-5) to percentage
          const value = score.percentage ?? (score.score ? (score.score / 5) * 100 : 0)
          domainScores[domainCode].push(value)
        })
      })

      // Calculate averages
      const profileData: any = {
        studentId,
        executiveScore: 0,
        languageScore: 0,
        emotionalScore: 0,
        grossMotorScore: 0,
        fineMotorScore: 0,
        logicScore: 0,
        creativeScore: 0,
        spatialScore: 0,
        discoveryScore: 0,
        independenceScore: 0,
      }

      Object.entries(domainScores).forEach(([code, scores]) => {
        const avg = scores.length > 0 
          ? scores.reduce((a, b) => a + b, 0) / scores.length 
          : 0
        const field = domainMap[code]
        if (field) {
          profileData[field] = Math.round(avg * 10) / 10 // Round to 1 decimal
        }
      })

      // Create profile
      profile = await prisma.childNeuroProfile.create({
        data: profileData,
        include: { student: true },
      })
    }

    // Calculate derived fields
    const scores = [
      profile.executiveScore,
      profile.languageScore,
      profile.emotionalScore,
      profile.grossMotorScore,
      profile.fineMotorScore,
      profile.logicScore,
      profile.creativeScore,
      profile.spatialScore,
      profile.discoveryScore,
      profile.independenceScore,
    ]

    const maxScore = Math.max(...scores)
    const minScore = Math.min(...scores.filter(s => s > 0))
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.filter(s => s > 0).length

    const domainNames = [
      'Yürütücü İşlevler',
      'Dil ve İletişim',
      'Sosyal ve Duygusal',
      'Kaba Motor',
      'İnce Motor',
      'Mantıksal ve Sayısal',
      'Yaratıcı İfade',
      'Mekansal Farkındalık',
      'Dünya Keşfi',
      'Öz-Bakım ve Bağımsızlık',
    ]

    const dominantAreas = domainNames
      .map((name, i) => ({ name, score: scores[i] }))
      .filter((item) => item.score >= avgScore * 1.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.name)

    const riskAreas = domainNames
      .map((name, i) => ({ name, score: scores[i] }))
      .filter((item) => item.score > 0 && item.score < avgScore * 0.8)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((item) => item.name)

    const growthPotential = domainNames
      .map((name, i) => ({ name, score: scores[i] }))
      .filter((item) => item.score > 0 && item.score < avgScore && item.score >= avgScore * 0.8)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.name)

    return NextResponse.json({
      ...profile,
      derived: {
        dominantAreas,
        riskAreas,
        growthPotential,
        maxScore,
        minScore,
        avgScore: Math.round(avgScore * 10) / 10,
      },
    })
  } catch (error) {
    console.error('Error fetching neuro profile:', error)
    // Return null instead of error to prevent page crash
    return NextResponse.json(null)
  }
}

// Recalculate profile
export async function POST(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params

    // Delete existing profile
    await prisma.childNeuroProfile.deleteMany({
      where: { studentId },
    })

    // Call GET to recalculate
    return GET(request, { params })
  } catch (error) {
    console.error('Error recalculating neuro profile:', error)
    return NextResponse.json(
      { error: 'Failed to recalculate neuro profile' },
      { status: 500 }
    )
  }
}

