import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Skeleton for PageHeader */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Skeleton className="h-8 w-52" /> {/* Title */}
          <Skeleton className="mt-2 h-4 w-64" /> {/* Description */}
        </div>
        <Skeleton className="h-10 w-40" /> {/* Button */}
      </div>

      {/* Skeleton for Search Input */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded-full" /> {/* Search Icon */}
        <Skeleton className="h-10 w-full max-w-sm" /> {/* Search Input */}
      </div>

      {/* Skeleton for Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-5 w-32" /></TableHead>
              <TableHead><Skeleton className="h-5 w-48" /></TableHead>
              <TableHead><Skeleton className="h-5 w-24" /></TableHead>
              <TableHead><Skeleton className="h-5 w-32" /></TableHead>
              <TableHead><Skeleton className="h-5 w-20" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-5 w-28 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell> {/* Role Badge */}
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell> {/* Status Badge */}
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
