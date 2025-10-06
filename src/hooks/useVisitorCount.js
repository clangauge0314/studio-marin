import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

export const useVisitorCount = () => {
  const [totalVisitors, setTotalVisitors] = useState(0)
  const [loading, setLoading] = useState(true)

  // 방문자 수 증가
  const incrementVisitorCount = useCallback(async () => {
    try {
      const visitorDocRef = doc(db, 'site_stats', 'visitor_count')
      
      // 문서 존재 여부 확인
      const visitorDoc = await getDoc(visitorDocRef)
      
      if (!visitorDoc.exists()) {
        // 문서가 없으면 생성
        await setDoc(visitorDocRef, {
          totalVisitors: 1,
          lastUpdated: serverTimestamp(),
          createdAt: serverTimestamp()
        })
      } else {
        // 문서가 있으면 방문자 수 증가
        await updateDoc(visitorDocRef, {
          totalVisitors: increment(1),
          lastUpdated: serverTimestamp()
        })
      }
    } catch (error) {
      throw error // 에러를 다시 던져서 호출부에서 처리
    }
  }, [])

  // 총 방문자 수 조회
  const fetchTotalVisitors = useCallback(async () => {
    try {
      const visitorDocRef = doc(db, 'site_stats', 'visitor_count')
      const visitorDoc = await getDoc(visitorDocRef)
      
      if (visitorDoc.exists()) {
        const data = visitorDoc.data()
        setTotalVisitors(data.totalVisitors || 0)
      } else {
        setTotalVisitors(0)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [])

  // 방문자 카운터 초기화 (수동 생성)
  const initializeVisitorCounter = useCallback(async () => {
    try {
      const visitorDocRef = doc(db, 'site_stats', 'visitor_count')
      
      await setDoc(visitorDocRef, {
        totalVisitors: 0,
        lastUpdated: serverTimestamp(),
        createdAt: serverTimestamp()
      })
      
      setTotalVisitors(0)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [])

  // 초기화
  useEffect(() => {
    const initializeVisitorTracking = async () => {
      try {
        // 세션별 방문 추적
        const hasVisitedThisSession = sessionStorage.getItem('session_visited')
        
        
        if (!hasVisitedThisSession) {
          // 이번 세션에서 첫 방문이면 카운터 증가
          
          // 먼저 세션 플래그를 설정해서 중복 실행 방지
          sessionStorage.setItem('session_visited', 'true')
          
          // 그 다음 카운터 증가
          await incrementVisitorCount()
        } else {
        }
        
        // 총 방문자 수 조회
        await fetchTotalVisitors()
        
      } catch (error) {
        // 에러 시 세션 플래그 제거해서 재시도 가능하게 함
        sessionStorage.removeItem('session_visited')
        setLoading(false)
      }
    }

    initializeVisitorTracking()
  }, []) // 의존성 배열 비워서 한 번만 실행

  // 수동 초기화 함수를 window 객체에 추가 (개발용)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.initVisitorCounter = initializeVisitorCounter
    }
  }, [initializeVisitorCounter])

  return {
    totalVisitors,
    loading
  }
}
