"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Clock, AlertTriangle, FileCheck, Settings, LogOut, ChevronRight } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/firebase/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function ValidatorSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const { state } = useSidebar()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/validator/dashboard",
      active: pathname === "/validator/dashboard",
    },
    {
      label: "Menunggu Review",
      icon: Clock,
      href: "/validator/reimbursements/pending",
      active: pathname === "/validator/reimbursements/pending",
    },
    {
      label: "Perlu Klarifikasi",
      icon: AlertTriangle,
      href: "/validator/reimbursements/clarification",
      active: pathname === "/validator/reimbursements/clarification",
    },
    {
      label: "Disetujui",
      icon: FileCheck,
      href: "/validator/reimbursements/approved",
      active: pathname === "/validator/reimbursements/approved",
    },
    {
      label: "Pengaturan",
      icon: Settings,
      href: "/validator/settings",
      active: pathname === "/validator/settings",
    },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Berhasil keluar",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Gagal keluar",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="border-b border-border h-14 flex items-center">
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              R
            </div>
            {state === "expanded" && <span className="font-semibold text-lg">ReimburseEase</span>}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {routes.map((route) => (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton asChild isActive={route.active} tooltip={route.label}>
                  <Link href={route.href}>
                    <route.icon />
                    <span>{route.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-border p-2">
          <div className="flex items-center justify-between">
            <SidebarMenuButton variant="ghost" onClick={handleSignOut} tooltip="Keluar">
              <LogOut />
              <span>Keluar</span>
            </SidebarMenuButton>
            <ThemeToggle className={state === "collapsed" ? "hidden" : ""} />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <div className="fixed top-0 left-0 right-0 h-14 border-b border-border bg-background md:pl-[var(--sidebar-width)] md:group-data-[collapsible=icon]/sidebar-wrapper:pl-[var(--sidebar-width-icon)] z-10 transition-all duration-300 flex items-center px-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{routes.find((route) => route.active)?.label || "Validator"}</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}
