"use client"

import { LayoutDashboard, Clock, AlertTriangle, FileCheck, Settings } from "lucide-react"
import { useAuth } from "@/lib/firebase/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { AppSidebar, type SidebarRoute } from "@/components/ui/app-sidebar"

export function ValidatorSidebar({
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
