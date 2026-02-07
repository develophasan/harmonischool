import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Harmoni Anaokulu - Nörobilim Temelli Eğitim Platformu",
  description: "2-6 yaş arası çocukların bilişsel ve duygusal gelişimini takip eden platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

