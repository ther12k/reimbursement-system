import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileCheck, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import PendingReimbursementsTable from "@/components/pending-reimbursements-table"
import { PageHeader } from "@/components/shared/page-header"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFirebase } from "@/lib/firebase/hooks/use-firebase"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart" // Import Chart components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts" // Import Recharts components

const dailyProcessingData = [
  { day: "Mon", count: 10, fill: "var(--color-count)" }, // fill key for ChartStyle
  { day: "Tue", count: 15, fill: "var(--color-count)" },
  { day: "Wed", count: 8, fill: "var(--color-count)" },
  { day: "Thu", count: 12, fill: "var(--color-count)" },
  { day: "Fri", count: 18, fill: "var(--color-count)" },
  { day: "Sat", count: 5, fill: "var(--color-count)" },
  { day: "Sun", count: 2, fill: "var(--color-count)" },
];

const dailyProcessingChartConfig = {
  count: { // Key in data objects for the bar's value
    label: "Processed",
    color: "hsl(var(--primary))", // Color for legend and ChartStyle variable
  },
} satisfies ChartConfig;


export default function ValidatorDashboard() {
  const { user: appUser, loading: authLoading } = useFirebase()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (!appUser) {
        router.replace("/login")
      } else if (appUser.role !== "validator") {
        switch (appUser.role) {
          case "admin":
            router.replace("/admin/dashboard")
            break
          case "user":
            router.replace("/user/dashboard")
            break
          default:
            router.replace("/login")
            break
        }
      }
    }
  }, [appUser, authLoading, router])

  if (authLoading || !appUser || appUser.role !== "validator") {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Validator"
        actions={
          <Button asChild>
            <Link href="/validator/reimbursements/pending">Lihat Semua Tertunda</Link>
          </Button>
        }
      />

      {/* Key Metrics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending For Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">Reimbursements awaiting your review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved by You</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">Total reimbursements you've approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected by You</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" /> {/* Added XCircle icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">Total reimbursements you've rejected</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Menunggu Review</TabsTrigger>
          <TabsTrigger value="clarification">Perlu Klarifikasi</TabsTrigger>
          <TabsTrigger value="recent">Baru Disetujui</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reimbursement Tertunda</CardTitle>
              <CardDescription>Tinjau dan validasi permintaan reimbursement ini</CardDescription>
            </CardHeader>
            <CardContent>
              <PendingReimbursementsTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clarification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perlu Klarifikasi</CardTitle>
              <CardDescription>Permintaan reimbursement ini memerlukan informasi tambahan</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure for clarification requests */}
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p>Reimbursement yang memerlukan klarifikasi akan muncul di sini</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Baru Disetujui</CardTitle>
              <CardDescription>Reimbursement yang Anda setujui dalam 7 hari terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure for recently approved */}
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p>Reimbursement yang baru disetujui akan muncul di sini</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Daily Processing Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Reimbursements Processed (Last 7 Days)</CardTitle>
          <CardDescription>Your daily processing activity.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] pr-4">
          <ChartContainer config={dailyProcessingChartConfig} className="min-h-[200px] w-full">
            <BarChart data={dailyProcessingData} margin={{ top: 5, right: 0, left: -10, bottom: 5 }}> {/* Adjusted left margin for YAxis */}
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => value.toLocaleString()}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={30} 
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={(value) => `${value} processed`} />}
              />
              <Bar dataKey="count" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
