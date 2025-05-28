"use client"

import { useContext } from "react"
import { FirebaseContext } from "../context/firebase-context"
import type { User } from "firebase/auth"
import type { Firestore } from "firebase/firestore"
import type { FirebaseStorage } from "firebase/storage"

interface UseFirebaseReturn {
  app: any
  user: User | null
  userRole: string | null
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
