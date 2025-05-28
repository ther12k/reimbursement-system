"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"
import { firebaseConfig } from "./firebase-config"

interface FirebaseContextType {
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
  storage: FirebaseStorage | null
  user: FirebaseUser | null
  loading: boolean
  error: Error | null
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
  storage: null,
  user: null,
  loading: true,
  error: null,
})

export const useFirebase = () => useContext(FirebaseContext)

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null)
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(null)
  const [firebaseDb, setFirebaseDb] = useState<Firestore | null>(null)
  const [firebaseStorage, setFirebaseStorage] = useState<FirebaseStorage | null>(null)
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Check if Firebase is already initialized
        let app: FirebaseApp

        if (getApps().length === 0) {
          // Initialize Firebase
          app = initializeApp(firebaseConfig)
        } else {
          // Use existing Firebase app
          app = getApp()
        }

        // Get Firebase services
        const auth = getAuth(app)
        const db = getFirestore(app)
        const storage = getStorage(app)

        // Set state
        setFirebaseApp(app)
        setFirebaseAuth(auth)
        setFirebaseDb(db)
        setFirebaseStorage(storage)
        setError(null)

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            setUser(user)
            setLoading(false)
          },
          (error) => {
            console.error("Auth state change error:", error)
            setError(error)
            setLoading(false)
          },
        )

        // Clean up listener
        return () => unsubscribe()
      } catch (error) {
        console.error("Error initializing Firebase:", error)
        setError(error instanceof Error ? error : new Error("Unknown error initializing Firebase"))
        setLoading(false)

        // Retry initialization if under max retries
        if (retryCount < maxRetries) {
          console.log("Retrying Firebase initialization (" + (retryCount + 1) + "/" + maxRetries + ")...")
          setTimeout(() => {
            setRetryCount((prev) => prev + 1)
          }, 2000) // Retry after 2 seconds
        }
      }
    }

    initializeFirebase()
  }, [retryCount])

  // Provide a fallback UI when there's an error
  if (error && !loading && retryCount >= maxRetries) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Connection Error</h2>
        <p className="mb-6 max-w-md text-gray-600">
          We're having trouble connecting to our services. This could be due to network issues or the service might be
          temporarily unavailable.
        </p>
        <button
          onClick={() => {
            setLoading(true)
            setError(null)
            setRetryCount(0)
          }}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <FirebaseContext.Provider
      value={{
        app: firebaseApp,
        auth: firebaseAuth,
        db: firebaseDb,
        storage: firebaseStorage,
        user,
        loading,
        error,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}
