"use client"

import { useState, useEffect, type ReactNode } from "react"
import { FirebaseContext } from "./firebase-context"

interface FirebaseProviderProps {
  children: ReactNode
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [app, setApp] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize Firebase
  useEffect(() => {
    async function initializeFirebase() {
      try {
        // Dynamic imports to avoid SSR issues
        const { initializeApp, getApps } = await import("firebase/app")
        const {
          getAuth,
          onAuthStateChanged,
          signInWithEmailAndPassword,
          createUserWithEmailAndPassword,
          updateProfile,
        } = await import("firebase/auth")
        const { getFirestore, doc, setDoc, getDoc } = await import("firebase/firestore")
        const { getStorage } = await import("firebase/storage")

        const firebaseConfig = {
          apiKey: "AIzaSyDgel2DVA_eMRQN5ph4I0NtV93IeGI6VSc",
          authDomain: "reimbyte.firebaseapp.com",
          projectId: "reimbyte",
          storageBucket: "reimbyte.firebasestorage.app",
          messagingSenderId: "871508955360",
          appId: "1:871508955360:web:8ff4e058f290bfcce70085",
        }

        let firebaseApp: any

        if (!getApps().length) {
          firebaseApp = initializeApp(firebaseConfig)
        } else {
          firebaseApp = getApps()[0]
        }

        setApp(firebaseApp)

        const auth = getAuth(firebaseApp)
        const db = getFirestore(firebaseApp)
        const storage = getStorage(firebaseApp)

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

        // Store Firebase services for later use
        ;(window as any).__firebaseServices = {
          app: firebaseApp,
          auth,
          db,
          storage,
          signInWithEmailAndPassword,
          createUserWithEmailAndPassword,
          updateProfile,
          doc,
          setDoc,
          getDoc,
        }

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
      const services = (window as any).__firebaseServices
      if (!services) throw new Error("Firebase services not available")

      const result = await services.signInWithEmailAndPassword(services.auth, email, password)

      // Get user role
      if (result.user) {
        const userDoc = await services.getDoc(services.doc(services.db, "users", result.user.uid))
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
      const services = (window as any).__firebaseServices
      if (!services) throw new Error("Firebase services not available")

      // Create user in Firebase Auth
      const userCredential = await services.createUserWithEmailAndPassword(services.auth, email, password)
      const user = userCredential.user

      // Update profile with display name
      await services.updateProfile(user, { displayName })

      // Store additional user data in Firestore
      await services.setDoc(services.doc(services.db, "users", user.uid), {
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
      const services = (window as any).__firebaseServices
      if (services && services.auth) {
        await services.auth.signOut()
      }
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
    const services = (window as any).__firebaseServices
    return services ? services.db : null
  }

  const getStorageService = () => {
    const services = (window as any).__firebaseServices
    return services ? services.storage : null
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
