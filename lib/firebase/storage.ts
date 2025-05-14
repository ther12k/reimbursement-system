"use client"

import { useState, useCallback } from "react"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { useFirebase } from "./firebase-provider"

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
        const storageRef = ref(storage, path)
        const uploadTask = uploadBytesResumable(storageRef, file)

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              setProgress(progress)
            },
            (error) => {
              setError(error)
              setLoading(false)
              reject(error)
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              setUrl(downloadURL)
              setLoading(false)
              resolve(downloadURL)
            },
          )
        })
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
        const storageRef = ref(storage, path)
        await deleteObject(storageRef)
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

  // Convert file to base64 for small files
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }, [])

  return {
    progress,
    error,
    url,
    loading,
    uploadFile,
    deleteFile,
    fileToBase64,
  }
}
