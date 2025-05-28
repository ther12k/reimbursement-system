"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useFirebase } from "@/lib/firebase/hooks/use-firebase"
import { AlertCircle, CheckCircle, Loader2, Users } from "lucide-react"

export function CreateTestUsers() {
  const { signUp } = useFirebase()
  const [isCreating, setIsCreating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [createdUsers, setCreatedUsers] = useState<string[]>([])

  const testUsers = [
    { email: "admin@example.com", password: "password123", displayName: "Admin User", role: "admin" },
    { email: "validator@example.com", password: "password123", displayName: "Validator User", role: "validator" },
    { email: "user@example.com", password: "password123", displayName: "Regular User", role: "user" },
  ]

  const handleCreateUsers = async () => {
    setIsCreating(true)
    setSuccess(false)
    setError(null)
    setCreatedUsers([])

    try {
      const newlyCreated: string[] = []

      for (const user of testUsers) {
        setCurrentUser(user.email)
        try {
          await signUp(user.email, user.password, user.displayName, user.role)
          console.log(`Created user: ${user.email}`)
          newlyCreated.push(user.email)
        } catch (err: any) {
          // If user already exists, that's okay
          if (err.code === "auth/email-already-in-use") {
            console.log(`User already exists: ${user.email}`)
          } else {
            console.error(`Error creating ${user.email}:`, err)
            // Continue with other users even if one fails
          }
        }
        // Small delay between user creation
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      setCreatedUsers(newlyCreated)
      setSuccess(true)
    } catch (err: any) {
      console.error("Error creating test users:", err)
      setError(err.message || "Failed to create test users")
    } finally {
      setIsCreating(false)
      setCurrentUser(null)
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Create Test Users
        </CardTitle>
        <CardDescription>
          Create test users with different roles for testing the application. You only need to do this once.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-medium mb-3">Test Accounts</h3>
            <div className="space-y-3">
              {testUsers.map((user) => (
                <div key={user.email} className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium capitalize">{user.role}</span>
                    <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500">password123</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isCreating && (
            <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating {currentUser}...</span>
            </div>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                {createdUsers.length > 0 ? (
                  <>
                    Created {createdUsers.length} new user(s). All test accounts are now ready for use. You can now go
                    to the login page and use any of the credentials above.
                  </>
                ) : (
                  <>
                    All test users already exist and are ready for use. You can now log in with any of the accounts
                    above.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreateUsers} disabled={isCreating} className="w-full">
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Users...
            </>
          ) : (
            "Create Test Users"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
