"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatRupiah, translateStatus } from "@/lib/utils"
import { EmptyState } from "@/components/shared/empty-state" // Import EmptyState
import { FileText, PlusCircle } from "lucide-react" // Import icons for EmptyState

// Mock data for user reimbursements
const userReimbursements = [
  {
    id: "RB-2025-1234",
    event: "Annual Conference 2025",
    amount: 7400000,
    submittedDate: "10 Mei 2025",
    status: "pending",
  },
  {
    id: "RB-2025-1100",
    event: "Team Building Retreat",
    amount: 4500000,
    submittedDate: "15 Apr 2025",
    status: "approved",
  },
  {
    id: "RB-2025-1050",
    event: "Sales Kickoff Meeting",
    amount: 8750000,
    submittedDate: "20 Mar 2025",
    status: "approved",
  },
  {
    id: "RB-2025-1025",
    event: "Product Launch Event",
    amount: 6500000,
    submittedDate: "28 Feb 2025",
    status: "approved",
  },
  {
    id: "RB-2025-1010",
    event: "Marketing Workshop",
    amount: 3200000,
    submittedDate: "15 Jan 2025",
    status: "rejected",
  },
  {
    id: "RB-2025-1005",
    event: "Regional Meeting",
    amount: 5600000,
    submittedDate: "5 Jan 2025",
    status: "clarification",
  },
]

export default function UserReimbursementsTable() {
  if (userReimbursements.length === 0) {
    return (
      <EmptyState
        title="Tidak Ada Reimbursement"
        description="Anda belum memiliki permintaan reimbursement."
        icon={<FileText className="h-12 w-12" />}
        action={
          <Button asChild>
            <Link href="/user/reimbursements/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat Reimbursement Baru
            </Link>
          </Button>
        }
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Acara</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Tanggal Pengajuan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Tindakan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userReimbursements.map((reimbursement) => (
          <TableRow key={reimbursement.id}>
            <TableCell className="font-medium">{reimbursement.id}</TableCell>
            <TableCell>{reimbursement.event}</TableCell>
            <TableCell>{formatRupiah(reimbursement.amount)}</TableCell>
            <TableCell>{reimbursement.submittedDate}</TableCell>
            <TableCell>
              <Badge
                variant={
                  reimbursement.status === "approved"
                    ? "success"
                    : reimbursement.status === "rejected"
                      ? "destructive"
                      : reimbursement.status === "clarification"
                        ? "warning"
                        : "outline"
                }
              >
                {translateStatus(reimbursement.status)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/user/reimbursements/${reimbursement.id}`}>Lihat</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
