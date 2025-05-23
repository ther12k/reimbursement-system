"use client"

import { useState, useCallback } from "react"
import type { QueryConstraint } from "firebase/firestore"
import { useFirebase } from "./use-firebase"
import {
  getDocument as getDoc,
  getDocuments as getDocs,
  addDocument as addDoc,
  setDocument as setDoc,
  updateDocument as updateDoc,
  deleteDocument as deleteDoc,
} from "../services/firestore-service"

export function useFirestore(collectionName: string) {
  const { db } = useFirebase()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getDocument = useCallback(
    async (id: string) => {
      if (!db) return null

      setLoading(true)
      setError(null)

      try {
        const result = await getDoc(db, collectionName, id)
        setLoading(false)
        return result
      } catch (err: any) {
        setError(err)
        setLoading(false)
        return null
      }
    },
    [db, collectionName],
  )

  const getDocuments = useCallback(
    async (constraints: QueryConstraint[] = []) => {
      if (!db) return []

      setLoading(true)
      setError(null)

      try {
        const documents = await getDocs(db, collectionName, constraints)
        setLoading(false)
        return documents
      } catch (err: any) {
        setError(err)
        setLoading(false)
        return []
      }
    },
    [db, collectionName],
  )

  const addDocument = useCallback(
    async (data: any) => {
      if (!db) return null

      setLoading(true)
      setError(null)

      try {
        const docId = await addDoc(db, collectionName, data)
        setLoading(false)
        return docId
      } catch (err: any) {
        setError(err)
        setLoading(false)
        return null
      }
    },
    [db, collectionName],
  )

  const setDocument = useCallback(
    async (id: string, data: any, merge = true) => {
      if (!db) return false

      setLoading(true)
      setError(null)

      try {
        await setDoc(db, collectionName, id, data, merge)
        setLoading(false)
        return true
      } catch (err: any) {
        setError(err)
        setLoading(false)
        return false
      }
    },
    [db, collectionName],
  )

  const updateDocument = useCallback(
    async (id: string, data: any) => {
      if (!db) return false

      setLoading(true)
      setError(null)

      try {
        await updateDoc(db, collectionName, id, data)
        setLoading(false)
        return true
      } catch (err: any) {
        setError(err)
        setLoading(false)
        return false
      }
    },
    [db, collectionName],
  )

  const deleteDocument = useCallback(
    async (id: string) => {
      if (!db) return false

      setLoading(true)
      setError(null)

      try {
        await deleteDoc(db, collectionName, id)
        setLoading(false)
        return true
      } catch (err: any) {
        setError(err)
        setLoading(false)
        return false
      }
    },
    [db, collectionName],
  )

  return {
    getDocument,
    getDocuments,
    addDocument,
    setDocument,
    updateDocument,
    deleteDocument,
    loading,
    error,
  }
}
