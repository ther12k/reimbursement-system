"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, Users, FileText, DollarSign, TrendingUp, Download, PieChart as PieChartIcon } from "lucide-react" // Added PieChartIcon for consistency if needed elsewhere
import Link from "next/link"
import RecentEventsTable from "@/components/recent-events-table"
import ReimbursementStats from "@/components/reimbursement-stats"
import { formatRupiah } from "@/lib/utils"
import { ExportReportDialog } from "@/components/export-report-dialog"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFirebase } from "@/lib/firebase/hooks/use-firebase"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { PageHeader } from "@/components/shared/page-header"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart" // Import Chart components
import { PieChart, Pie, Cell, Tooltip } from "recharts" // Import Recharts components

const reimbursementStatusData = [
  { status: "Approved", count: 70, fill: "var(--color-Approved)" },
  { status: "Pending", count: 20, fill: "var(--color-Pending)" },
  { status: "Rejected", count: 10, fill: "var(--color-Rejected)" },
];

const reimbursementStatusChartConfig = {
  count: {
    label: "Count",
  },
  Approved: {
    label: "Approved",
    color: "hsl(var(--success))",
  },
  Pending: {
    label: "Pending",
    color: "hsl(var(--warning))",
  },
  Rejected: {
    label: "Rejected",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;


export default function AdminDashboard() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const { user: appUser, loading: authLoading } = useFirebase()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (!appUser) {
        // Not authenticated, redirect to login
        router.replace("/login")
      } else if (appUser.role !== "admin") {
        // Incorrect role, redirect to their appropriate dashboard or a default page
        switch (appUser.role) {
          case "user":
            router.replace("/user/dashboard")
            break
          case "validator":
            router.replace("/validator/dashboard")
            break
          default:
            // If role is null or any other unexpected value
            router.replace("/login") // Or a generic "unauthorized" page
            break
        }
      }
      // If role is 'admin', they can stay.
    }
  }, [appUser, authLoading, router])

  if (authLoading || !appUser || appUser.role !== "admin") {
    // Show loading spinner while auth state is loading or if redirection is pending
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        actions={
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/events/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Ekspor Laporan
            </Button>
          </div>
        }
      />

      {/* Key Metrics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">Currently registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            {/* Assuming FileText was for generic items, CalendarDays might be better for events */}
            <FileText className="h-4 w-4 text-muted-foreground" /> 
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">Managed events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reimbursements</CardTitle>
            {/* DollarSign or a list icon could work here */}
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">157</div> {/* Placeholder value for total count */}
            <p className="text-xs text-muted-foreground">Across all users and events</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>You have created 18 events this month</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentEventsTable />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Reimbursement Stats</CardTitle>
                <CardDescription>Breakdown of reimbursement status</CardDescription>
              </CardHeader>
              <CardContent>
                <ReimbursementStats />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reimbursement Status Overview</CardTitle>
              <CardDescription>A pie chart showing the distribution of reimbursement statuses.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center"> {/* Adjusted height */}
              <ChartContainer config={reimbursementStatusChartConfig} className="min-h-[300px] w-full max-w-md">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel nameKey="status" />}
                  />
                  <Pie
                    data={reimbursementStatusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    labelLine={false}
                    label={({ cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cy + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor={x > cy ? 'start' : 'end'}
                          dominantBaseline="central"
                          className="text-xs font-medium"
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {reimbursementStatusData.map((entry) => (
                      <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="status" />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view reports for your organization</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto text-gray-400" />
                <p className="mt-4 text-lg font-medium">Report Generation</p>
                <p className="text-sm text-gray-500">Generate custom reports based on various parameters</p>
                <Button className="mt-4">Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ExportReportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        reportType="reimbursements"
      />
    </div>
  )
}
