import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/shared/page-header" // We can reuse this for consistent header structure
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Skeleton for PageHeader */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Skeleton className="h-8 w-48" /> {/* Title */}
          <Skeleton className="mt-2 h-4 w-72" /> {/* Description */}
        </div>
        <Skeleton className="h-10 w-32" /> {/* Button */}
      </div>

      <Card className="p-6">
        {/* Skeleton for Tabs and Search */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded-full" /> {/* Search Icon */}
            <Skeleton className="h-10 w-64" /> {/* Search Input */}
          </div>
        </div>

        {/* Skeleton for Table */}
        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead><Skeleton className="h-5 w-40" /></TableHead>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-5 w-28 ml-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell> {/* Status Badge */}
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell> {/* Participants */}
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell> {/* Submissions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
