"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, Clock, CheckCircle, MessageSquare, AlertTriangle, Plus } from "lucide-react"
import { UserReimbursementsTable } from "@/components/user-reimbursements-table"
import { useFirestore } from "@/lib/firebase/firestore"
import { useFirebase } from "@/lib/firebase/hooks/use-firebase"

interface DashboardStats {
  total: number
  pending: number
  approved: number
  rejected: number
  needsClarification: number
  totalAmount: number
  approvedAmount: number
}

export default function UserDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    needsClarification: 0,
    totalAmount: 0,
    approvedAmount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const { getDocuments } = useFirestore("reimbursements")
  const { user } = useFirebase()

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const reimbursements = await getDocuments()

      // Calculate stats
      const newStats = reimbursements.reduce(
        (acc, reimbursement: any) => {
          acc.total += 1
          acc.totalAmount += reimbursement.amount || 0

          switch (reimbursement.status) {
            case "pending":
              acc.pending += 1
              break
            case "approved":
              acc.approved += 1
              acc.approvedAmount += reimbursement.amount || 0
              break
            case "rejected":
              acc.rejected += 1
              break
            case "needs_clarification":
              acc.needsClarification += 1
              break
          }

          return acc
        },
        {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          needsClarification: 0,
          totalAmount: 0,
          approvedAmount: 0,
        },
      )

      setStats(newStats)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Clarification Alert */}
      {stats.needsClarification > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Anda memiliki <strong>{stats.needsClarification}</strong> reimbursement yang memerlukan klarifikasi. Silakan
            berikan klarifikasi untuk mempercepat proses review.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reimbursement</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(stats.totalAmount)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Sedang direview validator</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(stats.approvedAmount)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Klarifikasi</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.needsClarification}</div>
            <p className="text-xs text-muted-foreground">Memerlukan tindakan Anda</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Tindakan Cepat</CardTitle>
          <CardDescription>Aksi yang dapat Anda lakukan</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajukan Reimbursement Baru
          </Button>
          {stats.needsClarification > 0 && (
            <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
              <MessageSquare className="mr-2 h-4 w-4" />
              Lihat Permintaan Klarifikasi ({stats.needsClarification})
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Reimbursements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reimbursement Saya</CardTitle>
          <CardDescription>Daftar semua reimbursement yang Anda ajukan</CardDescription>
        </CardHeader>
        <CardContent>
          <UserReimbursementsTable />
        </CardContent>
      </Card>
    </div>
  )
}
