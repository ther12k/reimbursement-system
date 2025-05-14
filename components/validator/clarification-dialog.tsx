"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

interface ClarificationItem {
  id: string
  label: string
  checked: boolean
}

interface ClarificationDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (items: ClarificationItem[], note: string) => void
  reimbursementId: string
}

export function ClarificationDialog({ isOpen, onClose, onSubmit, reimbursementId }: ClarificationDialogProps) {
  const [note, setNote] = useState("")
  const [clarificationItems, setClarificationItems] = useState<ClarificationItem[]>([
    { id: "missing-receipt", label: "Bukti pengeluaran tidak lengkap", checked: false },
    { id: "unclear-receipt", label: "Bukti pengeluaran tidak jelas", checked: false },
    { id: "amount-mismatch", label: "Jumlah tidak sesuai dengan bukti", checked: false },
    { id: "invalid-date", label: "Tanggal tidak valid", checked: false },
    { id: "unauthorized-expense", label: "Pengeluaran tidak diizinkan", checked: false },
    { id: "exceeds-limit", label: "Melebihi batas pengeluaran", checked: false },
    { id: "missing-details", label: "Detail pengeluaran kurang lengkap", checked: false },
    { id: "other", label: "Lainnya (jelaskan di catatan)", checked: false },
  ])
  const { toast } = useToast()

  const handleItemChange = (id: string, checked: boolean) => {
    setClarificationItems(clarificationItems.map((item) => (item.id === id ? { ...item, checked } : item)))
  }

  const handleSubmit = () => {
    const selectedItems = clarificationItems.filter((item) => item.checked)

    if (selectedItems.length === 0) {
      toast({
        title: "Pilih alasan klarifikasi",
        description: "Pilih setidaknya satu alasan untuk permintaan klarifikasi",
        variant: "destructive",
      })
      return
    }

    onSubmit(selectedItems, note)
    toast({
      title: "Permintaan klarifikasi dikirim",
      description: "Permintaan klarifikasi telah dikirim ke pengguna",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Permintaan Klarifikasi</DialogTitle>
          <DialogDescription>Pilih item yang perlu diklarifikasi oleh pengguna</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <Label>Alasan Permintaan Klarifikasi</Label>
            {clarificationItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={(checked) => handleItemChange(item.id, checked === true)}
                />
                <Label htmlFor={item.id} className="cursor-pointer">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Catatan Tambahan</Label>
            <Textarea
              id="note"
              placeholder="Berikan detail tambahan tentang apa yang perlu diklarifikasi..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>Kirim Permintaan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
