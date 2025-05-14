"use client"

import { type ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/firebase/auth"
import { useSeedData } from "@/lib/firebase/seed-data"
import { useToast } from "@/hooks/use-toast"

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuth()
  const { seedAllData } = useSeedData()
  const { toast } = useToast()
  const [dataSeeded, setDataSeeded] = useState(false)

  // Get sidebar state from cookie
  const getSidebarState = (): boolean => {
    if (typeof window === "undefined") return true
    const match = document.cookie.match(/(^| )sidebar:state=([^;]+)/)
    return match ? match[2] === "true" : true
  }

  // Seed data when user is authenticated
  useEffect(() => {
    const seedData = async () => {
      if (user && !dataSeeded) {
        try {
          await seedAllData()
          setDataSeeded(true)
        } catch (error) {
          console.error("Error seeding data:", error)
          toast({
            title: "Error",
            description: "Failed to seed initial data",
            variant: "destructive",
          })
        }
      }
    }

    if (!authLoading && user) {
      seedData()
    }
  }, [user, authLoading, dataSeeded, seedAllData, toast])

  // Skip rendering the sidebar on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/"

  if (isAuthPage) {
    return <>{children}</>
  }

  return <SidebarProvider defaultOpen={getSidebarState()}>{children}</SidebarProvider>
}
