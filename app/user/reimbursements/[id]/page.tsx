"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Eye, AlertTriangle, ArrowLeft } from "lucide-react" // Added AlertTriangle, ArrowLeft
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DocumentViewer from "@/components/document-viewer"
import { formatRupiah, translateStatus, translateExpenseType } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state" // Import EmptyState

// Mock data for a reimbursement request
const mockReimbursement = {
  id: "RB-2025-1010",
  event: {
    name: "Marketing Workshop",
    date: "10-12 Maret 2025",
    location: "Jakarta",
  },
  expenses: [
    {
      id: 1,
      type: "accommodation",
      description: "Hotel - 2 malam",
      amount: 1500000,
      receipt: "/placeholder.svg?height=600&width=400",
      status: "approved",
    },
    {
      id: 2,
      type: "transportation",
      description: "Tiket Kereta - Pulang Pergi",
      amount: 850000,
      receipt: "/placeholder.svg?height=600&width=400",
      status: "approved",
    },
    {
      id: 3,
      type: "meals",
      description: "Makan siang dengan tim",
      amount: 850000,
      receipt: "/placeholder.svg?height=600&width=400",
      status: "rejected",
      note: "Bukti pengeluaran tidak jelas. Mohon unggah kembali dengan kualitas yang lebih baik.",
    },
  ],
  totalAmount: 3200000,
  approvedAmount: 2350000,
  submittedDate: "15 Januari 2025",
  status: "rejected",
  clarificationRequests: [
    {
      id: 1,
      date: "18 Januari 2025",
      items: ["Bukti pengeluaran tidak jelas", "Jumlah tidak sesuai dengan bukti"],
      note: "Mohon unggah kembali bukti pengeluaran untuk makan siang dengan kualitas yang lebih baik dan pastikan jumlah sesuai dengan yang tertera pada bukti.",
    },
  ],
}

export default function UserReimbursementDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false)
  const [currentDocument, setCurrentDocument] = useState("")
  // For demonstration, let's assume reimbursementData could be null if not found
  const [reimbursementData, setReimbursementData] = useState(mockReimbursement) // In a real app, this would be fetched

  const handleViewDocument = (documentUrl: string) => {
    setCurrentDocument(documentUrl)
    setIsDocumentViewerOpen(true)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success"
      case "rejected":
        return "destructive"
      case "clarification":
        return "warning"
      default:
        return "outline"
    }
  }

  // Simulate not found state
  // In a real app, you would fetch data in useEffect and setReimbursementData
  // If fetch fails or returns no data for params.id, setReimbursementData(null)
  // For this example, we'll just check if initial mock data exists (it always will here)
  // To test, you could temporarily set mockReimbursement to null
  // const reimbursementData = null; // Uncomment to test "Not Found"

  if (!reimbursementData) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <EmptyState
          variant="error" // Or default, if "not found" isn't strictly an error in your flow
          title="Reimbursement Tidak Ditemukan"
          description={`Reimbursement dengan ID "${params.id}" tidak dapat ditemukan.`}
          icon={<AlertTriangle className="h-12 w-12" />}
          action={
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Detail Reimbursement" description={`ID: ${reimbursementData.id}`} className="mb-6" />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">{reimbursementData.event.name}</h2>
          <p className="text-muted-foreground">
            {reimbursementData.event.date} • {reimbursementData.event.location}
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(reimbursementData.status)} className="text-sm py-1 px-3">
          {translateStatus(reimbursementData.status).toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatRupiah(reimbursementData.totalAmount)}</p>
            <p className="text-sm text-muted-foreground">Diajukan: {reimbursementData.submittedDate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Disetujui</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatRupiah(reimbursementData.approvedAmount)}</p>
            <p className="text-sm text-muted-foreground">
              {Math.round((reimbursementData.approvedAmount / reimbursementData.totalAmount) * 100)}% dari total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status Penggantian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant={getStatusBadgeVariant(reimbursementData.status)}>
                {translateStatus(reimbursementData.status)}
              </Badge>
              {reimbursementData.status === "rejected" && (
                <p className="text-sm text-destructive">Beberapa item ditolak. Lihat detail di bawah.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {reimbursementData.clarificationRequests && reimbursementData.clarificationRequests.length > 0 && (
        <Card className="mb-6 border-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-warning">Permintaan Klarifikasi</CardTitle>
            <CardDescription>
              Validator meminta klarifikasi untuk beberapa item. Mohon tinjau dan berikan tanggapan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reimbursementData.clarificationRequests.map((request) => (
              <div key={request.id} className="space-y-2">
                <p className="text-sm text-muted-foreground">Tanggal: {request.date}</p>
                <div className="space-y-1">
                  <p className="font-medium">Item yang perlu diklarifikasi:</p>
                  <ul className="list-disc list-inside text-sm">
                    {request.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                {request.note && (
                  <div className="mt-2">
                    <p className="font-medium">Catatan:</p>
                    <p className="text-sm">{request.note}</p>
                  </div>
                )}
                <div className="mt-4">
                  <Button>Berikan Klarifikasi</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detail Pengeluaran</CardTitle>
          <CardDescription>Rincian item pengeluaran dan statusnya</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="approved">Disetujui</TabsTrigger>
              <TabsTrigger value="rejected">Ditolak</TabsTrigger>
            </TabsList>
            {(() => {
              const renderExpenseList = (expenses: typeof reimbursementData.expenses, type: string) => {
                if (expenses.length === 0) {
                  let title = "Tidak Ada Pengeluaran"
                  if (type === "approved") title = "Tidak Ada Pengeluaran Disetujui"
                  if (type === "rejected") title = "Tidak Ada Pengeluaran Ditolak"
                  return <EmptyState title={title} description={`Tidak ada item pengeluaran dengan status "${type}" untuk ditampilkan.`} className="py-8" />
                }
                return expenses.map((expense) => (
                  <Card key={expense.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{translateExpenseType(expense.type)}</CardTitle>
                        <Badge variant={getStatusBadgeVariant(expense.status)}>{translateStatus(expense.status)}</Badge>
                      </div>
                      <CardDescription>{expense.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{formatRupiah(expense.amount)}</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDocument(expense.receipt)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Lihat Bukti
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Unduh
                          </Button>
                        </div>
                      </div>
                      {expense.note && (
                        <div className="mt-3 p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium">Catatan Validator:</p>
                          <p className="text-sm">{expense.note}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              }

              return (
                <>
                  <TabsContent value="all" className="space-y-4">
                    {renderExpenseList(reimbursementData.expenses, "semua")}
                  </TabsContent>
                  <TabsContent value="approved" className="space-y-4">
                    {renderExpenseList(reimbursementData.expenses.filter(exp => exp.status === "approved"), "disetujui")}
                  </TabsContent>
                  <TabsContent value="rejected" className="space-y-4">
                    {renderExpenseList(reimbursementData.expenses.filter(exp => exp.status === "rejected"), "ditolak")}
                  </TabsContent>
                </>
              )
            })()}
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Kembali
        </Button>
        <Button>Ajukan Ulang</Button>
      </div>

      <Dialog open={isDocumentViewerOpen} onOpenChange={setIsDocumentViewerOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Penampil Dokumen</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <DocumentViewer documentUrl={currentDocument} />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDocumentViewerOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
