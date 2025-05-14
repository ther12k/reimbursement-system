import type { ReactNode } from "react"
import { ValidatorSidebar } from "@/components/validator/validator-sidebar"
import { AppShell } from "@/components/shared/app-shell"

export default function ValidatorLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <ValidatorSidebar />
      <div className="flex-1 md:pl-[var(--sidebar-width)] md:group-data-[collapsible=icon]/sidebar-wrapper:pl-[var(--sidebar-width-icon)] pt-14 transition-all duration-300">
        <div className="p-6">{children}</div>
      </div>
    </AppShell>
  )
}
