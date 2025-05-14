"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatRupiah, translateStatus } from "@/lib/utils"

// Mock data for pending reimbursements
const pendingReimbursements = [
  {
    id: "RB-2025-1234",
    user: "John Doe",
    event: "Annual Conference 2025",
    amount: 7400000,
    submittedDate: "10 Mei 2025",
    status: "pending",
  },
  {
    id: "RB-2025-1235",
    user: "Jane Smith",
    event: "Sales Kickoff Meeting",
    amount: 8750000,
    submittedDate: "9 Mei 2025",
    status: "pending",
  },
  {
    id: "RB-2025-1236",
    user: "Bob Johnson",
    event: "Product Launch Event",
    amount: 6500000,
    submittedDate: "8 Mei 2025",
    status: "pending",
  },
  {
    id: "RB-2025-1237",
    user: "Alice Brown",
    event: "Sales Kickoff Meeting",
    amount: 11000000,
    submittedDate: "7 Mei 2025",
    status: "pending",
  },
  {
    id: "RB-2025-1238",
    user: "Charlie Davis",
    event: "Product Launch Event",
    amount: 9200000,
    submittedDate: "6 Mei 2025",
    status: "pending",
  },
]

export default function PendingReimbursementsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Pengguna</TableHead>
          <TableHead>Acara</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Tanggal Pengajuan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Tindakan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingReimbursements.map((reimbursement) => (
          <TableRow key={reimbursement.id}>
            <TableCell className="font-medium">{reimbursement.id}</TableCell>
            <TableCell>{reimbursement.user}</TableCell>
            <TableCell>{reimbursement.event}</TableCell>
            <TableCell>{formatRupiah(reimbursement.amount)}</TableCell>
            <TableCell>{reimbursement.submittedDate}</TableCell>
            <TableCell>
              <Badge variant="outline">{translateStatus(reimbursement.status)}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/validator/reimbursements/${reimbursement.id}`}>Tinjau</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
