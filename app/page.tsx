import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-muted/10">
      <header className="container mx-auto py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              R
            </div>
            <h1 className="text-2xl font-bold">ReimburseEase</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simplify Your Reimbursement Process</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Streamlined expense management for organizations of all sizes
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>For Admins</CardTitle>
              <CardDescription>Complete control over the system</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Manage users and permissions</li>
                <li>Create and share events</li>
                <li>Generate QR codes for quick access</li>
                <li>Comprehensive reporting tools</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login?role=admin">Admin Login</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>For Validators</CardTitle>
              <CardDescription>Efficient validation workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Review submission details</li>
                <li>Validate payment data</li>
                <li>AI-assisted document verification</li>
                <li>Approve or reject with comments</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login?role=validator">Validator Login</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>For Users</CardTitle>
              <CardDescription>Simple reimbursement submission</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Submit reimbursement requests</li>
                <li>Scan documents or upload files</li>
                <li>Access events via QR codes</li>
                <li>Track reimbursement status</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login?role=user">User Login</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="bg-card rounded-lg p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Submit Expenses</h4>
              <p className="text-muted-foreground">Upload receipts and fill in expense details</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Validation</h4>
              <p className="text-muted-foreground">Validators review and approve submissions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Get Reimbursed</h4>
              <p className="text-muted-foreground">Receive your approved reimbursements quickly</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-muted/30 py-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 ReimburseEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
