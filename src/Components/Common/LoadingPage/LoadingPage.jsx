import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useDarkModeStore from '../../../Store/useDarkModeStore'
import { useAuth } from '../../../Contexts/AuthContext'

const LoadingPage = () => {
  const { dark } = useDarkModeStore()
  const { loading } = useAuth()
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [showShutter, setShowShutter] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [minLoadingComplete, setMinLoadingComplete] = useState(false)

  const loadingSteps = [
    "アプリケーションを初期化中...",
    "データベースに接続中...",
    "ユーザー情報を確認中...",
    "ほぼ完了です..."
  ]

  useEffect(() => {
    // 최소 2초 로딩 보장
    const minLoadingTimer = setTimeout(() => {
      setMinLoadingComplete(true)
    }, 2000)

    return () => clearTimeout(minLoadingTimer)
  }, [])

  useEffect(() => {
    // 실제 로딩이 완료되고 최소 로딩 시간도 지났을 때만 로딩 페이지 숨기기
    if (!loading && minLoadingComplete) {
      setTimeout(() => {
        setShowShutter(true)
      }, 300)
      setTimeout(() => {
        setIsFadingOut(true)
      }, 600)
      setTimeout(() => {
        setIsVisible(false)
      }, 1200)
    }
  }, [loading, minLoadingComplete])

  useEffect(() => {
    // 프로그레스 바 애니메이션 (실제 로딩과 무관하게 시각적 피드백)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // 로딩 중일 때는 천천히, 로딩 완료 시 빠르게
        return prev + (loading ? 1 : 3)
      })
    }, 50)

    return () => clearInterval(interval)
  }, [loading])

  useEffect(() => {
    // 단계별 로딩 메시지 변경
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 800) // 0.8초마다 단계 변경

    return () => clearInterval(stepInterval)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${
            dark ? 'bg-gray-900' : 'bg-gray-50'
          }`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isFadingOut ? 0 : 1
          }}
          exit={{ 
            opacity: 0,
            scale: 0.95
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1] // 더 부드러운 easing
          }}
        >

          {/* 로딩 텍스트 */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.4,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <motion.h2 
              className={`text-xl font-medium transition-colors duration-300 ${
                dark ? 'text-white' : 'text-gray-900'
              }`}
            >
              読み込み中...
            </motion.h2>
            
            {/* 단계별 로딩 메시지 */}
            <motion.div 
              className="mt-2 h-6 flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                <motion.p 
                  key={loadingStep}
                  className={`text-sm ${
                    dark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {loadingSteps[loadingStep]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* 프로그레스 바 */}
          <motion.div 
            className={`w-64 h-1 rounded-full mt-6 ${
              dark ? 'bg-gray-700' : 'bg-gray-200'
            }`}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.6,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <motion.div 
              className={`h-full rounded-full ${
                dark ? 'bg-cyan-400' : 'bg-cyan-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.4, 
                ease: [0.25, 0.1, 0.25, 1]
              }}
            />
          </motion.div>

          {/* 프로그레스 퍼센트 */}
          <motion.div 
            className={`mt-4 text-sm font-medium ${
              dark ? 'text-gray-400' : 'text-gray-500'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.8,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <motion.span
              key={progress}
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {Math.round(progress)}%
            </motion.span>
          </motion.div>

          {/* 셔터 효과 */}
          <AnimatePresence>
            {showShutter && (
              <motion.div 
                className={`absolute inset-0 ${
                  dark ? 'bg-gray-900' : 'bg-gray-50'
                }`}
                initial={{ y: '100%' }}
                animate={{ y: '-100%' }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingPage
