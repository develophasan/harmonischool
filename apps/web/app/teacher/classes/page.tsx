"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { BookOpen, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTeacherId, useTeacherClasses } from "@/hooks/api/use-teacher"

export default function TeacherClassesPage() {
  const { data: teacherId, isLoading: teacherIdLoading, error: teacherIdError } = useTeacherId()
  const { data: classes = [], isLoading: classesLoading, error: classesError } = useTeacherClasses(teacherId || null)

  const loading = teacherIdLoading || classesLoading
  const error = teacherIdError || classesError

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
          <h1 className="text-4xl font-bold mb-2">Sınıflarım</h1>
          <p className="text-muted-foreground">
            Yönetmek istediğiniz sınıfı seçin
          </p>
        </div>

        {classes.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-8 text-muted-foreground">
                Henüz sınıfınız bulunmuyor.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classData) => (
              <Link key={classData.id} href={`/teacher/classes/${classData.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle>{classData.name}</CardTitle>
                    <CardDescription>
                      {classData.ageGroup} yaş grubu • {classData.academicYear}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {classData.student_count} öğrenci
                      </span>
                    </div>
                    <Button className="w-full">
                      Sınıfı Aç
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

