"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { useSeedUsers } from "@/lib/firebase/utils/seed-users"
import { useToast } from "@/hooks/use-toast"

export function SeedDemoUsers() {
  const { seedDemoUsers, isSeeding, seedingProgress, demoUsers } = useSeedUsers()
  const { toast } = useToast()

  const handleSeedUsers = async () => {
    try {
      const success = await seedDemoUsers()
      if (success) {
        toast({
          title: "Demo users created",
          description: "You can now log in with the demo credentials below.",
        })
      } else {
        toast({
          title: "Failed to create demo users",
          description: "Please check the console for more details.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error creating demo users",
        description: "Please check your Firebase configuration.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Demo User Setup</CardTitle>
        <CardDescription>
          Create demo users for testing the application. This will create actual Firebase Auth users with different
          roles.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={handleSeedUsers} disabled={isSeeding}>
            {isSeeding ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            {isSeeding ? "Creating Users..." : "Create Demo Users"}
          </Button>
          {seedingProgress && <span className="text-sm text-muted-foreground">{seedingProgress}</span>}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Demo Credentials:</h4>
          {demoUsers.map((user) => (
            <div key={user.email} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={user.role === "admin" ? "default" : user.role === "validator" ? "secondary" : "outline"}
                  >
                    {user.role}
                  </Badge>
                  <span className="font-medium">{user.email}</span>
                </div>
                <p className="text-sm text-muted-foreground">Password: {user.password}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> These demo users will be created in Firebase Authentication. You can use these
            credentials to log in and test different user roles.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
