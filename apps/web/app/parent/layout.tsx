"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Heart, TrendingUp, Activity, Calendar, Sparkles, Bell, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: "/parent/home", icon: Sparkles, label: "Bugün", new: true },
    { href: "/parent/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/parent/monitor", icon: BarChart3, label: "Performans Monitörü", new: true },
    { href: "/parent/children", icon: Heart, label: "Çocuklarım" },
    { href: "/parent/reports", icon: TrendingUp, label: "Gelişim Raporları" },
    { href: "/parent/activities", icon: Activity, label: "Önerilen Aktiviteler" },
    { href: "/parent/notifications", icon: Bell, label: "Bildirimler" },
    { href: "/parent/calendar", icon: Calendar, label: "Takvim" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-soft via-white to-harmony-soft/50">
      <div className="flex">
        {/* Sidebar - V2 Design */}
        <aside className="w-64 border-r border-harmony-shadow/20 bg-white/60 backdrop-blur-sm p-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-6 w-6 text-harmony-heart" />
              <h2 className="text-xl font-heading font-bold bg-gradient-to-r from-harmony-heart to-harmony-brain bg-clip-text text-transparent">
                Veli
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
                    flex items-center gap-3 p-3 rounded-xl transition-all relative
                    ${
                      isActive
                        ? "bg-gradient-to-r from-harmony-heart/10 to-harmony-brain/10 text-harmony-heart font-medium border border-harmony-heart/20"
                        : "hover:bg-harmony-soft/50 text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-harmony-heart" : ""}`} />
                  <span>{item.label}</span>
                  {item.new && (
                    <span className="ml-auto text-xs bg-neuro-purple/10 text-neuro-purple px-2 py-0.5 rounded-full">
                      Yeni
                    </span>
                  )}
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

