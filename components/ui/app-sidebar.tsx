"use client"

import type React from "react"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export interface SidebarRoute {
  label: string
  icon: React.ElementType
  href: string
  active?: boolean
}

interface AppSidebarProps {
  routes: SidebarRoute[]
  logo: ReactNode
  onSignOut: () => Promise<void>
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function AppSidebar({ routes, logo, onSignOut, collapsed = false, onToggleCollapse }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300",
          collapsed ? "w-[70px]" : "w-[240px]",
        )}
      >
        <div className="flex h-14 items-center border-b px-3">
          <div className="flex w-full items-center gap-2">
            {logo}
            {!collapsed && <span className="font-semibold text-lg">ReimburseEase</span>}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-2">
            {routes.map((route) => {
              const isActive = route.active !== undefined ? route.active : pathname === route.href

              return (
                <Tooltip key={route.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "flex h-10 w-full items-center justify-start gap-2 px-3",
                        collapsed && "justify-center px-0",
                      )}
                      asChild
                    >
                      <Link href={route.href}>
                        <route.icon className="h-5 w-5" />
                        {!collapsed && <span>{route.label}</span>}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">{route.label}</TooltipContent>}
                </Tooltip>
              )
            })}
          </div>
        </ScrollArea>

        <div className="border-t p-2">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(!collapsed && "mr-auto")} onClick={onSignOut}>
                  <LogOut className="h-5 w-5" />
                  {!collapsed && <span className="ml-2">Keluar</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Keluar</TooltipContent>}
            </Tooltip>
            {!collapsed && <ThemeToggle />}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
