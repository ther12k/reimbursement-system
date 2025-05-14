"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2 } from "lucide-react"
import DocumentUploader from "@/components/document-uploader"
import { formatRupiah } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"

// Mock data for events
const mockEvents = [
  { id: "1", name: "Annual Conference 2025" },
  { id: "2", name: "Team Building Retreat" },
  { id: "3", name: "Sales Kickoff Meeting" },
  { id: "4", name: "Product Launch Event" },
]

export default function NewReimbursementPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    eventId: "",
    expenseDate: new Date(),
  })

  const [expenses, setExpenses] = useState([{ id: 1, type: "", description: "", amount: "", receipt: null }])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        expenseDate: date,
      })
    }
  }

  const handleEventChange = (value: string) => {
    setFormData({
      ...formData,
      eventId: value,
    })
  }

  const handleExpenseChange = (id: number, field: string, value: string) => {
    setExpenses(expenses.map((expense) => (expense.id === id ? { ...expense, [field]: value } : expense)))
  }

  const handleAddExpense = () => {
    const newId = Math.max(...expenses.map((expense) => expense.id), 0) + 1
    setExpenses([...expenses, { id: newId, type: "", description: "", amount: "", receipt: null }])
  }

  const handleRemoveExpense = (id: number) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((expense) => expense.id !== id))
    } else {
      toast({
        title: "Tidak dapat menghapus",
        description: "Anda harus memiliki setidaknya satu item pengeluaran",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (id: number, file: File | null) => {
    setExpenses(expenses.map((expense) => (expense.id === id ? { ...expense, receipt: file } : expense)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.eventId) {
      toast({
        title: "Acara tidak dipilih",
        description: "Silakan pilih acara",
        variant: "destructive",
      })
      return
    }

    const invalidExpenses = expenses.filter((expense) => !expense.type || !expense.amount || !expense.receipt)

    if (invalidExpenses.length > 0) {
      toast({
        title: "Pengeluaran tidak lengkap",
        description: "Silakan lengkapi semua detail pengeluaran dan unggah bukti",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send this data to your backend
    // For demo purposes, we'll simulate a successful submission

    toast({
      title: "Reimbursement diajukan",
      description: "Permintaan reimbursement Anda telah diajukan untuk persetujuan",
    })

    router.push("/user/dashboard")
  }

  // Format amount to Rupiah when displayed
  const formatAmountForDisplay = (amount: string) => {
    if (!amount) return ""
    const numericValue = Number.parseInt(amount.replace(/\D/g, ""), 10)
    return isNaN(numericValue) ? "" : formatRupiah(numericValue)
  }

  // Parse Rupiah formatted string to number for input
  const parseAmountForInput = (formattedAmount: string) => {
    return formattedAmount.replace(/\D/g, "")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Pengajuan Reimbursement Baru"
        description="Isi formulir di bawah ini untuk mengajukan penggantian biaya"
        className="mb-6"
      />

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informasi Acara</CardTitle>
            <CardDescription>Pilih acara yang terkait dengan pengeluaran ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventId">Acara</Label>
              <Select value={formData.eventId} onValueChange={handleEventChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih acara" />
                </SelectTrigger>
                <SelectContent>
                  {mockEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Pengeluaran</Label>
              <DatePicker date={formData.expenseDate} setDate={handleDateChange} />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detail Pengeluaran</CardTitle>
            <CardDescription>Tambahkan semua pengeluaran yang ingin diganti</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {expenses.map((expense, index) => (
              <div key={expense.id} className="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Pengeluaran {index + 1}</h3>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveExpense(expense.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Hapus</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`expense-type-${expense.id}`}>Jenis Pengeluaran</Label>
                    <Select
                      value={expense.type}
                      onValueChange={(value) => handleExpenseChange(expense.id, "type", value)}
                    >
                      <SelectTrigger id={`expense-type-${expense.id}`}>
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accommodation">Akomodasi</SelectItem>
                        <SelectItem value="transportation">Transportasi</SelectItem>
                        <SelectItem value="meals">Konsumsi</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`expense-amount-${expense.id}`}>Jumlah</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">Rp</span>
                      </div>
                      <Input
                        id={`expense-amount-${expense.id}`}
                        type="text"
                        placeholder="0"
                        className="pl-10"
                        value={expense.amount}
                        onChange={(e) => {
                          const rawValue = parseAmountForInput(e.target.value)
                          handleExpenseChange(expense.id, "amount", rawValue)
                        }}
                      />
                    </div>
                    {expense.amount && (
                      <p className="text-xs text-muted-foreground">{formatAmountForDisplay(expense.amount)}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`expense-description-${expense.id}`}>Deskripsi</Label>
                  <Textarea
                    id={`expense-description-${expense.id}`}
                    placeholder="Berikan detail tentang pengeluaran ini"
                    value={expense.description}
                    onChange={(e) => handleExpenseChange(expense.id, "description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bukti Pengeluaran</Label>
                  <DocumentUploader onFileSelected={(file) => handleFileUpload(expense.id, file)} />
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" className="w-full" onClick={handleAddExpense}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengeluaran Lain
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit">Ajukan Reimbursement</Button>
        </div>
      </form>
    </div>
  )
}
