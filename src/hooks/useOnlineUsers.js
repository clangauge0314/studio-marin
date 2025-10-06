import { useState, useEffect, useCallback } from 'react'
import { ref, onDisconnect, serverTimestamp, onValue, off, set } from 'firebase/database'
import { database } from '../firebase/config'
import { useAuth } from '../Contexts/AuthContext'

export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()

  // 고유 세션 ID 생성 (브라우저별 고유 식별)
  const getSessionId = useCallback(() => {
    let sessionId = localStorage.getItem('visitor_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('visitor_session_id', sessionId)
    }
    return sessionId
  }, [])

  // 온라인 상태 등록
  const registerOnlineStatus = useCallback(async () => {
    try {
      const sessionId = getSessionId()
      const userRef = ref(database, `online_users/${sessionId}`)
      
      // 사용자 정보 설정
      const userInfo = {
        sessionId,
        isLoggedIn: !!currentUser,
        userId: currentUser?.uid || null,
        userEmail: currentUser?.email || null,
        isAnonymous: currentUser?.isAnonymous || false,
        lastSeen: serverTimestamp(),
        joinedAt: serverTimestamp()
      }

      // 온라인 상태 설정
      await set(userRef, userInfo)

      // 연결 해제 시 자동으로 제거
      onDisconnect(userRef).remove()

    } catch (error) {
    }
  }, [currentUser, getSessionId])

  // 온라인 사용자 수 실시간 감시
  const watchOnlineUsers = useCallback(() => {
    const onlineUsersRef = ref(database, 'online_users')
    
    const unsubscribe = onValue(onlineUsersRef, (snapshot) => {
      try {
        const users = snapshot.val()
        if (users) {
          const userCount = Object.keys(users).length
          setOnlineCount(userCount)
        } else {
          setOnlineCount(0)
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }, (error) => {
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // 컴포넌트 마운트 시 등록 및 감시 시작
  useEffect(() => {
    let unsubscribe

    const initializeOnlineTracking = async () => {
      try {
        // 온라인 상태 등록
        await registerOnlineStatus()
        
        // 온라인 사용자 수 감시 시작
        unsubscribe = watchOnlineUsers()
      } catch (error) {
        setLoading(false)
      }
    }

    initializeOnlineTracking()

    // 페이지 언마운트 시 정리
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [registerOnlineStatus, watchOnlineUsers])

  // 페이지 가시성 변경 시 상태 업데이트
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        registerOnlineStatus()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [registerOnlineStatus])

  return {
    onlineCount,
    loading
  }
}
