"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { Activity, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTeacherId, useTeacherActivities } from "@/hooks/api/use-teacher"

export default function TeacherActivitiesPage() {
  const { data: teacherId, isLoading: teacherIdLoading } = useTeacherId()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId')
  const { data: activities = [], isLoading: activitiesLoading } = useTeacherActivities(teacherId || null, studentId || null)

  const loading = teacherIdLoading || activitiesLoading

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
          <h1 className="text-4xl font-bold mb-2">Önerilen Aktiviteler</h1>
          <p className="text-muted-foreground">
            Öğrencileriniz için önerilen nöro-aktiviteler
          </p>
        </div>

        {activities.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-8 text-muted-foreground">
                Henüz aktivite önerisi bulunmuyor.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity: any) => (
              <Card key={activity.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: activity.domain.color + '20' }}
                      >
                        <Activity className="h-5 w-5" style={{ color: activity.domain.color }} />
                      </div>
                      <div>
                        <CardTitle>{activity.title}</CardTitle>
                        <CardDescription>
                          {activity.student.firstName} {activity.student.lastName} • {activity.domain.nameTr}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {activity.reason && (
                    <p className="text-sm mb-3 text-muted-foreground">
                      <strong>Öneri Nedeni:</strong> {activity.reason}
                    </p>
                  )}
                  {activity.description && (
                    <p className="text-sm mb-4">{activity.description}</p>
                  )}
                  <Link href={`/teacher/students/${activity.student.id}`}>
                    <Button variant="outline" size="sm">
                      Öğrenci Detayı
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

