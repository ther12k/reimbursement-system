"use client"

import { type ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMobile } from "@/hooks/use-mobile"

interface AppLayoutProps {
  sidebar: ReactNode
  children: ReactNode
  title?: string
}

export function AppLayout({ sidebar, children, title }: AppLayoutProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Get sidebar state from cookie on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(^| )sidebar:collapsed=([^;]+)/)
      setCollapsed(match ? match[2] === "true" : false)
    }
  }, [])

  const toggleCollapsed = () => {
    const newState = !collapsed
    setCollapsed(newState)
    // Save state to cookie
    document.cookie = `sidebar:collapsed=${newState}; path=/; max-age=${60 * 60 * 24 * 365}`
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <>
          {sidebar}
          <div
            className="absolute inset-y-0 transition-all duration-300"
            style={{ left: collapsed ? "70px" : "240px" }}
          >
            <button
              onClick={toggleCollapsed}
              className="absolute -left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-sm"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`} />
            </button>
          </div>
        </>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0">
            {sidebar}
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${isMobile ? "" : collapsed ? "ml-[70px]" : "ml-[240px]"}`}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-4">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-medium">{title}</h1>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <div className="container py-6">{children}</div>
      </main>
    </div>
  )
}
