"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import QRCodeDisplay from "@/components/qr-code-display"
import { EventForm } from "@/components/admin/event-form"
import { PageHeader } from "@/components/shared/page-header"

export default function CreateEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showQRCode, setShowQRCode] = useState(false)
  const [eventLink, setEventLink] = useState("")

  const handleFormSuccess = () => {
    // Generate a random event ID for demo purposes
    const eventId = Math.floor(Math.random() * 1000000)
    const generatedLink = `https://reimburse.example.com/event/${eventId}`
    setEventLink(generatedLink)
    setShowQRCode(true)
  }

  const handleFinish = () => {
    router.push("/admin/events")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Buat Acara Baru" description="Buat acara baru untuk pengguna mengajukan reimbursement" />

      {!showQRCode ? (
        <Card>
          <CardHeader>
            <CardTitle>Detail Acara</CardTitle>
            <CardDescription>Buat acara baru untuk pengguna mengajukan reimbursement</CardDescription>
          </CardHeader>
          <CardContent>
            <EventForm onSuccess={handleFormSuccess} onCancel={() => router.back()} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Acara Berhasil Dibuat</CardTitle>
            <CardDescription>Bagikan QR code atau link ini dengan peserta</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <QRCodeDisplay value={eventLink} />

            <div className="w-full">
              <Label htmlFor="eventLink">Link Acara</Label>
              <div className="flex mt-1.5">
                <Input id="eventLink" value={eventLink} readOnly className="flex-1" />
                <Button
                  className="ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(eventLink)
                    toast({
                      title: "Link disalin",
                      description: "Link acara disalin ke clipboard",
                    })
                  }}
                >
                  Salin
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowQRCode(false)}>
              Edit Acara
            </Button>
            <Button onClick={handleFinish}>Selesai</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
