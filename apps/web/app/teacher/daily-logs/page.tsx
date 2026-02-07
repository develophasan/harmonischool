"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { Calendar, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTeacherId, useTeacherDailyLogs } from "@/hooks/api/use-teacher"

export default function TeacherDailyLogsPage() {
  const { data: teacherId, isLoading: teacherIdLoading } = useTeacherId()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId')
  const { data: logs = [], isLoading: logsLoading } = useTeacherDailyLogs(teacherId || null, studentId || null)

  const loading = teacherIdLoading || logsLoading

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
            <h1 className="text-4xl font-bold mb-2">Günlük Loglar</h1>
            <p className="text-muted-foreground">
              Öğrencilerinizin günlük aktiviteleri
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Log
          </Button>
        </div>

        {logs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-8 text-muted-foreground">
                Henüz günlük log bulunmuyor.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {logs.map((log: any) => (
              <Card key={log.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {log.student.firstName} {log.student.lastName}
                      </CardTitle>
                      <CardDescription>
                        {new Date(log.logDate).toLocaleDateString("tr-TR")} • {log.class.name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {log.breakfastEaten && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium">
                        Kahvaltı ✓
                      </span>
                    )}
                    {log.lunchEaten && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium">
                        Öğle Yemeği ✓
                      </span>
                    )}
                    {log.napDurationMinutes && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {log.napDurationMinutes} dk uyku
                      </span>
                    )}
                  </div>
                  {log.generalNotes && (
                    <p className="text-sm mb-4">{log.generalNotes}</p>
                  )}
                  <Link href={`/teacher/students/${log.student.id}`}>
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

