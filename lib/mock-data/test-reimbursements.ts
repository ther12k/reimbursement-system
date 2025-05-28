export interface TestReimbursement {
  id: string
  userId: string
  userEmail: string
  userName: string
  title: string
  description: string
  amount: number
  category: string
  date: string
  status: "pending" | "approved" | "rejected" | "needs_clarification"
  submittedAt: string
  receipts: string[]
  clarificationRequest?: {
    message: string
    requestedAt: string
    requestedBy: string
    requestedByName: string
    items: string[]
  }
  clarificationResponse?: {
    message: string
    respondedAt: string
    respondedBy: string
  }
}

export const testReimbursements: TestReimbursement[] = [
  {
    id: "RB-2025-001",
    userId: "user-001",
    userEmail: "user@example.com",
    userName: "John Doe",
    title: "Perjalanan Dinas ke Jakarta",
    description: "Meeting dengan klien dan training",
    amount: 2500000,
    category: "transportation",
    date: "2025-01-15",
    status: "pending",
    submittedAt: "2025-01-16T10:00:00Z",
    receipts: ["/placeholder.svg?height=400&width=300"],
  },
  {
    id: "RB-2025-002",
    userId: "user-001",
    userEmail: "user@example.com",
    userName: "John Doe",
    title: "Hotel Akomodasi Jakarta",
    description: "Menginap 2 malam untuk perjalanan dinas",
    amount: 1800000,
    category: "accommodation",
    date: "2025-01-15",
    status: "needs_clarification",
    submittedAt: "2025-01-16T10:30:00Z",
    receipts: ["/placeholder.svg?height=400&width=300"],
    clarificationRequest: {
      message:
        "Mohon klarifikasi mengenai: 1) Bukti pembayaran hotel tidak jelas, 2) Tanggal check-in dan check-out tidak sesuai dengan jadwal perjalanan dinas, 3) Tarif hotel melebihi standar perusahaan. Silakan berikan penjelasan dan bukti tambahan.",
      requestedAt: "2025-01-17T14:30:00Z",
      requestedBy: "validator-001",
      requestedByName: "Jane Smith",
      items: [
        "Bukti pembayaran hotel tidak jelas",
        "Tanggal check-in dan check-out tidak sesuai",
        "Tarif hotel melebihi standar perusahaan",
      ],
    },
  },
  {
    id: "RB-2025-003",
    userId: "user-001",
    userEmail: "user@example.com",
    userName: "John Doe",
    title: "Makan Malam dengan Klien",
    description: "Business dinner dengan klien potensial",
    amount: 750000,
    category: "meals",
    date: "2025-01-15",
    status: "approved",
    submittedAt: "2025-01-16T11:00:00Z",
    receipts: ["/placeholder.svg?height=400&width=300"],
  },
]

// Helper functions
export const getReimbursementsByUser = (userEmail: string) => {
  return testReimbursements.filter((r) => r.userEmail === userEmail)
}

export const getReimbursementsByStatus = (status: string) => {
  return testReimbursements.filter((r) => r.status === status)
}

export const getReimbursementById = (id: string) => {
  return testReimbursements.find((r) => r.id === id)
}

export const updateReimbursementStatus = (id: string, status: string, additionalData?: any) => {
  const index = testReimbursements.findIndex((r) => r.id === id)
  if (index !== -1) {
    testReimbursements[index] = {
      ...testReimbursements[index],
      status: status as any,
      ...additionalData,
    }
  }
}
