import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateTestUsers } from "@/components/admin/create-test-users"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
              R
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">ReimburseEase</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Streamline your reimbursement process with our comprehensive management system
          </p>
        </div>

        {/* Setup Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">🚀 First Time Setup</CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                Before you can log in, you need to create test users in Firebase. Click the button below to create demo
                accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <CreateTestUsers />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">A</span>
                </div>
                Admin Dashboard
              </CardTitle>
              <CardDescription>
                Comprehensive management tools for administrators to oversee the entire reimbursement process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• User management</li>
                <li>• Event creation</li>
                <li>• Reports and analytics</li>
                <li>• System configuration</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">V</span>
                </div>
                Validator Portal
              </CardTitle>
              <CardDescription>
                Efficient tools for validators to review and approve reimbursement requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Review submissions</li>
                <li>• Document verification</li>
                <li>• Approval workflow</li>
                <li>• Communication tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">U</span>
                </div>
                User Interface
              </CardTitle>
              <CardDescription>
                Simple and intuitive interface for users to submit reimbursement requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Submit requests</li>
                <li>• Upload documents</li>
                <li>• Track status</li>
                <li>• View history</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Login Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Get Started?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            After creating test users above, you can log in with different roles to explore the system
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="min-w-[120px]">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="min-w-[120px]">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
