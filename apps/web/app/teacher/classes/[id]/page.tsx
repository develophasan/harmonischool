"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { BookOpen, Users, GraduationCap, ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTeacherClass } from "@/hooks/api/use-teacher"

export default function TeacherClassDetailPage() {
  const params = useParams()
  const { data: classData, isLoading: loading } = useTeacherClass(params.id as string | null)

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
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

  if (!classData) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-center text-muted-foreground">Sınıf bulunamadı</p>
      </div>
    )
  }

  const activeStudents = classData.classStudents?.filter((cs: any) => cs.isActive) || []

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <Link href="/teacher/classes">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">{classData.name}</h1>
          <p className="text-muted-foreground">
            {classData.ageGroup} yaş grubu • {classData.academicYear}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Öğrenci</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStudents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Kapasite: {classData.capacity}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Öğrenciler</CardTitle>
            <CardDescription>
              Sınıftaki tüm öğrenciler
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeStudents.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Bu sınıfta henüz öğrenci bulunmuyor.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeStudents.map((cs: any) => {
                  const age = calculateAge(cs.student.dateOfBirth)
                  return (
                    <Link
                      key={cs.student.id}
                      href={`/teacher/students/${cs.student.id}`}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {cs.student.firstName} {cs.student.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {age} yaşında
                                {cs.student.gender && ` • ${cs.student.gender === 'male' ? 'Erkek' : 'Kız'}`}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <TrendingUp className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

