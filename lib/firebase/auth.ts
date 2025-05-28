"use client"

import { useContext } from "react"
import { FirebaseContext } from "./context/firebase-context"

export function useFirebase() {
  return useContext(FirebaseContext)
}
