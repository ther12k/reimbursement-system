"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, CalendarDays, FileText, Settings, LogOut } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      label: "Users",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
    {
      label: "Events",
      icon: CalendarDays,
      href: "/admin/events",
      active: pathname.includes("/admin/events"),
    },
    {
      label: "Reports",
      icon: FileText,
      href: "/admin/reports",
      active: pathname === "/admin/reports",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="group/sidebar h-screen w-[80px] lg:w-[250px] border-r border-border bg-background flex flex-col z-30 fixed">
      <div className="h-[60px] w-full border-b border-border flex items-center px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="relative h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
            R
          </div>
          <span className="font-semibold text-xl hidden lg:flex">ReimburseEase</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 overflow-auto">
        <div className="flex flex-col gap-2 p-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "secondary" : "ghost"}
              className={cn(
                "flex h-10 items-center justify-start gap-2 px-3",
                route.active ? "bg-secondary" : "hover:bg-secondary/50",
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-5 w-5" />
                <span className="hidden lg:flex">{route.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="h-[60px] w-full border-t border-border flex items-center p-2">
        <Button variant="ghost" className="flex h-10 w-full items-center justify-start gap-2 px-3" asChild>
          <Link href="/login">
            <LogOut className="h-5 w-5" />
            <span className="hidden lg:flex">Logout</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
