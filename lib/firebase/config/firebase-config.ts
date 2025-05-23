// Check if we're in development mode and provide better error handling
const isDevelopment = process.env.NODE_ENV === "development"

// Firebase configuration with your provided values
export const firebaseConfig = {
  apiKey: "AIzaSyDgel2DVA_eMRQN5ph4I0NtV93IeGI6VSc",
  authDomain: "reimbyte.firebaseapp.com",
  projectId: "reimbyte",
  storageBucket: "reimbyte.firebasestorage.app",
  messagingSenderId: "871508955360",
  appId: "1:871508955360:web:8ff4e058f290bfcce70085",
}

// Validate Firebase configuration
export function validateFirebaseConfig() {
  const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]

  const missingFields = requiredFields.filter((field) => !firebaseConfig[field as keyof typeof firebaseConfig])

  if (missingFields.length > 0) {
    throw new Error(
      `Missing Firebase configuration: ${missingFields.join(", ")}. Please check your environment variables.`,
    )
  }

  return true
}

// Demo configuration for development (when environment variables are not set)
export const demoFirebaseConfig = {
  apiKey: "demo-api-key-for-development",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project-id",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo-app-id",
}

// Get the appropriate config based on environment
export function getFirebaseConfig() {
  try {
    validateFirebaseConfig()
    return firebaseConfig
  } catch (error) {
    if (isDevelopment) {
      console.warn("Using demo Firebase configuration. Please set up proper environment variables for production.")
      return demoFirebaseConfig
    } else {
      throw error
    }
  }
}
