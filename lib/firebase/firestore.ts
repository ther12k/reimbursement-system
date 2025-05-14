"use client"

import { useState, useCallback } from "react"
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  type DocumentData,
  type QueryConstraint,
  serverTimestamp,
} from "firebase/firestore"
import { useFirebase } from "./firebase-provider"

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
        const docRef = doc(db, collectionName, id)
        const docSnap = await getDoc(docRef)

        setLoading(false)

        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() }
        } else {
          return null
        }
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
        const q = query(collection(db, collectionName), ...constraints)
        const querySnapshot = await getDocs(q)

        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

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
    async (data: DocumentData) => {
      if (!db) return null

      setLoading(true)
      setError(null)

      try {
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })

        setLoading(false)
        return docRef.id
      } catch (err: any) {
        setError(err)
        setLoading(false)
        return null
      }
    },
    [db, collectionName],
  )

  const setDocument = useCallback(
    async (id: string, data: DocumentData, merge = true) => {
      if (!db) return false

      setLoading(true)
      setError(null)

      try {
        const docRef = doc(db, collectionName, id)
        await setDoc(
          docRef,
          {
            ...data,
            updatedAt: serverTimestamp(),
          },
          { merge },
        )

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
    async (id: string, data: DocumentData) => {
      if (!db) return false

      setLoading(true)
      setError(null)

      try {
        const docRef = doc(db, collectionName, id)
        await updateDoc(docRef, {
          ...data,
          updatedAt: serverTimestamp(),
        })

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
        await deleteDoc(doc(db, collectionName, id))
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
