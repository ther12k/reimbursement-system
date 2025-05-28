import type { FirebaseStorage } from "firebase/storage"
import { ref, uploadBytesResumable, getDownloadURL as getStorageDownloadURL, deleteObject } from "firebase/storage"

// Upload file to Firebase Storage
export async function uploadFile(
  storage: FirebaseStorage,
  file: File,
  path: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const storageRef = ref(storage, path)
  const uploadTask = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) {
          onProgress(progress)
        }
      },
      (error) => {
        reject(error)
      },
      async () => {
        const downloadURL = await getStorageDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      },
    )
  })
}

// Delete file from Firebase Storage
export async function deleteFile(storage: FirebaseStorage, path: string): Promise<void> {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

// Get download URL for a file
export async function getDownloadURL(storage: FirebaseStorage, path: string): Promise<string> {
  const storageRef = ref(storage, path)
  return await getStorageDownloadURL(storageRef)
}

// Convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}
