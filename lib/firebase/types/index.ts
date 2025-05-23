import type { FirebaseApp } from "firebase/app"
import type { Auth, User as FirebaseUser, UserCredential } from "firebase/auth"
import type { Firestore, DocumentData, QueryConstraint } from "firebase/firestore"
import type { FirebaseStorage } from "firebase/storage"

// Firebase Context Types
export interface FirebaseContextType {
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
  storage: FirebaseStorage | null
  user: FirebaseUser | null
  loading: boolean
  error: Error | null
}

// Auth Types
export interface AuthError {
  code: string
  message: string
}

export interface AuthHookReturn {
  user: FirebaseUser | null
  signUp: (email: string, password: string, displayName: string, role?: string) => Promise<UserCredential | null>
  signIn: (email: string, password: string) => Promise<UserCredential | null>
  signOut: () => Promise<void>
  getUserRole: () => Promise<string | null>
  error: AuthError | null
  loading: boolean
}

// Firestore Types
export interface FirestoreHookReturn {
  getDocument: (id: string) => Promise<DocumentData | null>
  getDocuments: (constraints?: QueryConstraint[]) => Promise<DocumentData[]>
  addDocument: (data: DocumentData) => Promise<string | null>
  setDocument: (id: string, data: DocumentData, merge?: boolean) => Promise<boolean>
  updateDocument: (id: string, data: DocumentData) => Promise<boolean>
  deleteDocument: (id: string) => Promise<boolean>
  loading: boolean
  error: Error | null
}

// Storage Types
export interface StorageHookReturn {
  progress: number
  error: Error | null
  url: string | null
  loading: boolean
  uploadFile: (file: File, path: string) => Promise<string | null>
  deleteFile: (path: string) => Promise<boolean>
  getDownloadURL: (path: string) => Promise<string | null>
  fileToBase64: (file: File) => Promise<string>
}
