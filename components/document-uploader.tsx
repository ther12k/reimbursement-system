"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Camera, File, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DocumentUploaderProps {
  onFileSelected: (file: File | null) => void
  initialFile?: File | null
}

export default function DocumentUploader({ onFileSelected, initialFile = null }: DocumentUploaderProps) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(initialFile)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    if (selectedFile) {
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Silakan pilih file yang lebih kecil dari 5MB",
          variant: "destructive",
        })
        return
      }

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/heic", "application/pdf"]
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Tipe file tidak valid",
          description: "Silakan unggah file JPG, PNG, HEIC, atau PDF",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      onFileSelected(selectedFile)

      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        // For PDFs, just show an icon
        setPreview(null)
      }
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
    onFileSelected(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*"
      fileInputRef.current.capture = "environment"
      fileInputRef.current.click()
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/heic,application/pdf"
      />

      {!file ? (
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleUploadClick}>
              <Upload className="mr-2 h-4 w-4" />
              Unggah Bukti
            </Button>
            <Button type="button" variant="outline" onClick={handleCameraClick}>
              <Camera className="h-4 w-4" />
              <span className="sr-only">Ambil Foto</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Format yang didukung: JPG, PNG, HEIC, PDF (maks 5MB)</p>
        </div>
      ) : (
        <div className="border rounded-md p-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {preview ? (
              <img src={preview || "/placeholder.svg"} alt="Preview bukti" className="h-12 w-12 object-cover rounded" />
            ) : (
              <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                <File className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile}>
            <X className="h-4 w-4" />
            <span className="sr-only">Hapus</span>
          </Button>
        </div>
      )}
    </div>
  )
}
