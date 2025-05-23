import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react" // Import AlertTriangle

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
  variant?: "default" | "error"
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  const defaultErrorIcon = <AlertTriangle className="h-12 w-12 text-destructive" />
  const displayIcon = variant === "error" ? icon || defaultErrorIcon : icon

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      {displayIcon && (
        <div className={cn("mb-4", variant === "error" && !icon ? "" : "text-muted-foreground")}>
          {displayIcon}
        </div>
      )}
      <h3 className={cn("text-lg font-medium", variant === "error" ? "text-destructive" : "")}>{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
