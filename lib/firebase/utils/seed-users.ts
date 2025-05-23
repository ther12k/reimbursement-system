"use client"

import { useState } from "react"
import { useFirebase } from "../hooks/use-firebase"
import { signUpWithEmail } from "../services/auth-service"
import { collection, getDocs, query, limit } from "firebase/firestore"

// Demo users to create
const demoUsers = [
  {
    email: "admin@example.com",
    password: "password123",
    displayName: "Admin User",
    role: "admin",
  },
  {
    email: "validator@example.com",
    password: "password123",
    displayName: "Validator User",
    role: "validator",
  },
  {
    email: "user@example.com",
    password: "password123",
    displayName: "Regular User",
    role: "user",
  },
]

export function useSeedUsers() {
  const { app } = useFirebase()
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedingProgress, setSeedingProgress] = useState("")

  const checkIfUsersExist = async (): Promise<boolean> => {
    if (!app) return false

    try {
      const { getFirestore } = await import("firebase/firestore")
      const db = getFirestore(app)
      const q = query(collection(db, "users"), limit(1))
      const snapshot = await getDocs(q)
      return !snapshot.empty
    } catch (error) {
      console.error("Error checking if users exist:", error)
      return false
    }
  }

  const seedDemoUsers = async (): Promise<boolean> => {
    if (!app || isSeeding) return false

    setIsSeeding(true)
    setSeedingProgress("Checking existing users...")

    try {
      // Check if users already exist
      const usersExist = await checkIfUsersExist()
      if (usersExist) {
        setSeedingProgress("Demo users already exist")
        console.log("Demo users already exist, skipping seed")
        return true
      }

      const { getAuth, getFirestore } = await import("firebase/auth")
      const auth = getAuth(app)
      const db = getFirestore(app)

      setSeedingProgress("Creating demo users...")

      // Create each demo user
      for (let i = 0; i < demoUsers.length; i++) {
        const user = demoUsers[i]
        setSeedingProgress(`Creating ${user.role} user (${i + 1}/${demoUsers.length})...`)

        try {
          await signUpWithEmail(auth, db, user.email, user.password, user.displayName, user.role)
          console.log(`Created ${user.role} user: ${user.email}`)
        } catch (error: any) {
          // If user already exists, that's okay
          if (error.code === "auth/email-already-in-use") {
            console.log(`User ${user.email} already exists, skipping...`)
          } else {
            console.error(`Error creating user ${user.email}:`, error)
            throw error
          }
        }
      }

      setSeedingProgress("Demo users created successfully!")
      console.log("All demo users created successfully")
      return true
    } catch (error) {
      console.error("Error seeding demo users:", error)
      setSeedingProgress("Error creating demo users")
      return false
    } finally {
      setIsSeeding(false)
      // Clear progress message after 3 seconds
      setTimeout(() => setSeedingProgress(""), 3000)
    }
  }

  return {
    seedDemoUsers,
    isSeeding,
    seedingProgress,
    demoUsers: demoUsers.map((user) => ({
      email: user.email,
      password: user.password,
      role: user.role,
    })),
  }
}
