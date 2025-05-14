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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileSpreadsheet, FileIcon as FilePdf, Download, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatShortDate } from "@/lib/utils"

interface ExportReportDialogProps {
  isOpen: boolean
  onClose: () => void
  reportType: "reimbursements" | "events" | "users"
}

export function ExportReportDialog({ isOpen, onClose, reportType }: ExportReportDialogProps) {
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel")
  const [dateRange, setDateRange] = useState<"all" | "custom" | "last30" | "last90">("all")
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // 30 days ago
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
    id: true,
    user: true,
    event: true,
    amount: true,
    status: true,
    date: true,
    details: false,
  })
  const [includeSubtotals, setIncludeSubtotals] = useState(true)
  const [groupBy, setGroupBy] = useState<"none" | "status" | "user" | "event" | "date">("none")

  const handleFieldToggle = (field: string, checked: boolean) => {
    setSelectedFields({
      ...selectedFields,
      [field]: checked,
    })
  }

  const getReportTitle = () => {
    switch (reportType) {
      case "reimbursements":
        return "Laporan Reimbursement"
      case "events":
        return "Laporan Acara"
      case "users":
        return "Laporan Pengguna"
      default:
        return "Laporan"
    }
  }

  const getFieldOptions = () => {
    switch (reportType) {
      case "reimbursements":
        return [
          { id: "id", label: "ID Reimbursement" },
          { id: "user", label: "Nama Pengguna" },
          { id: "event", label: "Acara" },
          { id: "amount", label: "Jumlah" },
          { id: "status", label: "Status" },
          { id: "date", label: "Tanggal Pengajuan" },
          { id: "details", label: "Detail Pengeluaran" },
          { id: "notes", label: "Catatan" },
        ]
      case "events":
        return [
          { id: "id", label: "ID Acara" },
          { id: "name", label: "Nama Acara" },
          { id: "date", label: "Tanggal" },
          { id: "location", label: "Lokasi" },
          { id: "participants", label: "Jumlah Peserta" },
          { id: "submissions", label: "Jumlah Pengajuan" },
          { id: "status", label: "Status" },
        ]
      case "users":
        return [
          { id: "id", label: "ID Pengguna" },
          { id: "name", label: "Nama" },
          { id: "email", label: "Email" },
          { id: "role", label: "Peran" },
          { id: "status", label: "Status" },
          { id: "department", label: "Departemen" },
        ]
      default:
        return []
    }
  }

  const getGroupByOptions = () => {
    switch (reportType) {
      case "reimbursements":
        return [
          { id: "none", label: "Tidak Ada" },
          { id: "status", label: "Status" },
          { id: "user", label: "Pengguna" },
          { id: "event", label: "Acara" },
          { id: "date", label: "Bulan" },
        ]
      case "events":
        return [
          { id: "none", label: "Tidak Ada" },
          { id: "status", label: "Status" },
          { id: "date", label: "Bulan" },
          { id: "location", label: "Lokasi" },
        ]
      case "users":
        return [
          { id: "none", label: "Tidak Ada" },
          { id: "role", label: "Peran" },
          { id: "status", label: "Status" },
          { id: "department", label: "Departemen" },
        ]
      default:
        return []
    }
  }

  const handleExport = () => {
    // In a real app, this would call an API or use a library to generate the export
    // For this demo, we'll simulate the export with a timeout

    toast({
      title: "Mengekspor laporan...",
      description: "Laporan sedang diproses",
    })

    setTimeout(() => {
      toast({
        title: "Ekspor berhasil",
        description: `Laporan ${getReportTitle()} telah diunduh dalam format ${
          exportFormat === "excel" ? "Excel" : "PDF"
        }`,
      })
      onClose()
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ekspor {getReportTitle()}</DialogTitle>
          <DialogDescription>
            Pilih format dan opsi untuk mengekspor laporan {getReportTitle().toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="format" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="filter">Filter</TabsTrigger>
            <TabsTrigger value="options">Opsi</TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Format Ekspor</Label>
              <RadioGroup
                value={exportFormat}
                onValueChange={(value) => setExportFormat(value as "excel" | "pdf")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="flex items-center gap-2 cursor-pointer">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Excel (.xlsx)</p>
                      <p className="text-sm text-muted-foreground">
                        Ekspor ke spreadsheet Excel untuk analisis lebih lanjut
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                    <FilePdf className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">PDF (.pdf)</p>
                      <p className="text-sm text-muted-foreground">
                        Ekspor ke PDF untuk dokumen yang mudah dibagikan dan dicetak
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="filter" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rentang Tanggal</Label>
              <RadioGroup
                value={dateRange}
                onValueChange={(value) => setDateRange(value as "all" | "custom" | "last30" | "last90")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">Semua waktu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="last30" id="last30" />
                  <Label htmlFor="last30">30 hari terakhir</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="last90" id="last90" />
                  <Label htmlFor="last90">90 hari terakhir</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Kustom</Label>
                </div>
              </RadioGroup>

              {dateRange === "custom" && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Tanggal Mulai</Label>
                    <DatePicker date={startDate} setDate={setStartDate} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Akhir</Label>
                    <DatePicker date={endDate} setDate={setEndDate} />
                  </div>
                </div>
              )}
            </div>

            {reportType === "reimbursements" && (
              <div className="space-y-2 mt-4">
                <Label>Filter Status</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                    <SelectItem value="clarification">Perlu Klarifikasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>

          <TabsContent value="options" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Kolom yang Ditampilkan</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {getFieldOptions().map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`field-${field.id}`}
                      checked={selectedFields[field.id] ?? false}
                      onCheckedChange={(checked) => handleFieldToggle(field.id, checked === true)}
                    />
                    <Label htmlFor={`field-${field.id}`} className="cursor-pointer">
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label>Opsi Tambahan</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-subtotals"
                    checked={includeSubtotals}
                    onCheckedChange={(checked) => setIncludeSubtotals(checked === true)}
                  />
                  <Label htmlFor="include-subtotals" className="cursor-pointer">
                    Sertakan subtotal
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label>Kelompokkan Berdasarkan</Label>
              <Select value={groupBy} onValueChange={(value) => setGroupBy(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pengelompokan" />
                </SelectTrigger>
                <SelectContent>
                  {getGroupByOptions().map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-muted p-3 rounded-md mt-2">
          <h4 className="font-medium mb-2 flex items-center gap-1">
            <Filter className="h-4 w-4" /> Ringkasan Ekspor
          </h4>
          <ul className="text-sm space-y-1">
            <li>
              <span className="text-muted-foreground">Format:</span>{" "}
              {exportFormat === "excel" ? "Excel (.xlsx)" : "PDF (.pdf)"}
            </li>
            <li>
              <span className="text-muted-foreground">Rentang Tanggal:</span>{" "}
              {dateRange === "all"
                ? "Semua waktu"
                : dateRange === "last30"
                  ? "30 hari terakhir"
                  : dateRange === "last90"
                    ? "90 hari terakhir"
                    : `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`}
            </li>
            <li>
              <span className="text-muted-foreground">Pengelompokan:</span>{" "}
              {getGroupByOptions().find((option) => option.id === groupBy)?.label || "Tidak Ada"}
            </li>
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Ekspor {exportFormat === "excel" ? "Excel" : "PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
