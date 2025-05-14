import { formatRupiah, formatShortDate, translateStatus } from "@/lib/utils"

// Tipe data untuk opsi ekspor
export interface ExportOptions {
  format: "excel" | "pdf"
  dateRange: "all" | "custom" | "last30" | "last90"
  startDate?: Date
  endDate?: Date
  selectedFields: Record<string, boolean>
  includeSubtotals: boolean
  groupBy: "none" | "status" | "user" | "event" | "date"
  status?: string
}

// Fungsi untuk mengekspor data reimbursement ke Excel
export async function exportReimbursementsToExcel(data: any[], options: ExportOptions): Promise<void> {
  // Dalam implementasi nyata, ini akan menggunakan library seperti exceljs
  // Untuk demo, kita hanya akan mengembalikan Promise yang diselesaikan
  console.log("Exporting reimbursements to Excel with options:", options)
  console.log("Data:", data)

  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

// Fungsi untuk mengekspor data reimbursement ke PDF
export async function exportReimbursementsToPDF(data: any[], options: ExportOptions): Promise<void> {
  // Dalam implementasi nyata, ini akan menggunakan library seperti jspdf
  // Untuk demo, kita hanya akan mengembalikan Promise yang diselesaikan
  console.log("Exporting reimbursements to PDF with options:", options)
  console.log("Data:", data)

  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

// Fungsi untuk memfilter data berdasarkan rentang tanggal
export function filterDataByDateRange(data: any[], options: ExportOptions): any[] {
  if (options.dateRange === "all") {
    return data
  }

  const now = new Date()
  let startDate: Date

  switch (options.dateRange) {
    case "last30":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case "last90":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case "custom":
      startDate = options.startDate || now
      break
    default:
      return data
  }

  const endDate = options.endDate || now

  return data.filter((item) => {
    const itemDate = new Date(item.submittedDate || item.date)
    return itemDate >= startDate && itemDate <= endDate
  })
}

// Fungsi untuk mengelompokkan data berdasarkan opsi pengelompokan
export function groupDataBy(data: any[], groupBy: string): Record<string, any[]> {
  if (groupBy === "none") {
    return { all: data }
  }

  return data.reduce((groups: Record<string, any[]>, item) => {
    const key = item[groupBy] || "unknown"
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {})
}

// Fungsi untuk menghitung subtotal
export function calculateSubtotals(data: any[]): { count: number; totalAmount: number } {
  return data.reduce(
    (acc, item) => {
      return {
        count: acc.count + 1,
        totalAmount: acc.totalAmount + (item.amount || 0),
      }
    },
    { count: 0, totalAmount: 0 },
  )
}

// Fungsi untuk memformat data untuk ekspor
export function formatDataForExport(data: any[], options: ExportOptions): any[] {
  return data.map((item) => {
    const formattedItem: Record<string, any> = {}

    if (options.selectedFields.id) formattedItem.id = item.id
    if (options.selectedFields.user) formattedItem.user = item.user
    if (options.selectedFields.event) formattedItem.event = item.event
    if (options.selectedFields.amount) formattedItem.amount = formatRupiah(item.amount)
    if (options.selectedFields.status) formattedItem.status = translateStatus(item.status)
    if (options.selectedFields.date) formattedItem.date = item.submittedDate || formatShortDate(item.date)
    if (options.selectedFields.details) formattedItem.details = item.details || ""
    if (options.selectedFields.notes) formattedItem.notes = item.notes || ""

    return formattedItem
  })
}
