import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../Main/Navbar/Navbar'
import BottomNavigation from '../Main/BottomNavigation/BottomNavigation'
import DarkModeToggle from '../Common/DarkModeToggle/DarkModeToggle'
import AuthModal from '../Auth/AuthModal'
import { useAuth } from '../../Contexts/AuthContext'
import useDarkModeStore from '../../Store/useDarkModeStore'

const Layout = () => {
  const { dark } = useDarkModeStore()
  const { currentUser, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (loading) {
    return (
      <motion.div 
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${dark ? 'dark bg-gray-900' : 'bg-gray-50'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <motion.p 
            className={`text-lg ${dark ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            読み込み中...
          </motion.p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={`min-h-screen transition-colors duration-300 ${dark ? 'dark bg-gray-900' : 'bg-gray-50'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
      </motion.div>

      <motion.main 
        className={`pt-16 pb-16 lg:pb-12 ${dark ? 'border-t border-gray-700' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Outlet />
      </motion.main>
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <BottomNavigation />
      </motion.div>
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <DarkModeToggle />
      </motion.div>
      
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Layout
