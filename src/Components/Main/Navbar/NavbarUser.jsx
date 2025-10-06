import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useDarkModeStore from '../../../Store/useDarkModeStore'
import { useAuth } from '../../../Contexts/AuthContext'

const NavbarUser = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { dark } = useDarkModeStore()
  const { currentUser, userProfile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      setIsDropdownOpen(false)
      navigate('/')
    } catch (error) {
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <motion.button
          onClick={toggleDropdown}
          className={`flex items-center space-x-2 p-2 rounded-full transition-all duration-300 hover:${dark ? 'bg-gray-700' : 'bg-gray-50'} ${
            isDropdownOpen 
              ? (dark ? 'bg-gray-700' : 'bg-gray-200')
              : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentUser 
              ? (dark ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-white')
              : (dark ? 'bg-gray-600 text-gray-300' : 'bg-gray-400 text-gray-600')
          }`}>
            {currentUser 
              ? (userProfile?.nickname?.charAt(0)?.toUpperCase() || 'U')
              : '?'
            }
          </div>
          <span className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
            {currentUser 
              ? (userProfile?.nickname || 'ユーザー')
              : 'ログイン必要'
            }
          </span>
          <motion.svg 
            className={`w-4 h-4 transition-colors duration-300 ${dark ? 'text-gray-300' : 'text-gray-500'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>

        {/* 드롭다운 메뉴 */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div 
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 ${
                dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {currentUser ? (
                /* 로그인된 사용자 메뉴 */
                <>
                  <div className={`px-4 py-2 border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {userProfile?.nickname || 'ユーザー'}
                    </p>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {userProfile?.email || ''}
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                        dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      プロフィール
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                        dark ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
                      }`}
                    >
                      ログアウト
                    </button>
                  </motion.div>
                </>
              ) : (
                /* 비로그인 사용자 메뉴 */
                <>
                  <div className={`px-4 py-2 border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                      ゲストユーザー
                    </p>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      ログインして機能を利用してください
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/login"
                      className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                        dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      ログイン
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/signup"
                      className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                        dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      会員登録
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default NavbarUser
