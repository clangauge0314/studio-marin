import React from 'react'
import useDarkModeStore from '../../Store/useDarkModeStore'
import { useAuth } from '../../Contexts/AuthContext'

const UserInfo = () => {
  const { dark } = useDarkModeStore()
  const { currentUser, userProfile, logout } = useAuth()

  if (!currentUser) return null

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  return (
    <div className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
      dark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
    }`}>
      {/* 사용자 아바타 */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
        userProfile?.isAnonymous === false ? 'bg-blue-500' : 'bg-gray-500'
      }`}>
        {userProfile?.nickname ? userProfile.nickname.charAt(0).toUpperCase() : 'G'}
      </div>

      {/* 사용자 정보 */}
      <div className="flex-1">
        <div className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
          {userProfile?.nickname || 'ゲスト'}
        </div>
        <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {userProfile?.isAnonymous === false ? '会員' : 'ゲスト'}
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className={`px-3 py-1 text-sm rounded-md transition-all duration-200 hover:scale-105 ${
          dark 
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        ログアウト
      </button>
    </div>
  )
}

export default UserInfo
