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
      <motion.h1 
        className={`text-4xl font-bold text-center transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        ホーム
      </motion.h1>
    </motion.div>
  )
}

export default MainPage
