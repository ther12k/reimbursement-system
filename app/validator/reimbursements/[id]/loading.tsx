import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Skeleton for PageHeader */}
      <div className="mb-6">
        <Skeleton className="h-8 w-64" /> {/* Title: "Detail Reimbursement" */}
        <Skeleton className="mt-2 h-4 w-40" /> {/* Description: "ID: RB-..." */}
      </div>

      {/* Skeleton for Export Button */}
      <div className="flex justify-end mb-4">
        <Skeleton className="h-10 w-36" /> {/* Button: "Ekspor Laporan" */}
      </div>

      {/* Skeleton for Summary Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-24" /> {/* CardTitle */}
            </CardHeader>
            <CardContent className="space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeleton for Detail Pengeluaran Card */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-7 w-48" /> {/* CardTitle: "Detail Pengeluaran" */}
          <Skeleton className="mt-1 h-4 w-72" /> {/* CardDescription */}
        </CardHeader>
        <CardContent>
          {/* Skeleton for TabsList */}
          <div className="flex space-x-2 mb-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-28" />
          </div>

          {/* Skeleton for Expense Items (showing 2 items) */}
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-32" /> {/* Expense Type Title */}
                    <Skeleton className="h-5 w-20" /> {/* Status Badge */}
                  </div>
                  <Skeleton className="mt-1 h-4 w-full" /> {/* Description */}
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-28" /> {/* Amount */}
                    <div className="flex space-x-2">
                      <Skeleton className="h-9 w-24" /> {/* Button */}
                      <Skeleton className="h-9 w-24" /> {/* Button */}
                      <Skeleton className="h-9 w-24" /> {/* Button */}
                    </div>
                  </div>
                  {/* Skeleton for Note (optional) */}
                  {/* <div className="mt-3 p-3 bg-muted rounded-md">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-full" />
                  </div> */}
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" /> {/* Show/Hide details button */}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skeleton for Catatan Validator Card */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-7 w-44" /> {/* CardTitle: "Catatan Validator" */}
          <Skeleton className="mt-1 h-4 w-64" /> {/* CardDescription */}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" /> {/* Textarea */}
        </CardContent>
      </Card>

      {/* Skeleton for Action Buttons */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" /> {/* Kembali Button */}
        <div className="space-x-2">
          <Skeleton className="h-10 w-24" /> {/* Tolak Button */}
          <Skeleton className="h-10 w-40" /> {/* Minta Klarifikasi Button */}
          <Skeleton className="h-10 w-28" /> {/* Setujui Button */}
        </div>
      </div>
    </div>
  )
}
