"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useFirestore } from "@/lib/firebase/firestore"
import { Loader2, MessageSquare, Calendar, DollarSign } from "lucide-react"

interface ClarificationResponseDialogProps {
  isOpen: boolean
  onClose: () => void
  reimbursement: {
    id: string
    title: string
    amount: number
    date: string
    status: string
    clarificationRequest?: {
      message: string
      requestedAt: string
      requestedBy: string
    }
  }
  onSuccess: () => void
}

export function ClarificationResponseDialog({
  isOpen,
  onClose,
  reimbursement,
  onSuccess,
}: ClarificationResponseDialogProps) {
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { updateDocument } = useFirestore("reimbursements")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!response.trim()) {
      toast({
        title: "Klarifikasi diperlukan",
        description: "Silakan berikan klarifikasi sebelum mengirim",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await updateDocument(reimbursement.id, {
        status: "pending",
        clarificationResponse: {
          message: response.trim(),
          respondedAt: new Date().toISOString(),
          respondedBy: "current-user", // In real app, get from auth context
        },
        updatedAt: new Date().toISOString(),
      })

      toast({
        title: "Klarifikasi berhasil dikirim",
        description: "Klarifikasi Anda telah dikirim ke validator untuk review ulang",
      })

      onSuccess()
      onClose()
      setResponse("")
    } catch (error) {
      console.error("Error submitting clarification:", error)
      toast({
        title: "Gagal mengirim klarifikasi",
        description: "Terjadi kesalahan saat mengirim klarifikasi",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Berikan Klarifikasi
          </DialogTitle>
          <DialogDescription>
            Validator meminta klarifikasi untuk reimbursement Anda. Silakan berikan penjelasan yang diperlukan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reimbursement Details */}
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold text-lg">{reimbursement.title}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{formatCurrency(reimbursement.amount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(reimbursement.date)}</span>
              </div>
            </div>
            <Badge variant="secondary">{reimbursement.status}</Badge>
          </div>

          {/* Clarification Request */}
          {reimbursement.clarificationRequest && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 space-y-2">
              <h4 className="font-medium text-orange-900">Permintaan Klarifikasi dari Validator:</h4>
              <p className="text-orange-800">{reimbursement.clarificationRequest.message}</p>
              <p className="text-xs text-orange-600">
                Diminta pada: {formatDate(reimbursement.clarificationRequest.requestedAt)}
              </p>
            </div>
          )}

          {/* Response Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="response">Klarifikasi Anda</Label>
              <Textarea
                id="response"
                placeholder="Berikan penjelasan atau klarifikasi yang diminta oleh validator..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                disabled={isSubmitting}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Berikan penjelasan yang jelas dan detail untuk mempercepat proses review.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting || !response.trim()}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirim Klarifikasi
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
