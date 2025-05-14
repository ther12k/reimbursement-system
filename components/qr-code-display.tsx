"use client"

import { useEffect, useRef } from "react"

interface QRCodeDisplayProps {
  value: string
  size?: number
}

export default function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  const qrContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const generateQRCode = async () => {
      if (!qrContainerRef.current) return

      // In a real app, you would use a QR code library like qrcode.react
      // For this demo, we'll just show a placeholder

      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear the container
      while (qrContainerRef.current.firstChild) {
        qrContainerRef.current.removeChild(qrContainerRef.current.firstChild)
      }

      // Draw a placeholder QR code
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, size, size)

      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, size, 10)
      ctx.fillRect(0, 0, 10, size)
      ctx.fillRect(size - 10, 0, 10, size)
      ctx.fillRect(0, size - 10, size, 10)

      // Draw the three position detection patterns
      const drawPositionDetectionPattern = (x: number, y: number) => {
        ctx.fillRect(x, y, 30, 30)
        ctx.fillStyle = "white"
        ctx.fillRect(x + 5, y + 5, 20, 20)
        ctx.fillStyle = "black"
        ctx.fillRect(x + 10, y + 10, 10, 10)
      }

      drawPositionDetectionPattern(10, 10)
      drawPositionDetectionPattern(size - 40, 10)
      drawPositionDetectionPattern(10, size - 40)

      // Draw some random modules to make it look like a QR code
      for (let i = 0; i < 100; i++) {
        const x = Math.floor(Math.random() * (size - 20)) + 10
        const y = Math.floor(Math.random() * (size - 20)) + 10
        const w = Math.floor(Math.random() * 10) + 5
        const h = Math.floor(Math.random() * 10) + 5
        ctx.fillRect(x, y, w, h)
      }

      qrContainerRef.current.appendChild(canvas)
    }

    generateQRCode()
  }, [value, size])

  return (
    <div className="flex flex-col items-center">
      <div ref={qrContainerRef} className="border border-gray-200 p-2 rounded-md"></div>
      <p className="mt-2 text-sm text-gray-500">Scan to access event</p>
    </div>
  )
}
