"use client"

import { useState, useEffect, type ReactNode } from "react"
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type User,
} from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { FirebaseContext } from "./firebase-context"
import { firebaseConfig } from "../config/firebase-config"

interface FirebaseProviderProps {
  children: ReactNode
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [app, setApp] = useState<FirebaseApp | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize Firebase
  useEffect(() => {
    async function initializeFirebase() {
      try {
        let firebaseApp: FirebaseApp

        if (!getApps().length) {
          firebaseApp = initializeApp(firebaseConfig)
        } else {
          firebaseApp = getApps()[0]
        }

        setApp(firebaseApp)

        const auth = getAuth(firebaseApp)
        const db = getFirestore(firebaseApp)

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
          setLoading(true)

          if (authUser) {
            setUser(authUser)

            try {
              // Get user role from Firestore
              const userDoc = await getDoc(doc(db, "users", authUser.uid))
              if (userDoc.exists()) {
                setUserRole(userDoc.data().role || "user")
              } else {
                // Default role if no document exists
                setUserRole("user")
              }
            } catch (err) {
              console.error("Error getting user role:", err)
              setUserRole("user") // Default to user role on error
            }
          } else {
            setUser(null)
            setUserRole(null)
          }

          setLoading(false)
        })

        setError(null)
        console.log("Firebase initialized successfully")

        // Cleanup subscription
        return () => unsubscribe()
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to initialize Firebase")
        console.error("Firebase initialization error:", error)
        setError(error)
        setLoading(false)
      }
    }

    initializeFirebase()
  }, [])

  // Authentication methods
  const signIn = async (email: string, password: string) => {
    if (!app) throw new Error("Firebase not initialized")

    setLoading(true)
    try {
      const auth = getAuth(app)
      const result = await signInWithEmailAndPassword(auth, email, password)

      // Get user role
      if (result.user) {
        const db = getFirestore(app)
        const userDoc = await getDoc(doc(db, "users", result.user.uid))
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role || "user")
        } else {
          setUserRole("user")
        }
      }

      return result
    } catch (err) {
      console.error("Sign in error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, displayName: string, role = "user") => {
    if (!app) throw new Error("Firebase not initialized")

    setLoading(true)
    try {
      const auth = getAuth(app)
      const db = getFirestore(app)

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile with display name
      await updateProfile(user, { displayName })

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        displayName,
        role,
        createdAt: new Date().toISOString(),
      })

      setUserRole(role)
      return userCredential
    } catch (err) {
      console.error("Sign up error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    if (!app) return

    setLoading(true)
    try {
      const auth = getAuth(app)
      await auth.signOut()
      setUserRole(null)
    } catch (err) {
      console.error("Sign out error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get Firebase services
  const getDb = () => {
    if (!app) return null
    return getFirestore(app)
  }

  const getStorageService = () => {
    if (!app) return null
    return getStorage(app)
  }

  // If there's an error initializing Firebase, show a fallback UI
  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Connection Error</h2>
        <p className="mb-6 max-w-md text-gray-600">
          We're having trouble connecting to Firebase. Error: {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  const value = {
    app,
    user,
    userRole,
    loading,
    error,
    signIn,
    signUp,
    signOut: logout,
    getDb,
    getStorage: getStorageService,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}
