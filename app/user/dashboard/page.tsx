"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import UserReimbursementsTable from "@/components/user-reimbursements-table"
import { formatRupiah } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFirebase } from "@/lib/firebase/hooks/use-firebase"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart" // Import Chart components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts" // Import Recharts components

const userSpendingData = [
  { month: "May", spending: 2500000, fill: "var(--color-spending)" },
  { month: "Jun", spending: 1750000, fill: "var(--color-spending)" },
  { month: "Jul", spending: 3100000, fill: "var(--color-spending)" },
];

const userSpendingChartConfig = {
  spending: {
    label: "Spending (Rp)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function UserDashboard() {
  const { user: appUser, loading: authLoading } = useFirebase()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (!appUser) {
        router.replace("/login")
      } else if (appUser.role !== "user") {
        switch (appUser.role) {
          case "admin":
            router.replace("/admin/dashboard")
            break
          case "validator":
            router.replace("/validator/dashboard")
            break
          default:
            router.replace("/login")
            break
        }
      }
    }
  }, [appUser, authLoading, router])

  if (authLoading || !appUser || appUser.role !== "user") {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Saya"
        actions={
          <Button asChild>
            <Link href="/user/reimbursements/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Reimbursement Baru
            </Link>
          </Button>
        }
      />

      {/* Key Metrics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reimbursements</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">Currently pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Reimbursements</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">Total approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount Reimbursed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" /> {/* Changed icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(22560000)}</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">Across all your reimbursements</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reimbursement Saya</CardTitle>
          <CardDescription>Lihat dan kelola permintaan reimbursement Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <UserReimbursementsTable />
        </CardContent>
      </Card>

      {/* Monthly Spending Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending (Last 3 Months)</CardTitle>
          <CardDescription>Your reimbursement spending trends.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] pr-4"> {/* Added pr-4 for Y-axis label visibility */}
          <ChartContainer config={userSpendingChartConfig} className="min-h-[200px] w-full">
            <BarChart data={userSpendingData} margin={{ top: 5, right: 0, left: 20, bottom: 5 }}> {/* Adjusted left margin */}
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => formatRupiah(value, 0).replace("Rp", "")} // Basic formatting
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={80} // Ensure enough space for labels
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={(value, name) => `${formatRupiah(value as number)}`} />}
              />
              <Bar dataKey="spending" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
