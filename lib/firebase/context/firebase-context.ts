import { createContext } from "react"
import type { User } from "firebase/auth"
import type { Firestore } from "firebase/firestore"
import type { FirebaseStorage } from "firebase/storage"

interface FirebaseContextType {
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

export const FirebaseContext = createContext<FirebaseContextType | null>(null)
