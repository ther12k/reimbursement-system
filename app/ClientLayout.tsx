"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { FirebaseProvider } from "@/lib/firebase/context/firebase-provider"
import { AppShell } from "@/components/shared/app-shell"
import { useState, useEffect } from "react"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Add event listeners for online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Show offline message when the user is offline
  if (!isOnline) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">You're Offline</h2>
          <p className="mb-6 max-w-md text-gray-600">Please check your internet connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
        <Toaster />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FirebaseProvider>
        <AppShell>{children}</AppShell>
      </FirebaseProvider>
      <Toaster />
    </ThemeProvider>
  )
}
