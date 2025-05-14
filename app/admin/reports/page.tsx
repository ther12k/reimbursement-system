"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, FileIcon as FilePdf, Download, BarChart3, PieChart, Filter } from "lucide-react"
import { ExportReportDialog } from "@/components/export-report-dialog"
import { formatRupiah, translateStatus } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"

// Mock data for reimbursements
const mockReimbursements = [
  {
    id: "RB-2025-1234",
    user: "John Doe",
    event: "Annual Conference 2025",
    amount: 7400000,
    submittedDate: "10 Mei 2025",
    status: "approved",
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
    status: "rejected",
  },
  {
    id: "RB-2025-1237",
    user: "Alice Brown",
    event: "Sales Kickoff Meeting",
    amount: 11000000,
    submittedDate: "7 Mei 2025",
    status: "clarification",
  },
  {
    id: "RB-2025-1238",
    user: "Charlie Davis",
    event: "Product Launch Event",
    amount: 9200000,
    submittedDate: "6 Mei 2025",
    status: "approved",
  },
]

// Mock data for summary
const mockSummary = {
  totalReimbursements: 42,
  totalAmount: 325000000,
  approvedAmount: 210000000,
  pendingAmount: 85000000,
  rejectedAmount: 30000000,
  byStatus: [
    { status: "approved", count: 25, amount: 210000000 },
    { status: "pending", count: 10, amount: 85000000 },
    { status: "rejected", count: 5, amount: 30000000 },
    { status: "clarification", count: 2, amount: 15000000 },
  ],
  byEvent: [
    { event: "Annual Conference 2025", count: 15, amount: 120000000 },
    { event: "Sales Kickoff Meeting", count: 12, amount: 95000000 },
    { event: "Product Launch Event", count: 8, amount: 65000000 },
    { event: "Team Building Retreat", count: 7, amount: 45000000 },
  ],
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("reimbursements")
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // 30 days ago
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportType, setExportType] = useState<"reimbursements" | "events" | "users">("reimbursements")

  const handleExport = (type: "reimbursements" | "events" | "users") => {
    setExportType(type)
    setIsExportDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan"
        description="Lihat dan ekspor laporan untuk reimbursement, acara, dan pengguna"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("reimbursements")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Ekspor Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport("reimbursements")}>
              <FilePdf className="mr-2 h-4 w-4" />
              Ekspor PDF
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Filter Laporan</CardTitle>
              <CardDescription>Pilih rentang tanggal dan filter untuk laporan Anda</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Reset Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tanggal Mulai</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Akhir</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
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
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reimbursement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSummary.totalReimbursements}</div>
            <p className="text-xs text-muted-foreground">Dalam periode yang dipilih</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Jumlah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(mockSummary.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">Semua reimbursement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Disetujui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(mockSummary.approvedAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockSummary.approvedAmount / mockSummary.totalAmount) * 100)}% dari total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Tertunda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(mockSummary.pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockSummary.pendingAmount / mockSummary.totalAmount) * 100)}% dari total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="reimbursements">Reimbursement</TabsTrigger>
          <TabsTrigger value="summary">Ringkasan</TabsTrigger>
          <TabsTrigger value="charts">Grafik</TabsTrigger>
        </TabsList>

        <TabsContent value="reimbursements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Daftar Reimbursement</CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleExport("reimbursements")}>
                  <Download className="mr-2 h-4 w-4" />
                  Ekspor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pengguna</TableHead>
                    <TableHead>Acara</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReimbursements.map((reimbursement) => (
                    <TableRow key={reimbursement.id}>
                      <TableCell className="font-medium">{reimbursement.id}</TableCell>
                      <TableCell>{reimbursement.user}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">Menampilkan 5 dari 42 reimbursement</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Sebelumnya
                </Button>
                <Button variant="outline" size="sm">
                  Selanjutnya
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Berdasarkan Status</CardTitle>
                <CardDescription>Ringkasan reimbursement berdasarkan status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Persentase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSummary.byStatus.map((item) => (
                      <TableRow key={item.status}>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === "approved"
                                ? "success"
                                : item.status === "rejected"
                                  ? "destructive"
                                  : item.status === "clarification"
                                    ? "warning"
                                    : "outline"
                            }
                          >
                            {translateStatus(item.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.count}</TableCell>
                        <TableCell>{formatRupiah(item.amount)}</TableCell>
                        <TableCell>{Math.round((item.amount / mockSummary.totalAmount) * 100)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Berdasarkan Acara</CardTitle>
                <CardDescription>Ringkasan reimbursement berdasarkan acara</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Acara</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Persentase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSummary.byEvent.map((item) => (
                      <TableRow key={item.event}>
                        <TableCell>{item.event}</TableCell>
                        <TableCell>{item.count}</TableCell>
                        <TableCell>{formatRupiah(item.amount)}</TableCell>
                        <TableCell>{Math.round((item.amount / mockSummary.totalAmount) * 100)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Status</CardTitle>
                <CardDescription>Distribusi reimbursement berdasarkan status</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-16 w-16 mx-auto text-gray-400" />
                  <p className="mt-4 text-lg font-medium">Grafik Distribusi Status</p>
                  <p className="text-sm text-gray-500">
                    Grafik visual akan ditampilkan di sini dengan data yang sebenarnya
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tren Bulanan</CardTitle>
                <CardDescription>Tren reimbursement per bulan</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto text-gray-400" />
                  <p className="mt-4 text-lg font-medium">Grafik Tren Bulanan</p>
                  <p className="text-sm text-gray-500">
                    Grafik visual akan ditampilkan di sini dengan data yang sebenarnya
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ExportReportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        reportType={exportType}
      />
    </div>
  )
}
