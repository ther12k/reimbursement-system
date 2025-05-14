"use client"

import { useEffect, useRef } from "react"

export default function ReimbursementStats() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Data for the pie chart
    const data = [
      { label: "Disetujui", value: 65, color: "#10b981" },
      { label: "Menunggu", value: 25, color: "#f59e0b" },
      { label: "Ditolak", value: 10, color: "#ef4444" },
    ]

    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw the pie chart
    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2
    const radius = Math.min(centerX, centerY) - 40

    let startAngle = 0

    data.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.value) / total

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = item.color
      ctx.fill()

      // Draw the label
      const labelAngle = startAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${item.value}%`, labelX, labelY)

      startAngle += sliceAngle
    })

    // Draw the legend
    const legendY = canvasRef.current.height - 30
    let legendX = 20

    data.forEach((item) => {
      // Draw the color box
      ctx.fillStyle = item.color
      ctx.fillRect(legendX, legendY, 15, 15)

      // Draw the label
      ctx.fillStyle = "#000000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(item.label, legendX + 20, legendY + 7)

      legendX += 100
    })
  }, [])

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={300} height={200} />
    </div>
  )
}
