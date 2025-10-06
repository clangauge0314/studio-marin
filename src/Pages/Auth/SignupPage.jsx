import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useDarkModeStore from '../../Store/useDarkModeStore'
import { useAuth } from '../../Contexts/AuthContext'

const SignupPage = () => {
  const { dark } = useDarkModeStore()
  const { signUp, currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 이미 로그인된 사용자는 리다이렉트
  useEffect(() => {
    if (currentUser) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [currentUser, navigate, location])

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

    // 닉네임 확인
    if (!formData.nickname || formData.nickname.trim().length < 2) {
      setError('ニックネームは2文字以上である必要があります')
      setLoading(false)
      return
    }

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません')
      setLoading(false)
      return
    }

    // 비밀번호 길이 확인
    if (formData.password.length < 6) {
      setError('パスワードは6文字以上である必要があります')
      setLoading(false)
      return
    }

    try {
      await signUp(formData.email, formData.password, formData.nickname)
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      className={`flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        dark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-4 ${
              dark ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30' : 'bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200'
            }`}>
              <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className={`text-5xl font-black bg-gradient-to-r ${
              dark ? 'from-cyan-400 via-blue-400 to-cyan-500' : 'from-cyan-600 via-blue-600 to-cyan-700'
            } bg-clip-text text-transparent`}>
              SIGNUP
            </h2>
          </div>
          <motion.p 
            className={`mt-2 text-center text-sm ${
              dark ? 'text-gray-400' : 'text-gray-600'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            すでにアカウントをお持ちの方は{' '}
            <Link
              to="/login"
              className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors duration-200"
            >
              こちらからログイン
            </Link>
          </motion.p>
        </motion.div>
        
        <motion.form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label htmlFor="nickname" className={`block text-sm font-medium ${
                dark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                ニックネーム
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                required
                value={formData.nickname}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-colors duration-200 ${
                  dark 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="ニックネームを入力"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label htmlFor="email" className={`block text-sm font-medium ${
                dark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-colors duration-200 ${
                  dark 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="メールアドレスを入力"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label htmlFor="password" className={`block text-sm font-medium ${
                dark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-colors duration-200 ${
                  dark 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="6文字以上のパスワード"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${
                dark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                パスワード確認
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-colors duration-200 ${
                  dark 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="パスワードを再入力"
              />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="text-red-500 text-sm text-center"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 hover:scale-105'
              }`}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                  登録中...
                </motion.div>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  会員登録
                </motion.span>
              )}
            </motion.button>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Link
              to="/"
              className={`text-sm transition-colors duration-200 ${
                dark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ← ホームに戻る
            </Link>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  )
}

export default SignupPage
