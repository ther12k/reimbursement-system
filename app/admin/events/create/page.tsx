"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import QRCodeDisplay from "@/components/qr-code-display"

export default function CreateEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showQRCode, setShowQRCode] = useState(false)
  const [eventLink, setEventLink] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
    location: "",
    allowAccommodation: true,
    allowTransportation: true,
    allowMeals: true,
    allowOther: false,
    budgetLimit: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        [name]: date,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would send this data to your backend
    // For demo purposes, we'll simulate a successful event creation

    const eventId = Math.floor(Math.random() * 1000000)
    const generatedLink = `https://reimburse.example.com/event/${eventId}`
    setEventLink(generatedLink)
    setShowQRCode(true)

    toast({
      title: "Event created",
      description: "Your event has been created successfully.",
    })
  }

  const handleFinish = () => {
    router.push("/admin/events")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Event</h1>

      {!showQRCode ? (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Create a new event for users to submit reimbursement requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Annual Conference 2025"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide details about the event"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <DatePicker date={formData.startDate} setDate={(date) => handleDateChange("startDate", date)} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <DatePicker date={formData.endDate} setDate={(date) => handleDateChange("endDate", date)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country or Virtual"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetLimit">Batas Anggaran (opsional)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">Rp</span>
                  </div>
                  <Input
                    id="budgetLimit"
                    name="budgetLimit"
                    value={formData.budgetLimit}
                    onChange={handleInputChange}
                    placeholder="1000000"
                    type="text"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Allowed Expense Types</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowAccommodation">Accommodation</Label>
                    <p className="text-sm text-muted-foreground">Hotel, Airbnb, etc.</p>
                  </div>
                  <Switch
                    id="allowAccommodation"
                    checked={formData.allowAccommodation}
                    onCheckedChange={(checked) => handleSwitchChange("allowAccommodation", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowTransportation">Transportation</Label>
                    <p className="text-sm text-muted-foreground">Flights, trains, taxis, etc.</p>
                  </div>
                  <Switch
                    id="allowTransportation"
                    checked={formData.allowTransportation}
                    onCheckedChange={(checked) => handleSwitchChange("allowTransportation", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowMeals">Meals</Label>
                    <p className="text-sm text-muted-foreground">Breakfast, lunch, dinner, etc.</p>
                  </div>
                  <Switch
                    id="allowMeals"
                    checked={formData.allowMeals}
                    onCheckedChange={(checked) => handleSwitchChange("allowMeals", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowOther">Other Expenses</Label>
                    <p className="text-sm text-muted-foreground">Miscellaneous expenses</p>
                  </div>
                  <Switch
                    id="allowOther"
                    checked={formData.allowOther}
                    onCheckedChange={(checked) => handleSwitchChange("allowOther", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </CardFooter>
          </Card>
        </form>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Event Created Successfully</CardTitle>
            <CardDescription>Share this QR code or link with participants</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <QRCodeDisplay value={eventLink} />

            <div className="w-full">
              <Label htmlFor="eventLink">Event Link</Label>
              <div className="flex mt-1.5">
                <Input id="eventLink" value={eventLink} readOnly className="flex-1" />
                <Button
                  className="ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(eventLink)
                    toast({
                      title: "Link copied",
                      description: "Event link copied to clipboard",
                    })
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowQRCode(false)}>
              Edit Event
            </Button>
            <Button onClick={handleFinish}>Finish</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
