// Firebase configuration with your provided values
export const firebaseConfig = {
  apiKey: "AIzaSyDgel2DVA_eMRQN5ph4I0NtV93IeGI6VSc",
  authDomain: "reimbyte.firebaseapp.com",
  projectId: "reimbyte",
  storageBucket: "reimbyte.firebasestorage.app",
  messagingSenderId: "871508955360",
  appId: "1:871508955360:web:8ff4e058f290bfcce70085",
}

// Simple validation function
export function validateFirebaseConfig() {
  const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]

  for (const field of requiredFields) {
    if (!firebaseConfig[field as keyof typeof firebaseConfig]) {
      throw new Error(`Missing Firebase configuration field: ${field}`)
    }
  }

  return true
}

// Get Firebase config
export function getFirebaseConfig() {
  validateFirebaseConfig()
  return firebaseConfig
}
