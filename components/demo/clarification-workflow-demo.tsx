"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, UserCheck, MessageSquare, Clock, CheckCircle, AlertTriangle, ArrowRight, Eye } from "lucide-react"
import { ClarificationDialog } from "@/components/validator/clarification-dialog"
import { ClarificationResponseDialog } from "@/components/user/clarification-response-dialog"
import { testReimbursements, type TestReimbursement } from "@/lib/mock-data/test-reimbursements"
import { useToast } from "@/hooks/use-toast"

export function ClarificationWorkflowDemo() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedReimbursement, setSelectedReimbursement] = useState<TestReimbursement | null>(null)
  const [isClarificationDialogOpen, setIsClarificationDialogOpen] = useState(false)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [reimbursements, setReimbursements] = useState(testReimbursements)
  const { toast } = useToast()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Menunggu Review", icon: Clock },
      approved: { variant: "success" as const, label: "Disetujui", icon: CheckCircle },
      rejected: { variant: "destructive" as const, label: "Ditolak", icon: AlertTriangle },
      needs_clarification: { variant: "warning" as const, label: "Perlu Klarifikasi", icon: MessageSquare },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "outline" as const,
      label: status,
      icon: Clock,
    }

    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const handleRequestClarification = (reimbursement: TestReimbursement) => {
    setSelectedReimbursement(reimbursement)
    setIsClarificationDialogOpen(true)
  }

  const handleClarificationSubmit = (items: any[], note: string) => {
    if (selectedReimbursement) {
      const updatedReimbursement = {
        ...selectedReimbursement,
        status: "needs_clarification" as const,
        clarificationRequest: {
          message: note,
          requestedAt: new Date().toISOString(),
          requestedBy: "validator-001",
          requestedByName: "Jane Smith (Validator)",
          items: items.map((item) => item.label),
        },
      }

      setReimbursements((prev) => prev.map((r) => (r.id === selectedReimbursement.id ? updatedReimbursement : r)))

      setCurrentStep(2)
      toast({
        title: "Permintaan klarifikasi dikirim",
        description: "User akan menerima notifikasi untuk memberikan klarifikasi",
      })
    }
  }

  const handleProvideResponse = (reimbursement: TestReimbursement) => {
    setSelectedReimbursement(reimbursement)
    setIsResponseDialogOpen(true)
  }

  const handleResponseSubmit = () => {
    if (selectedReimbursement) {
      const updatedReimbursement = {
        ...selectedReimbursement,
        status: "pending" as const,
        clarificationResponse: {
          message:
            "Terima kasih atas permintaan klarifikasinya. Berikut penjelasan saya: 1) Bukti pembayaran hotel sudah saya scan ulang dengan kualitas yang lebih baik, 2) Tanggal check-in disesuaikan karena ada perubahan jadwal meeting, 3) Tarif hotel memang sedikit lebih tinggi karena peak season dan lokasi strategis dekat venue meeting.",
          respondedAt: new Date().toISOString(),
          respondedBy: "user-001",
        },
      }

      setReimbursements((prev) => prev.map((r) => (r.id === selectedReimbursement.id ? updatedReimbursement : r)))

      setCurrentStep(3)
      toast({
        title: "Klarifikasi berhasil dikirim",
        description: "Validator akan mereview klarifikasi Anda",
      })
    }
  }

  const resetDemo = () => {
    setCurrentStep(1)
    setReimbursements(testReimbursements)
    setSelectedReimbursement(null)
  }

  const pendingReimbursement = reimbursements.find((r) => r.status === "pending")
  const clarificationReimbursement = reimbursements.find((r) => r.status === "needs_clarification")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Demo: Workflow Klarifikasi Reimbursement
          </CardTitle>
          <CardDescription>Demonstrasi lengkap alur klarifikasi dari validator ke user dan sebaliknya</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${currentStep >= 1 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"}`}
              >
                <UserCheck className="h-4 w-4" />
                <span className="text-sm font-medium">1. Validator Review</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${currentStep >= 2 ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-500"}`}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">2. Request Klarifikasi</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${currentStep >= 3 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">3. User Response</span>
              </div>
            </div>
            <Button variant="outline" onClick={resetDemo}>
              Reset Demo
            </Button>
          </div>

          <Tabs defaultValue="validator" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="validator">Validator View</TabsTrigger>
              <TabsTrigger value="user">User View</TabsTrigger>
            </TabsList>

            <TabsContent value="validator" className="space-y-4">
              <Alert>
                <UserCheck className="h-4 w-4" />
                <AlertDescription>
                  <strong>Validator View:</strong> Sebagai validator, Anda dapat mereview reimbursement dan meminta
                  klarifikasi jika diperlukan.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Reimbursement untuk Review</h3>
                {reimbursements.map((reimbursement) => (
                  <Card key={reimbursement.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{reimbursement.title}</CardTitle>
                          <CardDescription>
                            {reimbursement.userName} • {formatDate(reimbursement.submittedAt)}
                          </CardDescription>
                        </div>
                        {getStatusBadge(reimbursement.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Jumlah:</span>
                          <div className="font-medium">{formatCurrency(reimbursement.amount)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Kategori:</span>
                          <div className="font-medium capitalize">{reimbursement.category}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{reimbursement.description}</p>

                      {reimbursement.clarificationRequest && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                          <h4 className="font-medium text-orange-900 mb-2">Klarifikasi yang Diminta:</h4>
                          <p className="text-sm text-orange-800">{reimbursement.clarificationRequest.message}</p>
                        </div>
                      )}

                      {reimbursement.clarificationResponse && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <h4 className="font-medium text-green-900 mb-2">Response dari User:</h4>
                          <p className="text-sm text-green-800">{reimbursement.clarificationResponse.message}</p>
                          <p className="text-xs text-green-600 mt-2">
                            Dikirim: {formatDate(reimbursement.clarificationResponse.respondedAt)}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </Button>
                        {reimbursement.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRequestClarification(reimbursement)}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Minta Klarifikasi
                          </Button>
                        )}
                        {reimbursement.status === "needs_clarification" && (
                          <Badge variant="warning">Menunggu Klarifikasi User</Badge>
                        )}
                        {reimbursement.clarificationResponse && (
                          <Button variant="default" size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Review Klarifikasi
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="user" className="space-y-4">
              <Alert>
                <User className="h-4 w-4" />
                <AlertDescription>
                  <strong>User View:</strong> Sebagai user, Anda dapat melihat permintaan klarifikasi dan memberikan
                  response.
                </AlertDescription>
              </Alert>

              {clarificationReimbursement && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Anda memiliki <strong>1</strong> reimbursement yang memerlukan klarifikasi. Silakan berikan
                    klarifikasi untuk mempercepat proses review.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Reimbursement Saya</h3>
                {reimbursements
                  .filter((r) => r.userEmail === "user@example.com")
                  .map((reimbursement) => (
                    <Card
                      key={reimbursement.id}
                      className={`${reimbursement.status === "needs_clarification" ? "border-l-4 border-l-orange-500" : ""}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{reimbursement.title}</CardTitle>
                            <CardDescription>Diajukan: {formatDate(reimbursement.submittedAt)}</CardDescription>
                          </div>
                          {getStatusBadge(reimbursement.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground">Jumlah:</span>
                            <div className="font-medium">{formatCurrency(reimbursement.amount)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Kategori:</span>
                            <div className="font-medium capitalize">{reimbursement.category}</div>
                          </div>
                        </div>

                        {reimbursement.clarificationRequest && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                            <h4 className="font-medium text-orange-900 mb-2">Permintaan Klarifikasi dari Validator:</h4>
                            <p className="text-sm text-orange-800">{reimbursement.clarificationRequest.message}</p>
                            <p className="text-xs text-orange-600 mt-2">
                              Diminta oleh: {reimbursement.clarificationRequest.requestedByName} •{" "}
                              {formatDate(reimbursement.clarificationRequest.requestedAt)}
                            </p>
                          </div>
                        )}

                        {reimbursement.clarificationResponse && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <h4 className="font-medium text-blue-900 mb-2">Klarifikasi Anda:</h4>
                            <p className="text-sm text-blue-800">{reimbursement.clarificationResponse.message}</p>
                            <p className="text-xs text-blue-600 mt-2">
                              Dikirim: {formatDate(reimbursement.clarificationResponse.respondedAt)}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </Button>
                          {reimbursement.status === "needs_clarification" && !reimbursement.clarificationResponse && (
                            <Button
                              onClick={() => handleProvideResponse(reimbursement)}
                              className="text-orange-600 border-orange-200 hover:bg-orange-50"
                              variant="outline"
                              size="sm"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Berikan Klarifikasi
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Clarification Request Dialog */}
      {selectedReimbursement && (
        <ClarificationDialog
          isOpen={isClarificationDialogOpen}
          onClose={() => {
            setIsClarificationDialogOpen(false)
            setSelectedReimbursement(null)
          }}
          onSubmit={handleClarificationSubmit}
          reimbursementId={selectedReimbursement.id}
        />
      )}

      {/* Clarification Response Dialog */}
      {selectedReimbursement && (
        <ClarificationResponseDialog
          isOpen={isResponseDialogOpen}
          onClose={() => {
            setIsResponseDialogOpen(false)
            setSelectedReimbursement(null)
          }}
          reimbursement={selectedReimbursement}
          onSuccess={handleResponseSubmit}
        />
      )}
    </div>
  )
}
