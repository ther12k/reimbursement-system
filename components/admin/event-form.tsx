"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useFirestore } from "@/lib/firebase/firestore"

interface EventFormProps {
  event?: {
    id: string
    name: string
    description: string
    startDate: Date | string
    endDate: Date | string
    location: string
    status: string
    allowAccommodation: boolean
    allowTransportation: boolean
    allowMeals: boolean
    allowOther: boolean
    budgetLimit?: number
  }
  onSuccess: () => void
  onCancel: () => void
}

export function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const { toast } = useToast()
  const { addDocument, updateDocument } = useFirestore("events")
  const [isLoading, setIsLoading] = useState(false)

  // Parse dates from string to Date if needed
  const parseDate = (dateValue: Date | string | undefined): Date => {
    if (!dateValue) return new Date()
    return typeof dateValue === "string" ? new Date(dateValue) : dateValue
  }

  const [formData, setFormData] = useState({
    name: event?.name || "",
    description: event?.description || "",
    startDate: parseDate(event?.startDate),
    endDate: parseDate(event?.endDate),
    location: event?.location || "",
    status: event?.status || "upcoming",
    allowAccommodation: event?.allowAccommodation ?? true,
    allowTransportation: event?.allowTransportation ?? true,
    allowMeals: event?.allowMeals ?? true,
    allowOther: event?.allowOther ?? false,
    budgetLimit: event?.budgetLimit ? String(event.budgetLimit) : "",
  })

  const isEditMode = !!event

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const eventData = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        status: formData.status,
        allowAccommodation: formData.allowAccommodation,
        allowTransportation: formData.allowTransportation,
        allowMeals: formData.allowMeals,
        allowOther: formData.allowOther,
        budgetLimit: formData.budgetLimit ? Number.parseInt(formData.budgetLimit, 10) : undefined,
      }

      if (isEditMode && event) {
        // Update existing event
        await updateDocument(event.id, eventData)

        toast({
          title: "Acara diperbarui",
          description: `${formData.name} telah berhasil diperbarui`,
        })
      } else {
        // Create new event
        await addDocument(eventData)

        toast({
          title: "Acara ditambahkan",
          description: `${formData.name} telah berhasil ditambahkan`,
        })
      }

      onSuccess()
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: "Gagal menyimpan acara",
        description: "Terjadi kesalahan saat menyimpan data acara",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nama Acara</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Annual Conference 2025"
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Berikan detail tentang acara ini"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Tanggal Mulai</Label>
          <DatePicker date={formData.startDate} setDate={(date) => handleDateChange("startDate", date)} />
        </div>
        <div className="grid gap-2">
          <Label>Tanggal Selesai</Label>
          <DatePicker date={formData.endDate} setDate={(date) => handleDateChange("endDate", date)} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Lokasi</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Jakarta, Indonesia atau Virtual"
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="budgetLimit">Batas Anggaran (opsional)</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground">Rp</span>
          </div>
          <Input
            id="budgetLimit"
            name="budgetLimit"
            value={formData.budgetLimit}
            onChange={handleInputChange}
            placeholder="1000000"
            type="text"
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-medium">Jenis Pengeluaran yang Diizinkan</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allowAccommodation">Akomodasi</Label>
            <p className="text-sm text-muted-foreground">Hotel, Airbnb, dll.</p>
          </div>
          <Switch
            id="allowAccommodation"
            checked={formData.allowAccommodation}
            onCheckedChange={(checked) => handleSwitchChange("allowAccommodation", checked)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allowTransportation">Transportasi</Label>
            <p className="text-sm text-muted-foreground">Pesawat, kereta, taksi, dll.</p>
          </div>
          <Switch
            id="allowTransportation"
            checked={formData.allowTransportation}
            onCheckedChange={(checked) => handleSwitchChange("allowTransportation", checked)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allowMeals">Konsumsi</Label>
            <p className="text-sm text-muted-foreground">Sarapan, makan siang, makan malam, dll.</p>
          </div>
          <Switch
            id="allowMeals"
            checked={formData.allowMeals}
            onCheckedChange={(checked) => handleSwitchChange("allowMeals", checked)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allowOther">Pengeluaran Lainnya</Label>
            <p className="text-sm text-muted-foreground">Pengeluaran lain-lain</p>
          </div>
          <Switch
            id="allowOther"
            checked={formData.allowOther}
            onCheckedChange={(checked) => handleSwitchChange("allowOther", checked)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : isEditMode ? "Perbarui Acara" : "Tambah Acara"}
        </Button>
      </div>
    </form>
  )
}
