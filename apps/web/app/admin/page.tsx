"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { Users, GraduationCap, BookOpen, Activity, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useAdminDashboard } from "@/hooks/api/use-admin"
import { motion } from "framer-motion"

export default function AdminDashboardPage() {
  const { data, isLoading: loading, error } = useAdminDashboard()
  const stats = data?.stats || null

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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Başlık - V2 Design */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-harmony-brain to-harmony-heart bg-clip-text text-transparent">
            İdare / Okul Yönetim Paneli
          </h1>
          <p className="text-muted-foreground">
            Harmoni OS - Neuro Development Operating System
          </p>
        </div>

        {/* İstatistikler - V2 Design: Enterprise Feel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-2xl shadow-xl border-0 glass-card hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">Total Students</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-harmony-brain/10 to-harmony-brain/5 flex items-center justify-center">
                  <Users className="h-6 w-6 text-harmony-brain" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold font-mono text-harmony-brain mb-1">{stats?.totalStudents || 0}</div>
                <p className="text-xs text-muted-foreground font-mono">
                  {stats?.totalTeachers || 0} teachers, {stats?.totalParents || 0} parents
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-2xl shadow-xl border-0 glass-card hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">Growth</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-neuro-green/10 to-neuro-green/5 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-neuro-green" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold font-mono text-neuro-green mb-1">+12%</div>
                <p className="text-xs text-muted-foreground font-mono">vs last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-2xl shadow-xl border-0 glass-card hover-lift alert-border-left alert-border-amber">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">Alerts</CardTitle>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-alert-amber/10 to-alert-amber/5 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-alert-amber" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold font-mono text-alert-amber mb-1">3</div>
                <p className="text-xs text-muted-foreground font-mono">requires attention</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Neuro Trends Chart - V2 Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="rounded-2xl shadow-xl border-0 glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Neuro Trends Chart</CardTitle>
              <CardDescription>Development trends across all students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Chart visualization coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Classes & AI Insights - V2 Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="rounded-2xl shadow-xl border-0 glass-card hover-lift">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Classes</CardTitle>
                <CardDescription>Active class overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-harmony-brain mb-2">{stats?.activeClasses || 0}</div>
                <p className="text-sm text-muted-foreground">Active classes</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="rounded-2xl shadow-xl border-0 glass-card hover-lift">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <span className="text-neuro-purple">🧠</span> AI Insights
                </CardTitle>
                <CardDescription>AI-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">5 new insights available</p>
                  <Button className="w-full rounded-xl bg-neuro-purple hover:bg-neuro-purple/90">
                    View Insights
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  )
}

