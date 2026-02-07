"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { TrendingUp, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTeacherId, useTeacherAssessments } from "@/hooks/api/use-teacher"

export default function TeacherAssessmentsPage() {
  const { data: teacherId, isLoading: teacherIdLoading } = useTeacherId()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId')
  const { data: assessments = [], isLoading: assessmentsLoading } = useTeacherAssessments(teacherId || null, studentId || null)

  const loading = teacherIdLoading || assessmentsLoading

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Değerlendirmeler</h1>
            <p className="text-muted-foreground">
              Öğrencilerinizin gelişim değerlendirmeleri
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Değerlendirme
          </Button>
        </div>

        {assessments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-8 text-muted-foreground">
                Henüz değerlendirme bulunmuyor.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment: any) => {
              const avgScore = assessment.scores && assessment.scores.length > 0
                ? assessment.scores.reduce((sum: number, s: any) => sum + (s.score || 0), 0) /
                  assessment.scores.length
                : 0

              return (
                <Card key={assessment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>
                          {assessment.student.firstName} {assessment.student.lastName}
                        </CardTitle>
                        <CardDescription>
                          {new Date(assessment.assessmentDate).toLocaleDateString("tr-TR")}
                        </CardDescription>
                      </div>
                      {avgScore > 0 && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {avgScore.toFixed(1)}/5
                          </div>
                          <p className="text-xs text-muted-foreground">Ortalama</p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {assessment.notes && (
                      <p className="text-sm mb-4">{assessment.notes}</p>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                      {assessment.scores.map((score: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 border rounded-lg text-center"
                        >
                          <p className="text-xs text-muted-foreground mb-1">
                            {score.domain.nameTr}
                          </p>
                          {score.score && (
                            <p className="text-lg font-bold">{score.score}/5</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <Link href={`/teacher/students/${assessment.student.id}`}>
                      <Button variant="outline" size="sm">
                        Öğrenci Detayı
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

