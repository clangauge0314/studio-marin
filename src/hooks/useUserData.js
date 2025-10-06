import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export const useUserData = (uid) => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 사용자 데이터 가져오기
  const fetchUserData = async (userId) => {
    if (!userId) {
      setUserData(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const userDoc = await getDoc(doc(db, 'users', userId))
      
      if (userDoc.exists()) {
        setUserData({ id: userDoc.id, ...userDoc.data() })
      } else {
        setUserData(null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 사용자 데이터 생성/업데이트
  const updateUserData = async (userId, data) => {
    if (!userId) return

    try {
      setError(null)
      
      const userRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        // 기존 사용자 업데이트
        await updateDoc(userRef, {
          ...data,
          updatedAt: new Date()
        })
      } else {
        // 새 사용자 생성
        await setDoc(userRef, {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      
      // 로컬 상태 업데이트
      setUserData(prev => ({ ...prev, ...data }))
      
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // 사용자 데이터 새로고침
  const refreshUserData = () => {
    if (uid) {
      fetchUserData(uid)
    }
  }

  useEffect(() => {
    fetchUserData(uid)
  }, [uid])

  return {
    userData,
    loading,
    error,
    updateUserData,
    refreshUserData
  }
}
