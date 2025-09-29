import { useState, useEffect } from 'react'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore'
import { db } from '../firebase/config'

// Firestore 데이터 읽기 훅
export const useFirestore = (collectionName) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items = []
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() })
        })
        setData(items)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName])

  return { data, loading, error }
}

// Firestore 데이터 추가 훅
export const useAddDocument = (collectionName) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addDocument = async (data) => {
    setLoading(true)
    setError(null)
    
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date()
      })
      setLoading(false)
      return docRef
    } catch (err) {
      setError(err)
      setLoading(false)
      throw err
    }
  }

  return { addDocument, loading, error }
}

// Firestore 데이터 업데이트 훅
export const useUpdateDocument = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateDocument = async (collectionName, docId, data) => {
    setLoading(true)
    setError(null)
    
    try {
      await updateDoc(doc(db, collectionName, docId), data)
      setLoading(false)
    } catch (err) {
      setError(err)
      setLoading(false)
      throw err
    }
  }

  return { updateDocument, loading, error }
}

// Firestore 데이터 삭제 훅
export const useDeleteDocument = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteDocument = async (collectionName, docId) => {
    setLoading(true)
    setError(null)
    
    try {
      await deleteDoc(doc(db, collectionName, docId))
      setLoading(false)
    } catch (err) {
      setError(err)
      setLoading(false)
      throw err
    }
  }

  return { deleteDocument, loading, error }
}
