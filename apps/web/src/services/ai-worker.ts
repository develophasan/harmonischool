/**
 * 🤖 AI WORKER - Harmoni OS V3
 * 
 * Gemini AI integration with statistical intelligence:
 * - Z-score based summaries
 * - Risk-aware recommendations
 * - Explainable insights
 * - Domain-specific activities
 */

// @ts-ignore - @google/genai package types
import { GoogleGenAI } from '@google/genai'
import { prisma } from '@/lib/db/prisma'
import { getZProfileHistory, calculateAgeInMonths } from './z-score-engine'
import { calculateRiskScore } from './risk-engine'
import { generateExplanation } from './explainability-engine'

// Initialize Gemini
// @ts-ignore - GoogleGenAI types
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null

/**
 * Generate V3 AI summary with statistical intelligence
 */
export async function generateChildSummary(studentId: string, date: Date = new Date()): Promise<{
  summary: string
  riskExplanation: string | null
  homeActivity: string | null
  positiveNote: string | null
}> {
  try {
    // Get student data
    const student = await (prisma.student.findUnique({
      where: { id: studentId },
      include: {
        neuroProfile: true,
        neuroRiskProfile: true,
        emotionSnapshots: {
          where: {
            date: {
              gte: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { date: 'desc' },
          take: 7,
        },
      },
    }) as any)

    if (!student) {
      throw new Error('Student not found')
    }

    // Get V3 data
    const ageInMonths = calculateAgeInMonths(student.dateOfBirth)
    const zHistory = await getZProfileHistory(studentId, 4)
    const riskData = await calculateRiskScore(studentId)
    const explanation = await generateExplanation(studentId)

    // Get current Z-scores
    const currentZScores: Record<string, number> = {}
    const latestWeek = zHistory
      .filter(h => {
        const weekDate = new Date(h.weekStart)
        const daysDiff = (date.getTime() - weekDate.getTime()) / (1000 * 60 * 60 * 24)
        return daysDiff >= 0 && daysDiff < 7
      })
      .reduce((acc, h) => {
        if (!acc[h.domain] || h.weekStart > new Date(acc[h.domain]?.weekStart || 0)) {
          acc[h.domain] = h
        }
        return acc
      }, {} as Record<string, typeof zHistory[0]>)

    Object.values(latestWeek).forEach(entry => {
      currentZScores[entry.domain] = entry.zScore
    })

    // Build V3 context
    const context = {
      name: `${student.firstName} ${student.lastName}`,
      ageInMonths,
      zScores: currentZScores,
      riskScore: riskData.riskScore,
      riskSeverity: riskData.severity,
      trendSlope: riskData.trendSlope,
      weakestDomain: riskData.weakestDomain,
      strongestDomain: riskData.strongestDomain,
      decliningDomain: riskData.decliningDomain,
      domainImbalance: riskData.domainImbalance,
      emotionalInstability: riskData.emotionalInstability,
      explanation: {
        weakestDomains: explanation.weakestDomains,
        decliningDomains: explanation.decliningDomains,
        emotionalPattern: explanation.emotionalPattern,
        comparisonToAgeNorm: explanation.comparisonToAgeNorm,
      },
      recentMoods: (student as any).emotionSnapshots?.map((s: any) => ({
        date: s.date,
        mood: s.mood,
        highlight: s.highlight,
      })),
    }

    // Build V3 prompt with statistical intelligence
    const prompt = `
Sen Harmoni Neuro Coach AI'sın. ${context.name} (${context.ageInMonths} ay) için nörogelişimsel analiz yapıyorsun.

İSTATİSTİKSEL VERİLER:
- Z-Skorları (yaş normuna göre normalize edilmiş): ${JSON.stringify(context.zScores)}
- Risk Skoru: ${context.riskScore.toFixed(2)} (${context.riskSeverity})
- Trend Eğimi: ${context.trendSlope.toFixed(3)} (negatif = gerileme)
- En Zayıf Alan: ${context.weakestDomain || 'Yok'}
- En Güçlü Alan: ${context.strongestDomain || 'Yok'}
- Gerileyen Alan: ${context.decliningDomain || 'Yok'}
- Duygusal İstikrarsızlık: ${context.emotionalInstability.toFixed(2)}
- Alan Dengesizliği: ${context.domainImbalance.toFixed(2)}

AÇIKLAMA VERİLERİ:
${JSON.stringify(context.explanation, null, 2)}

GÖREV:
Strict JSON formatında döndür (başka metin ekleme):

{
  "summary": "2 cümlelik gelişim özeti (pozitif, destekleyici)",
  "riskExplanation": "Risk varsa basit Türkçe açıklama, yoksa null",
  "homeActivity": "En zayıf alana özel ev aktivitesi (1-2 cümle)",
  "positiveNote": "Güçlü yönleri vurgulayan pozitif not (1 cümle)"
}

KURALLAR:
- summary: Her zaman pozitif ve destekleyici
- riskExplanation: Sadece risk varsa (severity: medium/high), basit Türkçe
- homeActivity: ${context.weakestDomain} alanına özel, somut aktivite
- positiveNote: ${context.strongestDomain} veya genel güçlü yönler

DİL: Türkçe, sıcak, ebeveyn dostu
`

    if (!genAI) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    // @ts-ignore - GoogleGenAI API
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse JSON from response
    let summary: {
      summary: string
      riskExplanation: string | null
      homeActivity: string | null
      positiveNote: string | null
    }

    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        summary = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        // Fallback: parse entire response
        summary = JSON.parse(text)
      }
    } catch (parseError) {
      // Fallback: create summary from context
      const riskText = context.riskSeverity !== 'low'
        ? `${context.weakestDomain} alanında destek önerilir.`
        : null

      summary = {
        summary: `${context.name} bugün güzel bir gün geçirdi. Gelişim takibi devam ediyor.`,
        riskExplanation: riskText,
        homeActivity: context.weakestDomain
          ? `${context.weakestDomain} alanını desteklemek için evde birlikte oyun oynayabilirsiniz.`
          : 'Evde birlikte oyun oynamak ve hikaye okumak önerilir.',
        positiveNote: context.strongestDomain
          ? `${context.strongestDomain} alanında güçlü performans gösteriyor.`
          : 'Gelişim yolculuğunda ilerlemeye devam ediyor.',
      }
    }

    return {
      summary: summary.summary || `${context.name} bugün güzel bir gün geçirdi.`,
      riskExplanation: summary.riskExplanation || null,
      homeActivity: summary.homeActivity || null,
      positiveNote: summary.positiveNote || null,
    }
  } catch (error) {
    console.error('Error generating AI summary:', error)
    
    // Fallback summary
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    })

    return {
      summary: student 
        ? `${student.firstName} bugün güzel bir gün geçirdi. Gelişim takibi devam ediyor.`
        : 'Gelişim takibi devam ediyor.',
      riskExplanation: null,
      homeActivity: 'Evde birlikte oyun oynamak ve hikaye okumak önerilir.',
      positiveNote: 'Gelişim yolculuğunda ilerlemeye devam ediyor.',
    }
  }
}

/**
 * Generate summaries for all active students
 */
export async function generateAllSummaries(date: Date = new Date()): Promise<{
  generated: number
  errors: number
}> {
  const students = await prisma.student.findMany({
    where: { isActive: true },
  })

  let generated = 0
  let errors = 0

  for (const student of students) {
    try {
      // Check if summary already exists for today
      const existing = await (prisma as any).aIChildSummary.findUnique({
        where: {
          studentId_date: {
            studentId: student.id,
            date,
          },
        },
      })

      if (existing) {
        continue // Skip if already generated
      }

      // Generate V3 summary
      const summary = await generateChildSummary(student.id, date)

      // Save to database (V3 format)
      await (prisma as any).aIChildSummary.create({
        data: {
          studentId: student.id,
          date,
          summary: summary.summary,
          riskExplanation: summary.riskExplanation,
          homeActivity: summary.homeActivity,
          positiveNote: summary.positiveNote,
        },
      })

      generated++
    } catch (error) {
      console.error(`Error generating summary for student ${student.id}:`, error)
      errors++
    }
  }

  return { generated, errors }
}

