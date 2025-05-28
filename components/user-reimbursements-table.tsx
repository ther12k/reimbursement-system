"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, MessageSquare, Loader2 } from "lucide-react"
import { useFirestore } from "@/lib/firebase/firestore"
import { useFirebase } from "@/lib/firebase/hooks/use-firebase"
import { ClarificationResponseDialog } from "@/components/user/clarification-response-dialog"
import { EmptyState } from "@/components/shared/empty-state"

interface Reimbursement {
  id: string
  title: string
  amount: number
  date: string
  status: string
  category: string
  clarificationRequest?: {
    message: string
    requestedAt: string
    requestedBy: string
  }
  clarificationResponse?: {
    message: string
    respondedAt: string
    respondedBy: string
  }
}

export function UserReimbursementsTable() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReimbursement, setSelectedReimbursement] = useState<Reimbursement | null>(null)
  const [isClarificationDialogOpen, setIsClarificationDialogOpen] = useState(false)

  const { getDocuments } = useFirestore("reimbursements")
  const { user } = useFirebase()

  useEffect(() => {
    fetchReimbursements()
  }, [user])

  const fetchReimbursements = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // In a real app, you would filter by user ID
      const data = await getDocuments()
      // For demo, we'll show all reimbursements but in real app filter by user.uid
      setReimbursements(data as Reimbursement[])
    } catch (error) {
      console.error("Error fetching reimbursements:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClarificationClick = (reimbursement: Reimbursement) => {
    setSelectedReimbursement(reimbursement)
    setIsClarificationDialogOpen(true)
  }

  const handleClarificationSuccess = () => {
    fetchReimbursements() // Refresh the list
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Menunggu Review" },
      approved: { variant: "success" as const, label: "Disetujui" },
      rejected: { variant: "destructive" as const, label: "Ditolak" },
      needs_clarification: { variant: "warning" as const, label: "Perlu Klarifikasi" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "outline" as const,
      label: status,
    }

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (reimbursements.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-12 w-12" />}
        title="Belum ada reimbursement"
        description="Anda belum memiliki reimbursement yang diajukan"
        action={<Button>Ajukan Reimbursement</Button>}
      />
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reimbursements.map((reimbursement) => (
              <TableRow key={reimbursement.id}>
                <TableCell className="font-medium">{reimbursement.title}</TableCell>
                <TableCell>{reimbursement.category}</TableCell>
                <TableCell>{formatDate(reimbursement.date)}</TableCell>
                <TableCell>{formatCurrency(reimbursement.amount)}</TableCell>
                <TableCell>{getStatusBadge(reimbursement.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Lihat Detail</span>
                    </Button>
                    {reimbursement.status === "needs_clarification" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClarificationClick(reimbursement)}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Berikan Klarifikasi
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Clarification Response Dialog */}
      {selectedReimbursement && (
        <ClarificationResponseDialog
          isOpen={isClarificationDialogOpen}
          onClose={() => {
            setIsClarificationDialogOpen(false)
            setSelectedReimbursement(null)
          }}
          reimbursement={selectedReimbursement}
          onSuccess={handleClarificationSuccess}
        />
      )}
    </>
  )
}
