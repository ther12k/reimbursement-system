"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Clock } from "lucide-react"

export function RealtimeStatusIndicator() {
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      // Randomly simulate connection issues (5% chance)
      setIsConnected(Math.random() > 0.05)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Badge variant={isConnected ? "success" : "destructive"} className="flex items-center gap-1">
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isConnected ? "Real-time Connected" : "Connection Lost"}
      </Badge>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Last update: {formatTime(lastUpdate)}</span>
      </div>
    </div>
  )
}
