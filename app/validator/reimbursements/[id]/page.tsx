"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, AlertCircle, Download, Eye, MessageSquare } from "lucide-react"
import DocumentViewer from "@/components/document-viewer"
import { ReceiptNoteDialog } from "@/components/validator/receipt-note-dialog"
import { ClarificationDialog } from "@/components/validator/clarification-dialog"
import { formatRupiah, translateStatus, translateExpenseType } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"
import { ExportReportDialog } from "@/components/export-report-dialog"

// Mock data for a reimbursement request
const mockReimbursement = {
  id: "RB-2025-1234",
  user: {
    name: "John Doe",
    email: "john@example.com",
    department: "Marketing",
  },
  event: {
    name: "Annual Conference 2025",
    date: "15-18 Juni 2025",
    location: "Jakarta",
  },
  expenses: [
    {
      id: 1,
      type: "accommodation",
      description: "Hotel - 3 malam",
      amount: 2750000,
      receipt: "/placeholder.svg?height=600&width=400",
      status: "pending",
      note: "",
    },
    {
      id: 2,
      type: "transportation",
      description: "Tiket Pesawat - Pulang Pergi",
      amount: 3450000,
      receipt: "/placeholder.svg?height=600&width=400",
      status: "pending",
      note: "",
    },
    {
      id: 3,
      type: "meals",
      description: "Makan malam dengan klien",
      amount: 1200000,
      receipt: "/placeholder.svg?height=600&width=400",
      status: "pending",
      note: "",
    },
  ],
  totalAmount: 7400000,
  submittedDate: "10 Mei 2025",
  status: "pending",
}

export default function ReimbursementDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedExpense, setSelectedExpense] = useState<number | null>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isClarificationDialogOpen, setIsClarificationDialogOpen] = useState(false)
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false)
  const [isReceiptNoteDialogOpen, setIsReceiptNoteDialogOpen] = useState(false)
  const [currentDocument, setCurrentDocument] = useState("")
  const [currentExpenseId, setCurrentExpenseId] = useState<number | null>(null)
  const [notes, setNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [reimbursementData, setReimbursementData] = useState(mockReimbursement)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)

  const handleApprove = () => {
    toast({
      title: "Reimbursement disetujui",
      description: `Reimbursement ${reimbursementData.id} telah disetujui.`,
    })
    setIsApproveDialogOpen(false)
    router.push("/validator/dashboard")
  }

  const handleReject = () => {
    toast({
      title: "Reimbursement ditolak",
      description: `Reimbursement ${reimbursementData.id} telah ditolak.`,
      variant: "destructive",
    })
    setIsRejectDialogOpen(false)
    router.push("/validator/dashboard")
  }

  const handleClarificationRequest = (items: any[], note: string) => {
    toast({
      title: "Permintaan klarifikasi dikirim",
      description: `Permintaan klarifikasi untuk reimbursement ${reimbursementData.id} telah dikirim.`,
    })
    setIsClarificationDialogOpen(false)
    router.push("/validator/dashboard")
  }

  const handleViewDocument = (documentUrl: string) => {
    setCurrentDocument(documentUrl)
    setIsDocumentViewerOpen(true)
  }

  const handleAddReceiptNote = (expenseId: number) => {
    setCurrentExpenseId(expenseId)
    const expense = reimbursementData.expenses.find((e) => e.id === expenseId)
    if (expense) {
      setIsReceiptNoteDialogOpen(true)
    }
  }

  const handleSaveReceiptNote = (note: string) => {
    if (currentExpenseId) {
      const updatedExpenses = reimbursementData.expenses.map((expense) =>
        expense.id === currentExpenseId ? { ...expense, note } : expense,
      )
      setReimbursementData({ ...reimbursementData, expenses: updatedExpenses })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Detail Reimbursement" description={`ID: ${reimbursementData.id}`} className="mb-6" />

      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
          <Download className="mr-2 h-4 w-4" />
          Ekspor Laporan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Diajukan Oleh</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{reimbursementData.user.name}</p>
            <p className="text-sm text-muted-foreground">{reimbursementData.user.email}</p>
            <p className="text-sm text-muted-foreground">{reimbursementData.user.department}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Detail Acara</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{reimbursementData.event.name}</p>
            <p className="text-sm text-muted-foreground">{reimbursementData.event.date}</p>
            <p className="text-sm text-muted-foreground">{reimbursementData.event.location}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Info Pengajuan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">Total: {formatRupiah(reimbursementData.totalAmount)}</p>
            <p className="text-sm text-muted-foreground">Diajukan: {reimbursementData.submittedDate}</p>
            <p className="text-sm text-muted-foreground">
              Status: <Badge variant="outline">{translateStatus(reimbursementData.status)}</Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detail Pengeluaran</CardTitle>
          <CardDescription>Tinjau setiap item pengeluaran dan dokumentasi terkait</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Semua Pengeluaran</TabsTrigger>
              <TabsTrigger value="accommodation">Akomodasi</TabsTrigger>
              <TabsTrigger value="transportation">Transportasi</TabsTrigger>
              <TabsTrigger value="meals">Konsumsi</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {reimbursementData.expenses.map((expense) => (
                <Card key={expense.id} className={selectedExpense === expense.id ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{translateExpenseType(expense.type)}</CardTitle>
                      <Badge
                        variant={
                          expense.status === "approved"
                            ? "success"
                            : expense.status === "rejected"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {translateStatus(expense.status)}
                      </Badge>
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
                        <Button variant="outline" size="sm" onClick={() => handleAddReceiptNote(expense.id)}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Catatan
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
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setSelectedExpense(expense.id === selectedExpense ? null : expense.id)}
                    >
                      {expense.id === selectedExpense ? "Sembunyikan Detail" : "Tampilkan Detail"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="accommodation">
              {reimbursementData.expenses
                .filter((expense) => expense.type === "accommodation")
                .map((expense) => (
                  /* Same card structure as above, filtered for accommodation */
                  <Card key={expense.id} className={selectedExpense === expense.id ? "border-primary" : ""}>
                    {/* Card content same as above */}
                  </Card>
                ))}
            </TabsContent>
            <TabsContent value="transportation">{/* Filter expenses by type */}</TabsContent>
            <TabsContent value="meals">{/* Filter expenses by type */}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Catatan Validator</CardTitle>
          <CardDescription>Tambahkan catatan atau komentar tentang permintaan reimbursement ini</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Masukkan catatan Anda di sini..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Kembali
        </Button>
        <div className="space-x-2">
          <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Tolak
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tolak Reimbursement</DialogTitle>
                <DialogDescription>Berikan alasan penolakan permintaan reimbursement ini.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="rejectionReason">Alasan Penolakan</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Masukkan alasan penolakan..."
                  className="mt-2"
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                  Batal
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Konfirmasi Penolakan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => setIsClarificationDialogOpen(true)}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Minta Klarifikasi
          </Button>

          <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <CheckCircle className="h-4 w-4 mr-2" />
                Setujui
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Setujui Reimbursement</DialogTitle>
                <DialogDescription>Apakah Anda yakin ingin menyetujui permintaan reimbursement ini?</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>
                  Anda akan menyetujui reimbursement <strong>{reimbursementData.id}</strong> sebesar{" "}
                  <strong>{formatRupiah(reimbursementData.totalAmount)}</strong>.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleApprove}>Konfirmasi Persetujuan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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

      <ReceiptNoteDialog
        isOpen={isReceiptNoteDialogOpen}
        onClose={() => setIsReceiptNoteDialogOpen(false)}
        onSave={handleSaveReceiptNote}
        initialNote={
          currentExpenseId ? reimbursementData.expenses.find((e) => e.id === currentExpenseId)?.note || "" : ""
        }
        receiptTitle={
          currentExpenseId ? reimbursementData.expenses.find((e) => e.id === currentExpenseId)?.description || "" : ""
        }
      />

      <ClarificationDialog
        isOpen={isClarificationDialogOpen}
        onClose={() => setIsClarificationDialogOpen(false)}
        onSubmit={handleClarificationRequest}
        reimbursementId={reimbursementData.id}
      />

      <ExportReportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        reportType="reimbursements"
      />
    </div>
  )
}
