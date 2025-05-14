"use client"

import { useState, useEffect } from "react"
import { File } from "lucide-react"

interface DocumentViewerProps {
  documentUrl: string
}

export default function DocumentViewer({ documentUrl }: DocumentViewerProps) {
  const [isImage, setIsImage] = useState(true)

  useEffect(() => {
    // Check if the URL is for an image or PDF
    // In a real app, you would check the file extension or MIME type
    setIsImage(!documentUrl.endsWith(".pdf"))
  }, [documentUrl])

  return (
    <div className="w-full flex items-center justify-center">
      {isImage ? (
        <img
          src={documentUrl || "/placeholder.svg"}
          alt="Document preview"
          className="max-w-full max-h-[70vh] object-contain"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <File className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg font-medium">Dokumen PDF</p>
          <p className="text-sm text-gray-500 mb-4">Pratinjau PDF tidak tersedia</p>
          <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Buka PDF di tab baru
          </a>
        </div>
      )}
    </div>
  )
}
