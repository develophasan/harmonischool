"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { Activity, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useParentId, useParentChildren } from "@/hooks/api/use-parent"
import { useMemo } from "react"

export default function ParentActivitiesPage() {
  const { data: parentId, isLoading: parentIdLoading } = useParentId()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId')
  const { data: children = [], isLoading: childrenLoading } = useParentChildren(parentId || null)

  const loading = parentIdLoading || childrenLoading

  const activities = useMemo(() => {
    if (!children.length) return []
    
    const allActivities: any[] = []
    children
      .filter((child: any) => !studentId || child.id === studentId)
      .forEach((child: any) => {
        if (child.activityRecommendations) {
          child.activityRecommendations.forEach((rec: any) => {
            allActivities.push({
              id: rec.id,
              activity: rec.activity,
              domain: rec.domain,
              reason: rec.reason,
              student: {
                id: child.id,
                firstName: child.firstName,
                lastName: child.lastName,
              },
            })
          })
        }
      })
    return allActivities
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
          <h1 className="text-4xl font-bold mb-2">Önerilen Aktiviteler</h1>
          <p className="text-muted-foreground">
            Çocuğunuzun gelişimi için önerilen aktiviteler
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
                        <CardTitle>{activity.activity.title}</CardTitle>
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
                  {activity.activity.description && (
                    <p className="text-sm mb-4">{activity.activity.description}</p>
                  )}
                  <Link href={`/parent/children/${activity.student.id}`}>
                    <Button variant="outline" size="sm">
                      Çocuk Detayı
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
