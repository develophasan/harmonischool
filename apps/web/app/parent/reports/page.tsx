"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useParentId, useParentChildren } from "@/hooks/api/use-parent"
import { useMemo } from "react"

export default function ParentReportsPage() {
  const { data: parentId, isLoading: parentIdLoading } = useParentId()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId')
  const { data: children = [], isLoading: childrenLoading } = useParentChildren(parentId || null)

  const loading = parentIdLoading || childrenLoading

  const reports = useMemo(() => {
    if (!children.length) return []
    
    return children
      .filter((child: any) => !studentId || child.id === studentId)
      .map((child: any) => ({
        studentId: child.id,
        studentName: `${child.firstName} ${child.lastName}`,
        assessments: child.assessments || [],
      }))
  }, [children, studentId])

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
        <div className="mb-8">
          <Link href="/parent/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Gelişim Raporları</h1>
          <p className="text-muted-foreground">
            Çocuğunuzun gelişim raporları
          </p>
        </div>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-8 text-muted-foreground">
                Henüz rapor bulunmuyor.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reports.map((report: any) => (
              <Card key={report.studentId}>
                <CardHeader>
                  <CardTitle>{report.studentName}</CardTitle>
                  <CardDescription>
                    Gelişim değerlendirme geçmişi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {report.assessments.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">
                      Henüz değerlendirme bulunmuyor.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {report.assessments.map((assessment: any, idx: number) => {
                        const avgScore = assessment.scores && assessment.scores.length > 0
                          ? assessment.scores.reduce((sum: number, s: any) => sum + (s.score || 0), 0) /
                            assessment.scores.length
                          : 0

                        return (
                          <div key={idx} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-medium">
                                {new Date(assessment.assessmentDate).toLocaleDateString("tr-TR")}
                              </span>
                              {avgScore > 0 && (
                                <span className="text-lg font-bold text-primary">
                                  Ortalama: {avgScore.toFixed(1)}/5
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                              {assessment.scores && assessment.scores.map((score: any, scoreIdx: number) => (
                                <div
                                  key={scoreIdx}
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
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
