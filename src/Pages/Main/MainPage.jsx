import React from 'react'
import { motion } from 'framer-motion'
import useDarkModeStore from '../../Store/useDarkModeStore'

const MainPage = () => {
  const { dark } = useDarkModeStore()

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* 메인 캔버스 */}
      <motion.div
        className={`relative w-full min-h-[70vh] rounded-2xl overflow-hidden shadow-2xl ${
          dark 
            ? 'bg-white border border-gray-200' 
            : 'bg-white border border-gray-200'
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-cyan-400 animate-pulse"></div>
          <div className="absolute top-32 right-16 w-16 h-16 rounded-full bg-cyan-300 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 right-1/3 w-14 h-14 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="relative z-10 flex items-center justify-center h-full p-8">
          <motion.h1 
            className={`text-4xl font-bold text-center transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ホーム
          </motion.h1>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MainPage
