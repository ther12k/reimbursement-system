"use client"

import { useCallback } from "react"
import { collection, getDocs, query, limit, writeBatch, serverTimestamp, doc } from "firebase/firestore"
import { useFirebase } from "../hooks/use-firebase"

// Sample data for seeding the database
const users = [
  {
    email: "admin@example.com",
    displayName: "Admin User",
    role: "admin",
    department: "Management",
  },
  {
    email: "validator@example.com",
    displayName: "Validator User",
    role: "validator",
    department: "Finance",
  },
  {
    email: "user@example.com",
    displayName: "Regular User",
    role: "user",
    department: "Marketing",
  },
]

const events = [
  {
    name: "Annual Conference 2025",
    description: "Company-wide annual conference with keynote speakers and workshops",
    startDate: new Date("2025-06-15"),
    endDate: new Date("2025-06-18"),
    location: "New York, NY",
    status: "upcoming",
    allowAccommodation: true,
    allowTransportation: true,
    allowMeals: true,
    allowOther: false,
    budgetLimit: 2000,
    createdBy: "admin",
  },
  {
    name: "Team Building Retreat",
    description: "Team building activities and strategic planning sessions",
    startDate: new Date("2025-07-10"),
    endDate: new Date("2025-07-12"),
    location: "Denver, CO",
    status: "upcoming",
    allowAccommodation: true,
    allowTransportation: true,
    allowMeals: true,
    allowOther: true,
    budgetLimit: 1500,
    createdBy: "admin",
  },
  {
    name: "Sales Kickoff Meeting",
    description: "Annual sales strategy and planning meeting",
    startDate: new Date("2025-05-01"),
    endDate: new Date("2025-05-03"),
    location: "Chicago, IL",
    status: "active",
    allowAccommodation: true,
    allowTransportation: true,
    allowMeals: true,
    allowOther: false,
    budgetLimit: 1200,
    createdBy: "admin",
  },
  {
    name: "Product Launch Event",
    description: "Launch of our new product line with press and customers",
    startDate: new Date("2025-04-15"),
    endDate: new Date("2025-04-15"),
    location: "San Francisco, CA",
    status: "active",
    allowAccommodation: false,
    allowTransportation: true,
    allowMeals: true,
    allowOther: true,
    budgetLimit: 1000,
    createdBy: "admin",
  },
  {
    name: "Marketing Workshop",
    description: "Workshop for marketing team to develop new strategies",
    startDate: new Date("2025-03-10"),
    endDate: new Date("2025-03-12"),
    location: "Austin, TX",
    status: "completed",
    allowAccommodation: true,
    allowTransportation: true,
    allowMeals: true,
    allowOther: false,
    budgetLimit: 800,
    createdBy: "admin",
  },
]

const reimbursements = [
  {
    userId: "user1",
    userName: "John Doe",
    eventId: "event1",
    eventName: "Annual Conference 2025",
    totalAmount: 1320,
    status: "pending",
    submittedDate: new Date("2025-05-10"),
    expenses: [
      {
        type: "accommodation",
        description: "Hotel - 3 nights",
        amount: 750,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
      {
        type: "transportation",
        description: "Flight - Round trip",
        amount: 450,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
      {
        type: "meals",
        description: "Dinner with clients",
        amount: 120,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
    ],
  },
  {
    userId: "user2",
    userName: "Jane Smith",
    eventId: "event3",
    eventName: "Sales Kickoff Meeting",
    totalAmount: 875,
    status: "pending",
    submittedDate: new Date("2025-05-09"),
    expenses: [
      {
        type: "accommodation",
        description: "Hotel - 2 nights",
        amount: 500,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
      {
        type: "transportation",
        description: "Train tickets",
        amount: 250,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
      {
        type: "meals",
        description: "Team lunch",
        amount: 125,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
    ],
  },
  {
    userId: "user3",
    userName: "Bob Johnson",
    eventId: "event4",
    eventName: "Product Launch Event",
    totalAmount: 650,
    status: "pending",
    submittedDate: new Date("2025-05-08"),
    expenses: [
      {
        type: "transportation",
        description: "Flight tickets",
        amount: 400,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
      {
        type: "meals",
        description: "Client dinner",
        amount: 250,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
    ],
  },
  {
    userId: "user1",
    userName: "John Doe",
    eventId: "event5",
    eventName: "Marketing Workshop",
    totalAmount: 320,
    status: "rejected",
    submittedDate: new Date("2025-01-15"),
    rejectionReason: "Missing receipts for some expenses",
    expenses: [
      {
        type: "transportation",
        description: "Taxi fares",
        amount: 120,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
      {
        type: "meals",
        description: "Team dinner",
        amount: 200,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
    ],
  },
  {
    userId: "user2",
    userName: "Jane Smith",
    eventId: "event2",
    eventName: "Team Building Retreat",
    totalAmount: 450,
    status: "approved",
    submittedDate: new Date("2025-04-15"),
    approvedDate: new Date("2025-04-18"),
    expenses: [
      {
        type: "transportation",
        description: "Car rental",
        amount: 200,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
      {
        type: "meals",
        description: "Team meals",
        amount: 250,
        receiptUrl: "/placeholder.svg?height=600&width=400",
      },
    ],
  },
]

export function useSeedData() {
  const { db } = useFirebase()

  const checkIfDataExists = useCallback(
    async (collectionName: string): Promise<boolean> => {
      if (!db) return false

      try {
        const q = query(collection(db, collectionName), limit(1))
        const snapshot = await getDocs(q)
        return !snapshot.empty
      } catch (error) {
        console.error("Error checking if " + collectionName + " exists:", error)
        return false
      }
    },
    [db],
  )

  const seedUsers = useCallback(async (): Promise<boolean> => {
    if (!db) return false

    try {
      const exists = await checkIfDataExists("users")
      if (exists) {
        console.log("Users collection already has data, skipping seed")
        return false
      }

      const batch = writeBatch(db)

      users.forEach((user, index) => {
        const userRef = doc(db, "users", "seed_user_" + (index + 1))
        batch.set(userRef, {
          ...user,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      })

      await batch.commit()
      console.log("Users seeded successfully")
      return true
    } catch (error) {
      console.error("Error seeding users:", error)
      return false
    }
  }, [db, checkIfDataExists])

  const seedEvents = useCallback(async (): Promise<boolean> => {
    if (!db) return false

    try {
      const exists = await checkIfDataExists("events")
      if (exists) {
        console.log("Events collection already has data, skipping seed")
        return false
      }

      const batch = writeBatch(db)

      events.forEach((event, index) => {
        const eventRef = doc(db, "events", "seed_event_" + (index + 1))
        batch.set(eventRef, {
          ...event,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      })

      await batch.commit()
      console.log("Events seeded successfully")
      return true
    } catch (error) {
      console.error("Error seeding events:", error)
      return false
    }
  }, [db, checkIfDataExists])

  const seedReimbursements = useCallback(async (): Promise<boolean> => {
    if (!db) return false

    try {
      const exists = await checkIfDataExists("reimbursements")
      if (exists) {
        console.log("Reimbursements collection already has data, skipping seed")
        return false
      }

      const batch = writeBatch(db)

      reimbursements.forEach((reimbursement, index) => {
        const reimbursementRef = doc(db, "reimbursements", "seed_reimbursement_" + (index + 1))
        batch.set(reimbursementRef, {
          ...reimbursement,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      })

      await batch.commit()
      console.log("Reimbursements seeded successfully")
      return true
    } catch (error) {
      console.error("Error seeding reimbursements:", error)
      return false
    }
  }, [db, checkIfDataExists])

  const seedAllData = useCallback(async (): Promise<boolean> => {
    try {
      await seedUsers()
      await seedEvents()
      await seedReimbursements()
      return true
    } catch (error) {
      console.error("Error seeding all data:", error)
      return false
    }
  }, [seedUsers, seedEvents, seedReimbursements])

  return {
    seedUsers,
    seedEvents,
    seedReimbursements,
    seedAllData,
  }
}
