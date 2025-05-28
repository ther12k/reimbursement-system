"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { UserSidebar } from "@/components/user/user-sidebar"
import { AppLayout } from "@/components/layout/app-layout"
import { usePathname } from "next/navigation"

export default function UserLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Get page title based on pathname
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean)
    const lastSegment = segments[segments.length - 1]

    if (!lastSegment) return "User Dashboard"

    // Capitalize and replace dashes with spaces
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <AppLayout
      sidebar={<UserSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />}
      title={getPageTitle()}
    >
      {children}
    </AppLayout>
  )
}
