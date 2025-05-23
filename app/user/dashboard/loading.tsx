import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Skeleton for PageHeader */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Skeleton className="h-8 w-48" /> {/* Title: "Dashboard Saya" */}
        </div>
        <Skeleton className="h-10 w-44" /> {/* Button: "Reimbursement Baru" */}
      </div>

      {/* Skeleton for Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" /> {/* CardTitle */}
              <Skeleton className="h-4 w-4" /> {/* Icon */}
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-12" /> {/* Main stat number */}
              <Skeleton className="mt-1 h-3 w-32" /> {/* Sub-description */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeleton for Reimbursements Table Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40" /> {/* CardTitle: "Reimbursement Saya" */}
          <Skeleton className="mt-1 h-4 w-64" /> {/* CardDescription */}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-5 w-40" /></TableHead>
                  <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                  <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                  <TableHead className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell> {/* Badge */}
                    <TableCell className="text-right"><Skeleton className="h-9 w-16 ml-auto" /></TableCell> {/* Button */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
