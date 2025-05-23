"use client"

import { type ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMobile } from "@/hooks/use-mobile"
import { useFirebase } from "@/lib/firebase/hooks/use-firebase" // Added useFirebase
import AdminSidebar from "@/components/admin/admin-sidebar" // Added AdminSidebar
import UserSidebar from "@/components/user/user-sidebar" // Added UserSidebar
import ValidatorSidebar from "@/components/validator/validator-sidebar" // Added ValidatorSidebar

interface AppLayoutProps {
  // sidebar: ReactNode, // Removed sidebar prop
  children: ReactNode
  title?: string
}

export function AppLayout({ children, title }: AppLayoutProps) { // Removed sidebar from props
  const pathname = usePathname()
  const isMobile = useMobile()
  const { user: appUser } = useFirebase() // Get appUser from Firebase context
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

  // Determine which sidebar to render
  let RoleSpecificSidebar: ReactNode | null = null
  if (appUser) {
    switch (appUser.role) {
      case "admin":
        RoleSpecificSidebar = <AdminSidebar />
        break
      case "user":
        RoleSpecificSidebar = <UserSidebar />
        break
      case "validator":
        RoleSpecificSidebar = <ValidatorSidebar />
        break
      default:
        RoleSpecificSidebar = null // Or a default/error sidebar if necessary
        break
    }
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && RoleSpecificSidebar && ( // Render only if a sidebar is determined and not mobile
        <>
          {RoleSpecificSidebar}
          <div
            className="absolute inset-y-0 transition-all duration-300"
            style={{ left: collapsed ? "70px" : "240px" }}
          >
            <button
              onClick={toggleCollapsed}
              className="absolute -left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`} />
            </button>
          </div>
        </>
      )}

      {/* Mobile Sidebar */}
      {isMobile && RoleSpecificSidebar && ( // Render only if a sidebar is determined and is mobile
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0">
            {RoleSpecificSidebar}
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
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="mr-2" aria-label="Open navigation menu">
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
