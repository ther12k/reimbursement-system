"use client"

import { useState, useCallback } from "react"
import type { UserCredential } from "firebase/auth"
import { useFirebase } from "./use-firebase"
import {
  signInWithEmail,
  signUpWithEmail,
  signOut as firebaseSignOut,
  getUserRole as getRole,
} from "../services/auth-service"

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
        const result = await signUpWithEmail(auth, db, email, password, displayName, role)
        return result
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
        return await signInWithEmail(auth, email, password)
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
      return await getRole(db, user.uid)
    } catch (err: any) {
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
