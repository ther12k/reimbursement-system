"use client"

import { LayoutDashboard, Users, CalendarDays, FileText, Settings } from "lucide-react"
import { useAuth } from "@/lib/firebase/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { AppSidebar, type SidebarRoute } from "@/components/ui/app-sidebar"

export function AdminSidebar({
  collapsed = false,
  onToggleCollapse,
}: { collapsed?: boolean; onToggleCollapse?: () => void }) {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const routes: SidebarRoute[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      label: "Pengguna",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
    {
      label: "Acara",
      icon: CalendarDays,
      href: "/admin/events",
      active: pathname.includes("/admin/events"),
    },
    {
      label: "Laporan",
      icon: FileText,
      href: "/admin/reports",
      active: pathname === "/admin/reports",
    },
    {
      label: "Pengaturan",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
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
    <AppSidebar
      routes={routes}
      logo={
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
          R
        </div>
      }
      onSignOut={handleSignOut}
      collapsed={collapsed}
      onToggleCollapse={onToggleCollapse}
    />
  )
}
