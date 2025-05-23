"use client"

import { LayoutDashboard, FileText, PlusCircle, CalendarDays, Settings } from "lucide-react"
import { useFirebase } from "@/lib/firebase/hooks/use-firebase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { AppSidebar, type SidebarRoute } from "@/components/ui/app-sidebar"

export function UserSidebar({
  collapsed = false,
  onToggleCollapse,
}: { collapsed?: boolean; onToggleCollapse?: () => void }) {
  const pathname = usePathname()
  const { signOut } = useFirebase()
  const { toast } = useToast()
  const router = useRouter()

  const routes: SidebarRoute[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/user/dashboard",
      active: pathname === "/user/dashboard",
    },
    {
      label: "Reimbursement Baru",
      icon: PlusCircle,
      href: "/user/reimbursements/new",
      active: pathname === "/user/reimbursements/new",
    },
    {
      label: "Reimbursement Saya",
      icon: FileText,
      href: "/user/reimbursements",
      active: pathname === "/user/reimbursements" && !pathname.includes("/new"),
    },
    {
      label: "Acara",
      icon: CalendarDays,
      href: "/user/events",
      active: pathname === "/user/events",
    },
    {
      label: "Pengaturan",
      icon: Settings,
      href: "/user/settings",
      active: pathname === "/user/settings",
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
