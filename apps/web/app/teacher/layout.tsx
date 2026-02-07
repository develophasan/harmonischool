"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Activity,
  Calendar,
  FileText,
  Brain,
  Mic,
  Send,
} from "lucide-react"
import { motion } from "framer-motion"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/teacher/classes", icon: BookOpen, label: "Sınıflarım" },
    { href: "/teacher/students", icon: GraduationCap, label: "Öğrencilerim" },
    { href: "/teacher/assessments", icon: TrendingUp, label: "Değerlendirmeler" },
    { href: "/teacher/activities", icon: Activity, label: "Aktiviteler" },
    { href: "/teacher/daily-logs", icon: Calendar, label: "Günlük Loglar" },
    { href: "/teacher/reports", icon: FileText, label: "Raporlar" },
    { href: "/teacher/notifications/send", icon: Send, label: "Bildirim Gönder" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-soft via-white to-harmony-soft/50">
      <div className="flex">
        {/* Sidebar - V2 Design */}
        <aside className="w-64 border-r border-harmony-shadow/20 bg-white/60 backdrop-blur-sm p-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-6 w-6 text-harmony-brain" />
              <h2 className="text-xl font-heading font-bold bg-gradient-to-r from-harmony-brain to-harmony-heart bg-clip-text text-transparent">
                Öğretmen
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">Harmoni OS</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all
                    ${
                      isActive
                        ? "bg-gradient-to-r from-harmony-brain/10 to-harmony-heart/10 text-harmony-brain font-medium border border-harmony-brain/20"
                        : "hover:bg-harmony-soft/50 text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-harmony-brain" : ""}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
