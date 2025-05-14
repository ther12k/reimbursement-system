"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search, ExternalLink, QrCode, Copy, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { translateStatus } from "@/lib/utils"

// Mock data for events
const mockEvents = [
  {
    id: 1,
    name: "Annual Conference 2025",
    startDate: "2025-06-15",
    endDate: "2025-06-18",
    location: "New York, NY",
    status: "upcoming",
    participants: 120,
    submissions: 0,
  },
  {
    id: 2,
    name: "Team Building Retreat",
    startDate: "2025-07-10",
    endDate: "2025-07-12",
    location: "Denver, CO",
    status: "upcoming",
    participants: 45,
    submissions: 0,
  },
  {
    id: 3,
    name: "Sales Kickoff Meeting",
    startDate: "2025-05-01",
    endDate: "2025-05-03",
    location: "Chicago, IL",
    status: "active",
    participants: 78,
    submissions: 23,
  },
  {
    id: 4,
    name: "Product Launch Event",
    startDate: "2025-04-15",
    endDate: "2025-04-15",
    location: "San Francisco, CA",
    status: "active",
    participants: 150,
    submissions: 42,
  },
  {
    id: 5,
    name: "Marketing Workshop",
    startDate: "2025-03-10",
    endDate: "2025-03-12",
    location: "Austin, TX",
    status: "completed",
    participants: 35,
    submissions: 31,
  },
  {
    id: 6,
    name: "Customer Advisory Board",
    startDate: "2025-02-20",
    endDate: "2025-02-21",
    location: "Boston, MA",
    status: "completed",
    participants: 25,
    submissions: 22,
  },
]

export default function EventsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredEvents = mockEvents.filter(
    (event) =>
      (activeTab === "all" ||
        (activeTab === "active" && event.status === "active") ||
        (activeTab === "upcoming" && event.status === "upcoming") ||
        (activeTab === "completed" && event.status === "completed")) &&
      (event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleCopyLink = (eventId: number) => {
    const link = `https://reimburse.example.com/event/${eventId}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied",
      description: "Event link copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <Button asChild>
          <Link href="/admin/events/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-500" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Acara</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Peserta</TableHead>
                    <TableHead>Pengajuan</TableHead>
                    <TableHead className="text-right">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No events found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>
                          {event.startDate === event.endDate
                            ? event.startDate
                            : `${event.startDate} - ${event.endDate}`}
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              event.status === "active"
                                ? "default"
                                : event.status === "upcoming"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {translateStatus(event.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{event.participants}</TableCell>
                        <TableCell>{event.submissions}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/events/${event.id}`}>
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <QrCode className="h-4 w-4" />
                              <span className="sr-only">QR Code</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleCopyLink(event.id)}>
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Copy Link</span>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/events/${event.id}/report`}>
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">Report</span>
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="active" className="m-0">
            {/* Same table structure as "all" but filtered for active events */}
          </TabsContent>
          <TabsContent value="upcoming" className="m-0">
            {/* Same table structure as "all" but filtered for upcoming events */}
          </TabsContent>
          <TabsContent value="completed" className="m-0">
            {/* Same table structure as "all" but filtered for completed events */}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
