"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useFirebase } from "@/lib/firebase/hooks/use-firebase"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { ThemeToggle } from "@/components/theme-toggle"
import { AlertCircle, Info } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signIn, loading } = useFirebase()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const result = await signIn(email, password)

      if (result) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        // Redirect to dashboard based on user role
        // This will be handled by the AppShell component
        router.push("/")
      }
    } catch (error: any) {
      console.error("Login error:", error)

      let errorMessage = "Invalid email or password."

      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Make sure you've created test users first."
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email. Please create test users first."
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Try 'password123' for test accounts."
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later."
      }

      setError(errorMessage)
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const fillTestCredentials = (role: string) => {
    setEmail(`${role}@example.com`)
    setPassword("password123")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10 dark:bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
          R
        </div>
        <span className="text-2xl font-bold">ReimburseEase</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">Enter your email and password to sign in</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <div className="font-medium mb-2">Test Credentials:</div>
                <div className="space-y-1">
                  <div>Admin: admin@example.com / password123</div>
                  <div>Validator: validator@example.com / password123</div>
                  <div>User: user@example.com / password123</div>
                </div>
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  If login fails, please create test users first from the home page.
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Quick fill buttons */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Quick fill test credentials:</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCredentials("admin")}
                  disabled={loading}
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCredentials("validator")}
                  disabled={loading}
                >
                  Validator
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCredentials("user")}
                  disabled={loading}
                >
                  User
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Sign In
            </Button>
            <div className="text-center text-sm">
              {"Don't have an account? "}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
              {" or "}
              <Link href="/" className="text-primary font-semibold hover:underline">
                Create test users
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
