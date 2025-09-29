import React, { useState } from 'react'
import useDarkModeStore from '../../Store/useDarkModeStore'
import { useAuth } from '../../Contexts/AuthContext'

const AuthModal = ({ isOpen, onClose, isFullScreen = false }) => {
  const { dark } = useDarkModeStore()
  const { authenticate } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authenticate(formData.email, formData.password)
      if (onClose) onClose()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }


  if (!isOpen) return null

  return (
    <div className={`${isFullScreen ? 'w-full' : 'fixed inset-0 z-50 flex items-center justify-center'}`}>
      {/* 배경 오버레이 - 전체 화면이 아닐 때만 */}
      {!isFullScreen && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
      )}
      
        <div className={`relative w-full max-w-md mx-4 p-6 rounded-lg shadow-xl animate-fade-in ${
          dark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
              ログイン / 会員登録
            </h2>
            {!isFullScreen && onClose && (
              <button
                onClick={onClose}
                className={`text-2xl ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ×
              </button>
            )}
          </div>

          {/* 설명 텍스트 */}
          <div className={`text-center mb-6 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            <p className="text-sm">
              メールアドレスとパスワードを入力してください。<br />
              初回の場合は自動的に会員登録されます。
            </p>
          </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="メールアドレスを入力"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              パスワード
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="6文字以上のパスワード"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-300 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
            } text-white`}
          >
            {loading ? '処理中...' : 'ログイン / 会員登録'}
          </button>
        </form>


      </div>
    </div>
  )
}

export default AuthModal
