"use client"

import { type ReactNode, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useFirebase } from "@/lib/firebase/hooks/use-firebase"
import { useSeedData } from "@/lib/firebase/utils/seed-data"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading: authLoading, error: authError } = useFirebase()
  const { seedAllData } = useSeedData()
  const { toast } = useToast()
  const [dataSeeded, setDataSeeded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [seedError, setSeedError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  // Check if current page is an auth page
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/"

  // Seed data when user is authenticated
  useEffect(() => {
    const seedData = async () => {
      if (user && !dataSeeded && !seedError) {
        try {
          await seedAllData()
          setDataSeeded(true)
          setSeedError(null)
        } catch (error) {
          console.error("Error seeding data:", error)
          setSeedError(error instanceof Error ? error : new Error("Unknown error seeding data"))

          // Retry seeding if under max retries
          if (retryCount < maxRetries) {
            console.log("Retrying data seeding (" + (retryCount + 1) + "/" + maxRetries + ")...")
            setTimeout(() => {
              setRetryCount((prev) => prev + 1)
            }, 2000) // Retry after 2 seconds
          } else {
            toast({
              title: "Warning",
              description: "Some initial data could not be loaded. Some features may be limited.",
              variant: "destructive",
            })
          }
        }
      }
    }

    if (!authLoading && !authError) {
      seedData()
      setIsLoading(false)
    }
  }, [user, authLoading, dataSeeded, seedAllData, toast, authError, seedError, retryCount])

  // Handle authentication redirects
  useEffect(() => {
    if (!authLoading) {
      // If not on auth page and not logged in, redirect to login
      if (!isAuthPage && !user) {
        router.push("/login")
      }

      // If on auth page and logged in, redirect to appropriate dashboard
      // This would need to be enhanced with role-based redirects in a real app
      if (isAuthPage && user) {
        // For demo purposes, just redirect to user dashboard
        // In a real app, you'd check the user's role
        router.push("/user/dashboard")
      }
    }
  }, [user, authLoading, isAuthPage, router])

  // Show loading state
  if (isLoading || authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show error state if there's an authentication error
  if (authError) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Connection Error</h2>
        <p className="mb-6 max-w-md text-gray-600">
          We're having trouble connecting to our authentication services. This could be due to network issues or the
          service might be temporarily unavailable.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  // For auth pages, render without layout
  if (isAuthPage) {
    return <>{children}</>
  }

  // For protected pages, render with layout
  return <>{children}</>
}
