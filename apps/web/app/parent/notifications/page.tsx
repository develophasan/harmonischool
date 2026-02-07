"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@harmoni/ui"
import { Bell, Check, X, AlertCircle, Info, CheckCircle, AlertTriangle, Sparkles } from "lucide-react"
import { useParentId } from "@/hooks/api/use-parent"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"

export default function ParentNotificationsPage() {
  const { data: parentId } = useParentId()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    if (parentId) {
      loadNotifications()
    }
  }, [parentId, filter])

  const loadNotifications = async () => {
    if (!parentId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/notifications?recipientId=${parentId}&isRead=${filter === "unread" ? "false" : ""}&limit=100`)
      if (!res.ok) {
        // If error, return empty array
        setNotifications([])
        return
      }
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading notifications:", error)
      setNotifications([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      })
      loadNotifications()
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      })
      loadNotifications()
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead)
    await Promise.all(unread.map((n) => markAsRead(n.id)))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-neuro-green" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-alert-amber" />
      case "alert":
        return <AlertCircle className="h-5 w-5 text-risk-red" />
      case "ai_summary":
        return <Sparkles className="h-5 w-5 text-neuro-purple" />
      default:
        return <Info className="h-5 w-5 text-harmony-brain" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-soft via-white to-harmony-soft/50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-harmony-brain to-harmony-heart bg-clip-text text-transparent flex items-center gap-3">
              <Bell className="h-8 w-8 text-harmony-brain" />
              Bildirimler
            </h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 && (
                <span className="text-harmony-heart font-semibold">{unreadCount} okunmamış</span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="rounded-xl">
              <Check className="mr-2 h-4 w-4" />
              Tümünü Okundu İşaretle
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="rounded-xl"
          >
            Tümü ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            className="rounded-xl"
          >
            Okunmamış ({unreadCount})
          </Button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmony-brain"></div>
          </div>
        ) : notifications.length === 0 ? (
          <Card className="rounded-2xl shadow-xl glass-card">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Henüz bildirim yok.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Yeni bildirimler burada görünecek.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.filter(n => n && n.id).map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card
                    className={`rounded-2xl shadow-xl glass-card hover-lift transition-all ${
                      !notification.isRead
                        ? "border-l-4 border-l-harmony-heart"
                        : ""
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{notification.title || 'Bildirim'}</h3>
                              {notification.student && notification.student.firstName && (
                                <Badge variant="outline" className="mb-2">
                                  {notification.student.firstName} {notification.student.lastName || ''}
                                </Badge>
                              )}
                            </div>
                            {!notification.isRead && (
                              <div className="h-2 w-2 rounded-full bg-harmony-heart"></div>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3">{notification.message || ''}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {notification.createdAt && (
                                <span>
                                  {format(new Date(notification.createdAt), "dd MMMM yyyy, HH:mm", {
                                    locale: tr,
                                  })}
                                </span>
                              )}
                              {notification.senderType === "ai" ? (
                                <span>🤖 AI</span>
                              ) : notification.sender?.fullName ? (
                                <span>{notification.sender.fullName}</span>
                              ) : notification.senderType ? (
                                <span>{notification.senderType}</span>
                              ) : null}
                            </div>
                            <div className="flex gap-2">
                              {!notification.isRead && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                  className="rounded-lg"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                                className="rounded-lg text-muted-foreground hover:text-risk-red"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {notification.actionUrl && (
                            <Button
                              variant="link"
                              className="mt-2 p-0 h-auto"
                              onClick={() => {
                                if (notification.actionUrl) {
                                  window.location.href = notification.actionUrl
                                }
                              }}
                            >
                              Detayları Gör →
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

