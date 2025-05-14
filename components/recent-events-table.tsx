"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { translateStatus } from "@/lib/utils"

// Mock data for recent events
const recentEvents = [
  {
    id: 1,
    name: "Annual Conference 2025",
    date: "Jun 15-18, 2025",
    participants: 120,
    submissions: 0,
    status: "upcoming",
  },
  {
    id: 2,
    name: "Team Building Retreat",
    date: "Jul 10-12, 2025",
    participants: 45,
    submissions: 0,
    status: "upcoming",
  },
  {
    id: 3,
    name: "Sales Kickoff Meeting",
    date: "May 1-3, 2025",
    participants: 78,
    submissions: 23,
    status: "active",
  },
  {
    id: 4,
    name: "Product Launch Event",
    date: "Apr 15, 2025",
    participants: 150,
    submissions: 42,
    status: "active",
  },
  {
    id: 5,
    name: "Marketing Workshop",
    date: "Mar 10-12, 2025",
    participants: 35,
    submissions: 31,
    status: "completed",
  },
]

export default function RecentEventsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama Acara</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Peserta</TableHead>
          <TableHead>Pengajuan</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentEvents.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">
              <Link href={`/admin/events/${event.id}`} className="hover:underline">
                {event.name}
              </Link>
            </TableCell>
            <TableCell>{event.date}</TableCell>
            <TableCell>{event.participants}</TableCell>
            <TableCell>{event.submissions}</TableCell>
            <TableCell>
              <Badge
                variant={event.status === "active" ? "default" : event.status === "upcoming" ? "outline" : "secondary"}
              >
                {translateStatus(event.status)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
