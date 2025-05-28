"use client"

import { useState, useCallback } from "react"
import { useFirebase } from "./use-firebase"
import {
  uploadFile as upload,
  deleteFile as remove,
  getDownloadURL as getURL,
  fileToBase64 as toBase64,
} from "../services/storage-service"

export function useStorage() {
  const { storage } = useFirebase()
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const uploadFile = useCallback(
    async (file: File, path: string): Promise<string | null> => {
      if (!storage || !file) return null

      setLoading(true)
      setProgress(0)
      setError(null)

      try {
        const downloadURL = await upload(storage, file, path, (progress) => {
          setProgress(progress)
        })

        setUrl(downloadURL)
        setLoading(false)
        return downloadURL
      } catch (err: any) {
        setError(err)
        setLoading(false)
        return null
      }
    },
    [storage],
  )

  const deleteFile = useCallback(
    async (path: string): Promise<boolean> => {
      if (!storage) return false

      setLoading(true)
      setError(null)

      try {
        await remove(storage, path)
        setLoading(false)
        return true
      } catch (err: any) {
        setError(err)
        setLoading(false)
        return false
      }
    },
    [storage],
  )

  const getDownloadURL = useCallback(
    async (path: string): Promise<string | null> => {
      if (!storage) return null

      try {
        return await getURL(storage, path)
      } catch (err: any) {
        console.error("Error getting download URL:", err)
        return null
      }
    },
    [storage],
  )

  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return toBase64(file)
  }, [])

  return {
    progress,
    error,
    url,
    loading,
    uploadFile,
    deleteFile,
    getDownloadURL,
    fileToBase64,
  }
}
