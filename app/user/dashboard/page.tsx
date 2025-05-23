"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import UserReimbursementsTable from "@/components/user-reimbursements-table"
import { formatRupiah } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"

export default function UserDashboard() {
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tertunda</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Menunggu persetujuan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Total disetujui</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Total ditolak</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Diganti</CardTitle>
            <div className="text-muted-foreground">Rp</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(22560000)}</div>
            <p className="text-xs text-muted-foreground">Tahun berjalan</p>
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
    </div>
  )
}
