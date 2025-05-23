"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PlusCircle, Search, Edit, Trash2, ExternalLink, QrCode, Copy, Loader2, RefreshCw } from "lucide-react" // Added RefreshCw
import { useToast } from "@/hooks/use-toast"
import { useFirestore } from "@/lib/firebase/firestore"
import { EventForm } from "@/components/admin/event-form"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/utils"

interface Event {
  id: string
  name: string
  description: string
  startDate: Date | string
  endDate: Date | string
  location: string
  status: string
  allowAccommodation: boolean
  allowTransportation: boolean
  allowMeals: boolean
  allowOther: boolean
  budgetLimit?: number
  participants?: number
  submissions?: number
}

export default function EventsPage() {
  const { toast } = useToast()
  const { getDocuments, deleteDocument, loading: firestoreLoading } = useFirestore("events")
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isEditEventOpen, setIsEditEventOpen] = useState(false)
  const [isDeleteEventOpen, setIsDeleteEventOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const renderEventsContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }

    if (fetchError) {
      return (
        <EmptyState
          variant="error"
          title="Gagal Memuat Acara"
          description={fetchError}
          action={
            <Button onClick={fetchEvents}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Coba Lagi
            </Button>
          }
        />
      )
    }

    if (filteredEvents.length === 0) {
      let emptyTitle = "Tidak ada acara ditemukan"
      let emptyDesc = searchTerm
        ? `Tidak ada acara yang cocok dengan pencarian "${searchTerm}"`
        : "Belum ada acara dalam sistem."
      
      if (activeTab !== "all") {
        emptyTitle = `Tidak ada acara ${activeTab}`
        emptyDesc = searchTerm 
          ? `Tidak ada acara "${activeTab}" yang cocok dengan pencarian "${searchTerm}"`
          : `Belum ada acara dengan status "${activeTab}".`
      }

      return (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title={emptyTitle}
          description={emptyDesc}
          action={
            <Button asChild>
              <Link href="/admin/events/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Buat Acara
              </Link>
            </Button>
          }
        />
      )
    }

    return (
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
            {filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{formatDateRange(event.startDate, event.endDate)}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(event.status)}>
                    {event.status === "active"
                      ? "Aktif"
                      : event.status === "upcoming"
                        ? "Akan Datang"
                        : "Selesai"}
                  </Badge>
                </TableCell>
                <TableCell>{event.participants}</TableCell>
                <TableCell>{event.submissions}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/events/${event.id}`}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Lihat</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <QrCode className="h-4 w-4" />
                      <span className="sr-only">QR Code</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleCopyLink(event.id)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Salin Link</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Hapus</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents()
  }, [])

  // Filter events when search term or active tab changes
  useEffect(() => {
    let filtered = [...events]

    if (activeTab !== "all") {
      filtered = filtered.filter((event) => event.status === activeTab)
    }

    if (searchTerm.trim() !== "") {
      const lowercasedSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(lowercasedSearch) ||
          event.location.toLowerCase().includes(lowercasedSearch) ||
          (event.description && event.description.toLowerCase().includes(lowercasedSearch)),
      )
    }
    setFilteredEvents(filtered)
  }, [searchTerm, activeTab, events])

  const fetchEvents = async () => {
    setIsLoading(true)
    setFetchError(null) // Reset error state on new fetch
    try {
      const eventsData = await getDocuments()

      // Add mock data for participants and submissions
      const enhancedEvents = eventsData.map((event) => ({
        ...event,
        participants: Math.floor(Math.random() * 100) + 10,
        submissions: event.status === "upcoming" ? 0 : Math.floor(Math.random() * 50),
      }))

      setEvents(enhancedEvents as Event[])
      setFilteredEvents(enhancedEvents as Event[])
    } catch (error: any) {
      console.error("Error fetching events:", error)
      const errorMessage = error.message || "Terjadi kesalahan saat memuat data acara"
      setFetchError(errorMessage)
      toast({
        title: "Gagal memuat acara",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsEditEventOpen(true)
  }

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsDeleteEventOpen(true)
  }

  const confirmDeleteEvent = async () => {
    if (!selectedEvent) return

    setIsDeleting(true)
    try {
      await deleteDocument(selectedEvent.id)
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEvent.id))
      toast({
        title: "Acara dihapus",
        description: `${selectedEvent.name} telah berhasil dihapus`,
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Gagal menghapus acara",
        description: "Terjadi kesalahan saat menghapus acara",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteEventOpen(false)
      setSelectedEvent(null)
    }
  }

  const handleFormSuccess = () => {
    fetchEvents()
    setIsAddEventOpen(false)
    setIsEditEventOpen(false)
    setSelectedEvent(null)
  }

  const handleCopyLink = (eventId: string) => {
    const link = `https://reimburse.example.com/event/${eventId}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Link disalin",
      description: "Link acara telah disalin ke clipboard",
    })
  }

  const formatDateRange = (startDate: Date | string, endDate: Date | string) => {
    try {
      // Coba untuk membuat objek Date yang valid
      const startObj = typeof startDate === "string" ? new Date(startDate) : startDate
      const endObj = typeof endDate === "string" ? new Date(endDate) : endDate

      // Periksa apakah kedua tanggal valid
      const isStartValid = !isNaN(startObj.getTime())
      const isEndValid = !isNaN(endObj.getTime())

      // Jika kedua tanggal tidak valid, kembalikan tanda strip
      if (!isStartValid && !isEndValid) {
        return "-"
      }

      // Jika hanya satu tanggal yang valid
      if (!isStartValid) return formatDate(endObj)
      if (!isEndValid) return formatDate(startObj)

      // Jika kedua tanggal sama
      if (startObj.getTime() === endObj.getTime()) {
        return formatDate(startObj)
      }

      // Jika kedua tanggal berbeda
      return `${formatDate(startObj)} - ${formatDate(endObj)}`
    } catch (error) {
      console.error("Error formatting date range:", error)
      return "-"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "upcoming":
        return "outline"
      case "completed":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Acara"
        description="Kelola acara dalam sistem"
        actions={
          <Button asChild>
            <Link href="/admin/events/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat Acara
            </Link>
          </Button>
        }
      />

      <Card className="p-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <TabsList>
              <TabsTrigger value="all">Semua Acara</TabsTrigger>
              <TabsTrigger value="active">Aktif</TabsTrigger>
              <TabsTrigger value="upcoming">Akan Datang</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Cari acara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>

          {/* Define a function or component to render content */}
          {(() => {
            if (isLoading) {
              return (
                <div className="flex h-96 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )
            }

            if (fetchError) {
              return (
                <EmptyState
                  variant="error"
                  title="Gagal Memuat Acara"
                  description={fetchError}
                  action={
                    <Button onClick={fetchEvents}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Coba Lagi
                    </Button>
                  }
                />
              )
            }

            if (filteredEvents.length === 0) {
              let emptyTitle = "Tidak ada acara ditemukan"
              let emptyDesc = searchTerm
                ? `Tidak ada acara yang cocok dengan pencarian "${searchTerm}"`
                : "Belum ada acara dalam sistem."
              
              if (activeTab !== "all") {
                emptyDesc = searchTerm 
                  ? `Tidak ada acara "${activeTab}" yang cocok dengan pencarian "${searchTerm}"`
                  : `Belum ada acara dengan status "${activeTab}".`
              }

              return (
                <EmptyState
                  icon={<Search className="h-12 w-12" />}
                  title={emptyTitle}
                  description={emptyDesc}
                  action={
                    <Button asChild>
                      <Link href="/admin/events/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Buat Acara
                      </Link>
                    </Button>
                  }
                />
              )
            }

            return (
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
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{formatDateRange(event.startDate, event.endDate)}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(event.status)}>
                            {event.status === "active"
                              ? "Aktif"
                              : event.status === "upcoming"
                                ? "Akan Datang"
                                : "Selesai"}
                          </Badge>
                        </TableCell>
                        <TableCell>{event.participants}</TableCell>
                        <TableCell>{event.submissions}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/events/${event.id}`}>
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Lihat</span>
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <QrCode className="h-4 w-4" />
                              <span className="sr-only">QR Code</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleCopyLink(event.id)}>
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Salin Link</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Hapus</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Other tabs have the same content structure but filtered by status */}
          <TabsContent value="active" className="m-0 mt-6">
            {/* TODO: The other TabsContent sections also need to handle fetchError and empty states if their content is fetched separately or differently. 
                       For now, they will show blank if the main fetchEvents fails.
                       If they rely on the same `filteredEvents` from the main `fetchEvents`, then the error/empty state in the "all" tab
                       will effectively cover them when it's the active one.
                       If each tab were to load its own data, each would need this pattern.
            */}
            {/* Same structure as "all" tab, but should also check fetchError and filteredEvents.length */}
          </TabsContent>
          <TabsContent value="active" className="m-0 mt-6">
            {/* Placeholder: Implement loading, error, and empty state similarly if this tab loads data independently */}
            {isLoading ? <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : fetchError ? <EmptyState variant="error" title="Gagal Memuat Acara Aktif" description={fetchError} action={<Button onClick={fetchEvents}>Coba Lagi</Button>} /> : !events.filter(e => e.status === 'active').length ? <EmptyState title="Tidak ada acara aktif" /> : ( <div className="text-muted-foreground">Data Acara Aktif...</div>) }

          </TabsContent>
          <TabsContent value="upcoming" className="m-0 mt-6">
            {isLoading ? <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : fetchError ? <EmptyState variant="error" title="Gagal Memuat Acara Akan Datang" description={fetchError} action={<Button onClick={fetchEvents}>Coba Lagi</Button>} /> : !events.filter(e => e.status === 'upcoming').length ? <EmptyState title="Tidak ada acara akan datang" /> : ( <div className="text-muted-foreground">Data Acara Akan Datang...</div>) }
          </TabsContent>
          <TabsContent value="completed" className="m-0 mt-6">
            {isLoading ? <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : fetchError ? <EmptyState variant="error" title="Gagal Memuat Acara Selesai" description={fetchError} action={<Button onClick={fetchEvents}>Coba Lagi</Button>} /> : !events.filter(e => e.status === 'completed').length ? <EmptyState title="Tidak ada acara selesai" /> : ( <div className="text-muted-foreground">Data Acara Selesai...</div>) }
          </TabsContent>
        </Tabs>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Acara</DialogTitle>
            <DialogDescription>Perbarui informasi acara.</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <EventForm event={selectedEvent} onSuccess={handleFormSuccess} onCancel={() => setIsEditEventOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Event Confirmation */}
      {selectedEvent && (
        <DeleteConfirmation
          isOpen={isDeleteEventOpen}
          onClose={() => setIsDeleteEventOpen(false)}
          onConfirm={confirmDeleteEvent}
          title="Hapus Acara"
          description={`Apakah Anda yakin ingin menghapus ${selectedEvent.name}? Tindakan ini tidak dapat dibatalkan.`}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
