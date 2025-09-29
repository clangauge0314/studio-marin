import { useState, useCallback } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

// 간단한 해시 함수 (실제 프로덕션에서는 더 강력한 해시 사용)
const simpleHash = (password) => {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32bit 정수로 변환
  }
  return hash.toString()
}

export const usePasswordManager = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 비밀번호 저장 (해시화)
  const savePassword = async (uid, password) => {
    if (!uid || !password) return

    try {
      setLoading(true)
      setError(null)

      const hashedPassword = simpleHash(password)
      const passwordRef = doc(db, 'passwords', uid)
      
      await setDoc(passwordRef, {
        hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      })

    } catch (err) {
      console.error('비밀번호 저장 오류:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 비밀번호 검증
  const verifyPassword = async (uid, inputPassword) => {
    if (!uid || !inputPassword) return false

    try {
      setLoading(true)
      setError(null)

      const passwordRef = doc(db, 'passwords', uid)
      const passwordDoc = await getDoc(passwordRef)
      
      if (!passwordDoc.exists()) {
        return false
      }

      const { hashedPassword } = passwordDoc.data()
      const inputHashedPassword = simpleHash(inputPassword)
      
      return hashedPassword === inputHashedPassword

    } catch (err) {
      console.error('비밀번호 검증 오류:', err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // 비밀번호 업데이트
  const updatePassword = async (uid, newPassword) => {
    if (!uid || !newPassword) return

    try {
      setLoading(true)
      setError(null)

      const hashedPassword = simpleHash(newPassword)
      const passwordRef = doc(db, 'passwords', uid)
      
      await setDoc(passwordRef, {
        hashedPassword,
        updatedAt: new Date()
      }, { merge: true })

    } catch (err) {
      console.error('비밀번호 업데이트 오류:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 비밀번호 삭제
  const deletePassword = async (uid) => {
    if (!uid) return

    try {
      setLoading(true)
      setError(null)

      const passwordRef = doc(db, 'passwords', uid)
      await setDoc(passwordRef, {
        deleted: true,
        deletedAt: new Date()
      }, { merge: true })

    } catch (err) {
      console.error('비밀번호 삭제 오류:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    savePassword,
    verifyPassword,
    updatePassword,
    deletePassword
  }
}
