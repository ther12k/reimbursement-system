"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, MessageSquare, Clock, CheckCircle, AlertTriangle, Eye, Loader2, RefreshCw, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ClarificationDialog } from "@/components/validator/clarification-dialog"
import { ClarificationResponseDialog } from "@/components/user/clarification-response-dialog"

interface MockReimbursement {
  id: string
  title: string
  amount: number
  date: string
  status: "pending" | "needs_clarification" | "approved" | "rejected"
  category: string
  submittedBy: string
  clarificationRequest?: {
    message: string
    requestedAt: string
    requestedBy: string
    items: string[]
  }
  clarificationResponse?: {
    message: string
    respondedAt: string
    respondedBy: string
  }
  lastUpdated: string
}

export function MultiUserRealtimeTest() {
  const [reimbursements, setReimbursements] = useState<MockReimbursement[]>([
    {
      id: "RB-001",
      title: "Perjalanan Dinas Jakarta",
      amount: 2500000,
      date: "2025-01-15",
      status: "pending",
      category: "Transport",
      submittedBy: "John Doe",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "RB-002",
      title: "Training Workshop",
      amount: 1800000,
      date: "2025-01-14",
      status: "pending",
      category: "Training",
      submittedBy: "Jane Smith",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "RB-003",
      title: "Client Meeting Lunch",
      amount: 750000,
      date: "2025-01-13",
      status: "needs_clarification",
      category: "Meals",
      submittedBy: "Bob Wilson",
      clarificationRequest: {
        message: "Mohon lampirkan bukti pembayaran yang lebih jelas dan detail peserta meeting",
        requestedAt: new Date(Date.now() - 3600000).toISOString(),
        requestedBy: "Validator A",
        items: ["missing-receipt", "missing-details"],
      },
      lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    },
  ])

  const [selectedReimbursement, setSelectedReimbursement] = useState<MockReimbursement | null>(null)
  const [isClarificationDialogOpen, setIsClarificationDialogOpen] = useState(false)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("validator")
  const [notifications, setNotifications] = useState<string[]>([])
  const [isSimulating, setIsSimulating] = useState(false)

  const { toast } = useToast()

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setReimbursements((prev) =>
        prev.map((r) => ({
          ...r,
          lastUpdated: new Date().toISOString(),
        })),
      )
    }, 30000) // Update timestamps every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleValidatorRequestClarification = (reimbursement: MockReimbursement, items: any[], note: string) => {
    const updatedReimbursement = {
      ...reimbursement,
      status: "needs_clarification" as const,
      clarificationRequest: {
        message: note || "Mohon berikan klarifikasi untuk item yang dipilih",
        requestedAt: new Date().toISOString(),
        requestedBy: "Validator A",
        items: items.map((item) => item.id),
      },
      lastUpdated: new Date().toISOString(),
    }

    setReimbursements((prev) => prev.map((r) => (r.id === reimbursement.id ? updatedReimbursement : r)))

    // Simulate real-time notification
    const notification = `🔔 Klarifikasi diminta untuk "${reimbursement.title}"`
    setNotifications((prev) => [notification, ...prev.slice(0, 4)])

    toast({
      title: "Permintaan klarifikasi dikirim",
      description: `Klarifikasi telah diminta untuk "${reimbursement.title}"`,
    })

    // Auto-switch to user tab to show real-time effect
    setTimeout(() => {
      setActiveTab("user")
      toast({
        title: "🔔 Notifikasi Real-time",
        description: "User menerima permintaan klarifikasi secara real-time",
        variant: "default",
      })
    }, 2000)
  }

  const handleUserProvideClarification = (reimbursement: MockReimbursement, response: string) => {
    const updatedReimbursement = {
      ...reimbursement,
      status: "pending" as const,
      clarificationResponse: {
        message: response,
        respondedAt: new Date().toISOString(),
        respondedBy: "User",
      },
      lastUpdated: new Date().toISOString(),
    }

    setReimbursements((prev) => prev.map((r) => (r.id === reimbursement.id ? updatedReimbursement : r)))

    // Simulate real-time notification
    const notification = `✅ Klarifikasi diberikan untuk "${reimbursement.title}"`
    setNotifications((prev) => [notification, ...prev.slice(0, 4)])

    toast({
      title: "Klarifikasi berhasil dikirim",
      description: `Klarifikasi untuk "${reimbursement.title}" telah dikirim ke validator`,
    })

    // Auto-switch to validator tab to show real-time effect
    setTimeout(() => {
      setActiveTab("validator")
      toast({
        title: "🔔 Notifikasi Real-time",
        description: "Validator menerima response klarifikasi secara real-time",
        variant: "default",
      })
    }, 2000)
  }

  const simulateMultiUserActivity = () => {
    setIsSimulating(true)

    // Simulate validator requesting clarification
    setTimeout(() => {
      const pendingReimbursement = reimbursements.find((r) => r.status === "pending")
      if (pendingReimbursement) {
        handleValidatorRequestClarification(
          pendingReimbursement,
          [{ id: "missing-receipt", label: "Bukti pengeluaran tidak lengkap" }],
          "Mohon lampirkan bukti pembayaran yang lebih jelas",
        )
      }
    }, 1000)

    // Simulate user providing clarification
    setTimeout(() => {
      const clarificationReimbursement = reimbursements.find((r) => r.status === "needs_clarification")
      if (clarificationReimbursement) {
        handleUserProvideClarification(
          clarificationReimbursement,
          "Saya telah melampirkan bukti pembayaran yang lebih jelas. Mohon review kembali.",
        )
      }
    }, 5000)

    setTimeout(() => {
      setIsSimulating(false)
    }, 6000)
  }

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: "secondary" as const, label: "Menunggu Review", icon: Clock },
      needs_clarification: { variant: "warning" as const, label: "Perlu Klarifikasi", icon: MessageSquare },
      approved: { variant: "success" as const, label: "Disetujui", icon: CheckCircle },
      rejected: { variant: "destructive" as const, label: "Ditolak", icon: AlertTriangle },
    }

    const { variant, label, icon: Icon } = config[status as keyof typeof config]
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const pendingCount = reimbursements.filter((r) => r.status === "pending").length
  const clarificationCount = reimbursements.filter((r) => r.status === "needs_clarification").length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Multi-User Real-time Test
          </CardTitle>
          <CardDescription>
            Test workflow klarifikasi dengan simulasi multiple users. Lihat bagaimana perubahan status dan notifikasi
            muncul secara real-time di berbagai role.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={simulateMultiUserActivity} disabled={isSimulating} className="flex items-center gap-2">
              {isSimulating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {isSimulating ? "Simulating..." : "Simulate Multi-User Activity"}
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last updated: {formatTime(new Date().toISOString())}
            </div>
          </div>

          {/* Real-time Notifications */}
          {notifications.length > 0 && (
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <strong>Real-time Notifications:</strong>
                  {notifications.slice(0, 3).map((notification, index) => (
                    <div key={index} className="text-sm">
                      {notification}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="validator" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Validator View
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            User View
            {clarificationCount > 0 && (
              <Badge variant="warning" className="ml-1">
                {clarificationCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="validator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validator Dashboard - Real-time</CardTitle>
              <CardDescription>
                Lihat reimbursements yang perlu direview. Status akan update secara real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reimbursements.map((reimbursement) => (
                    <TableRow key={reimbursement.id}>
                      <TableCell className="font-medium">{reimbursement.id}</TableCell>
                      <TableCell>{reimbursement.title}</TableCell>
                      <TableCell>{formatCurrency(reimbursement.amount)}</TableCell>
                      <TableCell>{getStatusBadge(reimbursement.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTime(reimbursement.lastUpdated)}
                      </TableCell>
                      <TableCell className="text-right">
                        {reimbursement.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReimbursement(reimbursement)
                              setIsClarificationDialogOpen(true)
                            }}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Minta Klarifikasi
                          </Button>
                        )}
                        {reimbursement.clarificationResponse && (
                          <Badge variant="outline" className="text-green-600">
                            Response Received
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-4">
          {clarificationCount > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Anda memiliki <strong>{clarificationCount}</strong> reimbursement yang memerlukan klarifikasi. Silakan
                berikan klarifikasi untuk mempercepat proses review.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>User Dashboard - Real-time</CardTitle>
              <CardDescription>
                Lihat reimbursements Anda. Notifikasi klarifikasi akan muncul secara real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reimbursements.map((reimbursement) => (
                    <TableRow
                      key={reimbursement.id}
                      className={
                        reimbursement.status === "needs_clarification"
                          ? "border-l-4 border-l-orange-400 bg-orange-50/50"
                          : ""
                      }
                    >
                      <TableCell className="font-medium">{reimbursement.id}</TableCell>
                      <TableCell>{reimbursement.title}</TableCell>
                      <TableCell>{formatCurrency(reimbursement.amount)}</TableCell>
                      <TableCell>{getStatusBadge(reimbursement.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTime(reimbursement.lastUpdated)}
                      </TableCell>
                      <TableCell className="text-right">
                        {reimbursement.status === "needs_clarification" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReimbursement(reimbursement)
                              setIsResponseDialogOpen(true)
                            }}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Berikan Klarifikasi
                          </Button>
                        )}
                        {reimbursement.clarificationResponse && (
                          <Badge variant="outline" className="text-blue-600">
                            Clarification Sent
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Clarification Dialog for Validator */}
      {selectedReimbursement && (
        <ClarificationDialog
          isOpen={isClarificationDialogOpen}
          onClose={() => {
            setIsClarificationDialogOpen(false)
            setSelectedReimbursement(null)
          }}
          onSubmit={(items, note) => {
            handleValidatorRequestClarification(selectedReimbursement, items, note)
            setIsClarificationDialogOpen(false)
            setSelectedReimbursement(null)
          }}
          reimbursementId={selectedReimbursement.id}
        />
      )}

      {/* Clarification Response Dialog for User */}
      {selectedReimbursement && (
        <ClarificationResponseDialog
          isOpen={isResponseDialogOpen}
          onClose={() => {
            setIsResponseDialogOpen(false)
            setSelectedReimbursement(null)
          }}
          reimbursement={selectedReimbursement}
          onSuccess={() => {
            setIsResponseDialogOpen(false)
            setSelectedReimbursement(null)
          }}
        />
      )}
    </div>
  )
}
