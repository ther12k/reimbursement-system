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
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
  storage: null,
  user: null,
  loading: true,
})

export const useFirebase = () => useContext(FirebaseContext)

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null)
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(null)
  const [firebaseDb, setFirebaseDb] = useState<Firestore | null>(null)
  const [firebaseStorage, setFirebaseStorage] = useState<FirebaseStorage | null>(null)
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let app: FirebaseApp

    try {
      // Check if Firebase is already initialized
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

      // Listen for auth state changes
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user)
        setLoading(false)
      })

      // Clean up listener
      return () => unsubscribe()
    } catch (error) {
      console.error("Error initializing Firebase:", error)
      setLoading(false)
    }
  }, [])

  return (
    <FirebaseContext.Provider
      value={{
        app: firebaseApp,
        auth: firebaseAuth,
        db: firebaseDb,
        storage: firebaseStorage,
        user,
        loading,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}
