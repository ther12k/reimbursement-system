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
import { useToast } from "@/hooks/use-toast"

interface ReceiptNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: string) => void
  initialNote?: string
  receiptTitle: string
}

export function ReceiptNoteDialog({ isOpen, onClose, onSave, initialNote = "", receiptTitle }: ReceiptNoteDialogProps) {
  const [note, setNote] = useState(initialNote)
  const { toast } = useToast()

  const handleSave = () => {
    onSave(note)
    toast({
      title: "Catatan disimpan",
      description: "Catatan untuk bukti pengeluaran telah disimpan",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Catatan Bukti Pengeluaran</DialogTitle>
          <DialogDescription>Tambahkan catatan untuk bukti pengeluaran: {receiptTitle}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="note">Catatan</Label>
            <Textarea
              id="note"
              placeholder="Masukkan catatan untuk bukti pengeluaran ini..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan Catatan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
