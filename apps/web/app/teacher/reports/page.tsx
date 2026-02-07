"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@harmoni/ui"
import { FileText, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function TeacherReportsPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Raporlar</h1>
          <p className="text-muted-foreground">
            Öğrencilerinizin gelişim raporları
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Rapor özellikleri yakında eklenecek.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

