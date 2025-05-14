import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileCheck, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import PendingReimbursementsTable from "@/components/pending-reimbursements-table"
import { PageHeader } from "@/components/shared/page-header"

export default function ValidatorDashboard() {
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">+8 sejak kemarin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Klarifikasi</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">-2 dari kemarin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui Hari Ini</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 dari kemarin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Divalidasi Bulan Ini</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+22% dari bulan lalu</p>
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
    </div>
  )
}
