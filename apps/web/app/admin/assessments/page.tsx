"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { TrendingUp } from "lucide-react"
import { useAdminAssessments } from "@/hooks/api/use-admin"

export default function AdminAssessmentsPage() {
  const [pagination, setPagination] = useState({ page: 1, limit: 20 })
  
  const { data, isLoading: loading, error } = useAdminAssessments({
    page: pagination.page,
    limit: pagination.limit,
  })
  
  // Debug: API response'u kontrol et
  if (data && process.env.NODE_ENV === 'development') {
    console.log('Admin Assessments Data:', data)
  }
  
  const assessments = data?.data || []
  const paginationData = data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }
  
  // Debug: Parse edilmiş verileri kontrol et
  if (process.env.NODE_ENV === 'development') {
    console.log('Assessments:', assessments)
    console.log('Pagination:', paginationData)
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Hata: {error instanceof Error ? error.message : 'Bilinmeyen hata'}</p>
          <Button onClick={() => window.location.reload()}>Yeniden Dene</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Değerlendirmeler</h1>
          <p className="text-muted-foreground">Tüm değerlendirmeleri görüntüle</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Değerlendirmeler ({paginationData.total})</CardTitle>
            <CardDescription>
              Sayfa {paginationData.page} / {paginationData.totalPages}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            ) : assessments.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Değerlendirme bulunamadı</p>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment: any) => (
                  <Card key={assessment.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>
                            {assessment.student.firstName} {assessment.student.lastName}
                          </CardTitle>
                          <CardDescription>
                            {new Date(assessment.assessmentDate).toLocaleDateString('tr-TR')} • 
                            Değerlendiren: {assessment.assessor.fullName}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {assessment.notes && (
                        <p className="text-sm mb-4">{assessment.notes}</p>
                      )}
                      {assessment.scores && assessment.scores.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {assessment.scores.map((score: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-2 border rounded text-center"
                            >
                              <p className="text-xs text-muted-foreground mb-1">
                                {score.domain?.nameTr || 'Bilinmeyen'}
                              </p>
                              {score.score && (
                                <p className="font-semibold">{score.score}/5</p>
                              )}
                              {score.percentage && (
                                <p className="text-xs text-muted-foreground">
                                  %{score.percentage}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Henüz skor bulunmuyor</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {paginationData.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  disabled={paginationData.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Önceki
                </Button>
                <span className="text-sm text-muted-foreground">
                  Sayfa {paginationData.page} / {paginationData.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={paginationData.page === paginationData.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Sonraki
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

