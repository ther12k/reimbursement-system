"use client"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { useFirebase } from "./firebase-provider"
import { useState, useCallback } from "react"

export interface AuthError {
  code: string
  message: string
}

export function useAuth() {
  const { auth, db, user } = useFirebase()
  const [error, setError] = useState<AuthError | null>(null)
  const [loading, setLoading] = useState(false)

  const signUp = useCallback(
    async (email: string, password: string, displayName: string, role = "user"): Promise<UserCredential | null> => {
      if (!auth || !db) return null

      setLoading(true)
      setError(null)

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        // Update profile with display name
        await updateProfile(userCredential.user, { displayName })

        // Create user document in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          displayName,
          role,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })

        return userCredential
      } catch (err: any) {
        setError({
          code: err.code || "unknown",
          message: err.message || "An unknown error occurred",
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [auth, db],
  )

  const signIn = useCallback(
    async (email: string, password: string): Promise<UserCredential | null> => {
      if (!auth) return null

      setLoading(true)
      setError(null)

      try {
        return await signInWithEmailAndPassword(auth, email, password)
      } catch (err: any) {
        setError({
          code: err.code || "unknown",
          message: err.message || "An unknown error occurred",
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [auth],
  )

  const signOut = useCallback(async (): Promise<void> => {
    if (!auth) return

    setLoading(true)
    setError(null)

    try {
      await firebaseSignOut(auth)
    } catch (err: any) {
      setError({
        code: err.code || "unknown",
        message: err.message || "An unknown error occurred",
      })
    } finally {
      setLoading(false)
    }
  }, [auth])

  const getUserRole = useCallback(async (): Promise<string | null> => {
    if (!db || !user) return null

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        return userDoc.data().role || null
      }
      return null
    } catch (err) {
      console.error("Error getting user role:", err)
      return null
    }
  }, [db, user])

  return {
    user,
    signUp,
    signIn,
    signOut,
    getUserRole,
    error,
    loading,
  }
}
