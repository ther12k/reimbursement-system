import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10 dark:bg-background p-4 relative">
      {/* Skeleton for ThemeToggle */}
      <div className="absolute top-4 right-4">
        <Skeleton className="h-10 w-10" />
      </div>

      {/* Skeleton for Logo and App Name */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-7 w-36" /> {/* App Name "ReimburseEase" */}
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 items-center">
          <Skeleton className="h-7 w-24 mx-auto" /> {/* Sign In title */}
          <Skeleton className="h-4 w-56 mx-auto" /> {/* Description */}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Skeleton for Test Credentials Alert */}
          <div className="p-4 border rounded-md">
            <Skeleton className="h-5 w-32 mb-2" /> {/* Alert Title */}
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-3 w-48 mt-2" />
          </div>

          {/* Skeleton for Email Input */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>

          {/* Skeleton for Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-3 w-24" /> {/* Forgot password link */}
            </div>
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>

          {/* Skeleton for Quick Fill Buttons */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" /> {/* Label */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Skeleton className="h-10 w-full" /> {/* Sign In Button */}
          <Skeleton className="h-4 w-64 mx-auto" /> {/* "Don't have an account?" text */}
        </CardFooter>
      </Card>
    </div>
  )
}
