"use client"

import { useContext } from "react"
import { FirebaseContext } from "../context/firebase-context"
// import type { User } from "firebase/auth" // Replaced by AppUser
import type { AppUser } from "../types" // Import AppUser
import type { Firestore } from "firebase/firestore"
import type { FirebaseStorage } from "firebase/storage"

interface UseFirebaseReturn {
  app: any // Consider using a more specific type if available, e.g., FirebaseApp | null
  user: AppUser | null // Changed from User | null
  // userRole: string | null // Removed, role is now in user.role
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, displayName: string, role?: string) => Promise<any>
  signOut: () => Promise<void>
  getDb: () => Firestore | null
  getStorage: () => FirebaseStorage | null
}

export function useFirebase(): UseFirebaseReturn {
  const context = useContext(FirebaseContext)

  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }

  return context
}
