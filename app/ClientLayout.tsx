"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { FirebaseProvider } from "@/lib/firebase/firebase-provider"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <FirebaseProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </FirebaseProvider>
  )
}
