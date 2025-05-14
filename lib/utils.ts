import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency to Indonesian Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date to Indonesian format
export function formatDate(date: Date | string): string {
  if (!date) return ""

  const dateObj = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj)
}

// Format short date to Indonesian format (DD/MM/YYYY)
export function formatShortDate(date: Date | string): string {
  if (!date) return ""

  const dateObj = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj)
}

// Translate status to Bahasa Indonesia
export function translateStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak",
    clarification: "Perlu Klarifikasi",
    draft: "Draft",
    submitted: "Diajukan",
    completed: "Selesai",
    active: "Aktif",
    inactive: "Tidak Aktif",
    upcoming: "Akan Datang",
  }

  return statusMap[status.toLowerCase()] || status
}

// Translate expense types to Bahasa Indonesia
export function translateExpenseType(type: string): string {
  const typeMap: Record<string, string> = {
    accommodation: "Akomodasi",
    transportation: "Transportasi",
    meals: "Konsumsi",
    other: "Lainnya",
  }

  return typeMap[type.toLowerCase()] || type
}
