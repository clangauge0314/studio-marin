import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, Trophy, Target, Settings, LogOut, Crown, Star, Trash2, AlertTriangle, Lock } from 'lucide-react'
import { useAuth } from '../../Contexts/AuthContext'
import useDarkModeStore from '../../Store/useDarkModeStore'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { toast } from 'sonner'

const ProfilePage = () => {
  const { currentUser, userProfile, logout } = useAuth()
  const { dark } = useDarkModeStore()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [password, setPassword] = useState('')
  const [showPasswordInput, setShowPasswordInput] = useState(false)

  // 게스트 사용자 체크 및 리다이렉트
  useEffect(() => {
    if (!currentUser || currentUser.isAnonymous) {
      toast.error('ゲストユーザーはプロフィールページにアクセスできません。\nログインしてからアクセスしてください。')
      navigate('/')
    }
  }, [currentUser, navigate])

  // 게스트 사용자인 경우 렌더링하지 않음
  if (!currentUser || currentUser.isAnonymous) {
    return null
  }

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
    }
  }

  // 회원탈퇴 핸들러
  const handleDeleteAccount = async () => {
    if (!currentUser) return

    try {
      setIsDeleting(true)
      
      // 1. 비밀번호 재인증
      const credential = EmailAuthProvider.credential(currentUser.email, password)
      await reauthenticateWithCredential(currentUser, credential)
      
      // 2. Firestore에서 사용자 데이터 삭제
      const userDocRef = doc(db, 'users', currentUser.uid)
      await deleteDoc(userDocRef)
      
      // 3. userStreaks 컬렉션에서도 삭제 (이메일로 찾기)
      const userStreaksDocRef = doc(db, 'userStreaks', currentUser.email)
      try {
        await deleteDoc(userStreaksDocRef)
      } catch (error) {
      }
      
      // 4. Firebase Auth에서 계정 삭제
      await deleteUser(currentUser)
      
      // 5. 로컬 상태 초기화
      await logout()
      
      toast.success('アカウントが正常に削除されました')
      
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        toast.error('パスワードが正しくありません')
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('試行回数が多すぎます。しばらく待ってから再試行してください')
      } else {
        toast.error('アカウント削除中にエラーが発生しました')
      }
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      setShowPasswordInput(false)
      setPassword('')
    }
  }

  // 비밀번호 입력 모달 열기
  const handleDeleteClick = () => {
    setShowPasswordInput(true)
  }

  // 가입일 계산
  const getJoinDate = () => {
    if (userProfile?.createdAt) {
      const date = userProfile.createdAt.toDate ? userProfile.createdAt.toDate() : new Date(userProfile.createdAt)
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    return '不明'
  }

  return (
    <motion.div 
      className={`min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-4 ${
              dark ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30' : 'bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200'
            }`}>
              <User className="w-8 h-8 text-cyan-500" />
            </div>
            <h1 className={`text-5xl font-black bg-gradient-to-r ${
              dark ? 'from-cyan-400 via-blue-400 to-cyan-500' : 'from-cyan-600 via-blue-600 to-cyan-700'
            } bg-clip-text text-transparent`}>
              PROFILE
            </h1>
          </motion.div>
          <motion.p
            className={`text-lg font-medium ${
              dark ? 'text-gray-400' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            あなたのアカウント情報
          </motion.p>
        </motion.div>

        {/* 프로필 카드 */}
        <motion.div
          className={`rounded-3xl p-6 sm:p-8 border-2 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-2xl mb-8`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* 프로필 헤더 */}
          <div className="text-center mb-8">
            <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
              {userProfile?.nickname || 'ユーザー'}
            </h2>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentUser?.email}
            </p>
          </div>

          {/* 정보 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 기본 정보 */}
            <motion.div
              className={`rounded-2xl p-6 ${dark ? 'bg-gray-700/50' : 'bg-gray-50'} border ${dark ? 'border-gray-600' : 'border-gray-200'}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <Settings className={`w-5 h-5 ${dark ? 'text-cyan-400' : 'text-cyan-600'} mr-2`} />
                基本情報
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className={`w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-600'} mr-3`} />
                  <div>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>メールアドレス</p>
                    <p className={`text-base font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {currentUser?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className={`w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-600'} mr-3`} />
                  <div>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>ニックネーム</p>
                    <p className={`text-base font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {userProfile?.nickname || '未設定'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className={`w-4 h-4 ${dark ? 'text-gray-400' : 'text-gray-600'} mr-3`} />
                  <div>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>登録日</p>
                    <p className={`text-base font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {getJoinDate()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 계정 상태 */}
            <motion.div
              className={`rounded-2xl p-6 ${dark ? 'bg-gray-700/50' : 'bg-gray-50'} border ${dark ? 'border-gray-600' : 'border-gray-200'}`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <Crown className={`w-5 h-5 ${dark ? 'text-yellow-400' : 'text-yellow-600'} mr-2`} />
                アカウント状態
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>認証状態</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                    認証済み
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>アカウント種別</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                    一般会員
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>UID</span>
                  <span className={`text-xs font-mono ${dark ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                    {currentUser?.uid?.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 액션 버튼들 */}
          <motion.div 
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.button
              onClick={handleLogout}
              className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                dark 
                  ? 'bg-red-900/30 text-red-400 border border-red-700 hover:bg-red-900/50' 
                  : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </motion.button>
            
            <motion.button
              onClick={handleDeleteClick}
              className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                dark 
                  ? 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              アカウント削除
            </motion.button>
          </motion.div>
        </motion.div>

        {/* 추가 정보 카드 */}
        <motion.div
          className={`rounded-3xl p-6 sm:p-8 border-2 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-2xl`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
            <Star className={`w-6 h-6 ${dark ? 'text-yellow-400' : 'text-yellow-600'} mr-2`} />
            アカウント詳細
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl ${dark ? 'bg-gray-700/30' : 'bg-gray-50'} border ${dark ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="flex items-center mb-2">
                <Target className={`w-4 h-4 ${dark ? 'text-cyan-400' : 'text-cyan-600'} mr-2`} />
                <span className={`text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                  プロバイダー
                </span>
              </div>
              <p className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                {currentUser?.providerId || 'Firebase'}
              </p>
            </div>

            <div className={`p-4 rounded-xl ${dark ? 'bg-gray-700/30' : 'bg-gray-50'} border ${dark ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="flex items-center mb-2">
                <Trophy className={`w-4 h-4 ${dark ? 'text-yellow-400' : 'text-yellow-600'} mr-2`} />
                <span className={`text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                  最終ログイン
                </span>
              </div>
              <p className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                今
              </p>
            </div>

            <div className={`p-4 rounded-xl ${dark ? 'bg-gray-700/30' : 'bg-gray-50'} border ${dark ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="flex items-center mb-2">
                <User className={`w-4 h-4 ${dark ? 'text-green-400' : 'text-green-600'} mr-2`} />
                <span className={`text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                  ステータス
                </span>
              </div>
              <p className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                アクティブ
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 비밀번호 입력 모달 */}
      {showPasswordInput && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowPasswordInput(false)
              setPassword('')
            }}
          />
          
          {/* 모달 컨텐츠 */}
          <motion.div
            className={`relative w-full max-w-md rounded-2xl p-6 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-2xl`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* 잠금 아이콘 */}
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${dark ? 'bg-cyan-900/30' : 'bg-cyan-100'}`}>
                <Lock className={`w-8 h-8 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              </div>
            </div>
            
            {/* 제목 */}
            <h3 className={`text-xl font-bold text-center mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
              パスワード確認
            </h3>
            
            <p className={`text-sm text-center mb-6 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              アカウント削除のためにパスワードを入力してください
            </p>
            
            {/* 비밀번호 입력 */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                className={`w-full px-4 py-3 rounded-xl border transition-colors duration-200 ${
                  dark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20'
                } focus:outline-none focus:ring-2`}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && password.trim()) {
                    setShowPasswordInput(false)
                    setShowDeleteConfirm(true)
                  }
                }}
              />
            </div>
            
            {/* 버튼들 */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => {
                  setShowPasswordInput(false)
                  setPassword('')
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 bg-red-500 text-white hover:bg-red-600`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                キャンセル
              </motion.button>
              
              <motion.button
                onClick={() => {
                  if (password.trim()) {
                    setShowPasswordInput(false)
                    setShowDeleteConfirm(true)
                  }
                }}
                disabled={!password.trim()}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  !password.trim()
                    ? (dark ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500')
                    : (dark ? 'bg-cyan-900 text-cyan-300 hover:bg-cyan-800' : 'bg-cyan-600 text-white hover:bg-cyan-700')
                }`}
                whileHover={password.trim() ? { scale: 1.02 } : {}}
                whileTap={password.trim() ? { scale: 0.98 } : {}}
              >
                確認
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 회원탈퇴 확인 모달 */}
      {showDeleteConfirm && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          
          {/* 모달 컨텐츠 */}
          <motion.div
            className={`relative w-full max-w-md rounded-2xl p-6 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-2xl`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* 경고 아이콘 */}
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${dark ? 'bg-red-900/30' : 'bg-red-100'}`}>
                <AlertTriangle className={`w-8 h-8 ${dark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
            </div>
            
            {/* 제목 */}
            <h3 className={`text-xl font-bold text-center mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              アカウント削除の確認
            </h3>
            
            {/* 경고 메시지 */}
            <div className={`p-4 rounded-xl mb-6 ${dark ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-sm ${dark ? 'text-red-300' : 'text-red-700'} mb-2`}>
                <strong>警告:</strong> この操作は取り消すことができません。
              </p>
              <ul className={`text-xs space-y-1 ${dark ? 'text-red-400' : 'text-red-600'}`}>
                <li>• アカウント情報が完全に削除されます</li>
                <li>• ゲーム記録がすべて失われます</li>
                <li>• ランキングからも削除されます</li>
                <li>• この操作は元に戻せません</li>
              </ul>
            </div>
            
            {/* 버튼들 */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => setShowDeleteConfirm(false)}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 bg-red-500 text-white hover:bg-red-600`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                キャンセル
              </motion.button>
              
              <motion.button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isDeleting
                    ? (dark ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500')
                    : (dark ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-600 text-white hover:bg-red-700')
                }`}
                whileHover={!isDeleting ? { scale: 1.02 } : {}}
                whileTap={!isDeleting ? { scale: 0.98 } : {}}
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    削除中...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    削除する
                  </div>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ProfilePage
