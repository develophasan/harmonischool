"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { GraduationCap, Users, BookOpen, Heart, Brain, Activity } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-4 tracking-tight text-foreground">
            Harmoni Anaokulu
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6">
            Nörobilim Temelli Bütünleşik Eğitim Platformu
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            2-6 yaş arası çocukların bilişsel (zihin) ve duygusal (kalp) gelişimini 
            bütünsel olarak takip eden modern eğitim platformu
          </p>
        </div>

        {/* Giriş Seçenekleri */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 sm:mb-16">
          <Link href="/admin">
            <Card className="h-full cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">İdare / Okul Yönetimi</CardTitle>
                <CardDescription className="text-sm">
                  Sistem yönetimi, kullanıcı yönetimi ve genel bakış
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Panele Git</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/teacher/dashboard">
            <Card className="h-full cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Öğretmen Paneli</CardTitle>
                <CardDescription className="text-sm">
                  Sınıf yönetimi, öğrenci takibi ve değerlendirmeler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Panele Git</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/parent/dashboard">
            <Card className="h-full cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Veli Paneli</CardTitle>
                <CardDescription className="text-sm">
                  Çocuğunuzun gelişimini takip edin ve aktiviteleri görün
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Panele Git</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Özellikler */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-6 sm:mb-8 tracking-tight text-foreground">10 Nörogelişimsel Alan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {[
              { name: 'Yürütücü İşlevler', icon: Brain },
              { name: 'Dil ve İletişim', icon: Users },
              { name: 'Sosyal/Duygusal', icon: Heart },
              { name: 'Kaba Motor', icon: Activity },
              { name: 'İnce Motor', icon: Activity },
              { name: 'Mantıksal/Sayısal', icon: Brain },
              { name: 'Yaratıcı İfade', icon: Heart },
              { name: 'Mekansal Farkındalık', icon: Brain },
              { name: 'Dünya Keşfi', icon: GraduationCap },
              { name: 'Öz-Bakım', icon: Users },
            ].map((item, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="pt-6 pb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">{item.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bilgi */}
        <Card className="bg-muted/30 border-border">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                MindChamps ve Harvard Center on the Developing Child metodolojilerinden esinlenilmiştir.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
