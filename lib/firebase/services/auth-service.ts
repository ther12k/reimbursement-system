import type { Auth, UserCredential } from "firebase/auth"
import type { Firestore } from "firebase/firestore"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as authSignOut,
  updateProfile,
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

// Sign in with email and password
export async function signInWithEmail(auth: Auth, email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password)
}

// Sign up with email and password
export async function signUpWithEmail(
  auth: Auth,
  db: Firestore,
  email: string,
  password: string,
  displayName: string,
  role = "user",
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const { user } = userCredential

  // Update the user's display name
  await updateProfile(user, { displayName })

  // Create user document in Firestore
  await setDoc(doc(db, "users", user.uid), {
    email,
    displayName,
    role,
    department: role === "admin" ? "Management" : role === "validator" ? "Finance" : "General",
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return userCredential
}

// Sign out
export async function signOut(auth: Auth): Promise<void> {
  return authSignOut(auth)
}

// Get user role from Firestore
export async function getUserRole(db: Firestore, userId: string): Promise<string | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return userDoc.data().role || null
    }
    return null
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}
