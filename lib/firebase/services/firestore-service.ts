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
  type Firestore,
  type DocumentData,
  type QueryConstraint,
  serverTimestamp,
} from "firebase/firestore"

export async function getDocument(db: Firestore, collectionName: string, id: string) {
  const docRef = doc(db, collectionName, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  } else {
    return null
  }
}

export async function getDocuments(db: Firestore, collectionName: string, constraints: QueryConstraint[] = []) {
  const q = query(collection(db, collectionName), ...constraints)
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function addDocument(db: Firestore, collectionName: string, data: DocumentData) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export async function setDocument(db: Firestore, collectionName: string, id: string, data: DocumentData, merge = true) {
  const docRef = doc(db, collectionName, id)
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge },
  )
}

export async function updateDocument(db: Firestore, collectionName: string, id: string, data: DocumentData) {
  const docRef = doc(db, collectionName, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteDocument(db: Firestore, collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id))
}
