"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { Users, BookOpen, Activity, TrendingUp, Mic, Brain, Plus, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useTeacherId, useTeacherClasses, useTeacherStats, useTeacherActivities } from "@/hooks/api/use-teacher"
import { motion } from "framer-motion"

export default function TeacherDashboardPage() {
  const { data: teacherId, isLoading: teacherIdLoading, error: teacherIdError } = useTeacherId()
  const { data: classes = [], isLoading: classesLoading, error: classesError } = useTeacherClasses(teacherId || null)
  const { data: stats, isLoading: statsLoading, error: statsError } = useTeacherStats(teacherId || null)
  const { data: neuroActivities = [], isLoading: activitiesLoading, error: activitiesError } = useTeacherActivities(teacherId || null)

  const loading = teacherIdLoading || classesLoading || statsLoading || activitiesLoading
  const error = teacherIdError || classesError || statsError || activitiesError

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
    <div className="min-h-screen p-4 md:p-8 pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Başlık - V2 Design: Notion Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-heading font-bold mb-3 gradient-text-harmony">
            Good Morning Hasan 🌿
          </h1>
          <p className="text-muted-foreground text-lg">
            Sınıflarınızı yönetin ve öğrencilerinizin gelişimini takip edin
          </p>
        </motion.div>

        {/* Bugünkü Öğrenciler - V2 Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-2xl shadow-xl border-0 glass-card">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Bugünkü Öğrenciler</CardTitle>
              <CardDescription>Today's class overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold font-mono text-harmony-brain mb-2">{stats?.total_students || 0}</div>
              <p className="text-sm text-muted-foreground">Active students today</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Riskli Çocuklar - V2 Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-2xl shadow-xl border-0 glass-card alert-border-left alert-border-amber">
            <CardHeader>
              <CardTitle className="text-xl font-heading flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-alert-amber" />
                Riskli Çocuklar
              </CardTitle>
              <CardDescription>Students requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold font-mono text-alert-amber mb-2">2</div>
              <p className="text-sm text-muted-foreground">Emotional regression detected</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Günün Önerisi - V2 Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-2xl shadow-xl border-0 glass-card">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Günün Önerisi</CardTitle>
              <CardDescription>AI-powered activity recommendation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Bugün sosyal-duygusal gelişim aktivitelerine odaklanmanız önerilir.
              </p>
              <Button className="w-full rounded-xl bg-neuro-purple hover:bg-neuro-purple/90">
                View Recommendation
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sticky Bottom Bar - V2 Design */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-harmony-shadow/20 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
            <Button className="rounded-2xl px-6 py-6 h-auto bg-harmony-brain hover:bg-harmony-brain/90 flex items-center gap-2">
              <Mic className="h-5 w-5" />
              <span className="font-heading">Voice Log</span>
            </Button>
            <Button className="rounded-2xl px-6 py-6 h-auto bg-neuro-purple hover:bg-neuro-purple/90 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <span className="font-heading">Quick Score</span>
            </Button>
            <Button className="rounded-2xl px-6 py-6 h-auto bg-harmony-heart hover:bg-harmony-heart/90 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              <span className="font-heading">Add Note</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sınıf Listesi */}
          <Card className="rounded-2xl shadow-xl border-0 glass-card">
            <CardHeader>
              <CardTitle>Sınıflarım</CardTitle>
              <CardDescription>
                Yönetmek istediğiniz sınıfı seçin
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Henüz sınıfınız bulunmuyor.
                </p>
              ) : (
                <div className="space-y-3">
                  {classes.map((cls: any) => (
                    <Link key={cls.id} href={`/teacher/classes/${cls.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <div>
                          <h3 className="font-semibold">{cls.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {cls.ageGroup} yaş grubu • {cls.student_count || 0} öğrenci
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Aç
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Günün Nöro-Aktivitesi */}
          <Card className="rounded-2xl shadow-xl border-0 glass-card">
            <CardHeader>
              <CardTitle>Günün Nöro-Aktivitesi</CardTitle>
              <CardDescription>
                Öğrencileriniz için önerilen gelişim aktiviteleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              {neuroActivities.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Bugün için önerilen aktivite bulunmuyor.
                </p>
              ) : (
                <div className="space-y-4">
                  {neuroActivities.map((item: any) => (
                    <div
                      key={item.id || item.activity.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">
                              {item.student.firstName} {item.student.lastName}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-md font-medium ${
                                item.priority === "high"
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : item.priority === "medium"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-green-50 text-green-700 border border-green-200"
                              }`}
                            >
                              {item.priority === "high"
                                ? "Yüksek Öncelik"
                                : item.priority === "medium"
                                ? "Orta Öncelik"
                                : "Düşük Öncelik"}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-primary">
                            {item.activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.domain?.nameTr || item.activity.domain?.nameTr}
                          </p>
                          {item.reason && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.reason}
                            </p>
                          )}
                          {item.activity.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.activity.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/teacher/students/${item.student.id}`}>
                          <Button size="sm" className="flex-1">
                            Öğrenci Detayı
                          </Button>
                        </Link>
                        <Link href={`/teacher/activities?studentId=${item.student.id}`}>
                          <Button size="sm" variant="outline">
                            Tüm Aktiviteler
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

