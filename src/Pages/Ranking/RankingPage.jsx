import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, Star, User, Target, TrendingUp } from 'lucide-react'
import { useRanking } from '../../hooks/useRanking'
import useDarkModeStore from '../../Store/useDarkModeStore'
import { useAuth } from '../../Contexts/AuthContext'

const RankingPage = () => {
  const { rankings, currentUserRank, totalUsers, loading, error } = useRanking()
  const { dark } = useDarkModeStore()
  const { currentUser, userProfile } = useAuth()


  // 순위별 아이콘과 색상
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <Trophy className="w-5 h-5 text-gray-500" />
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600'
      case 2:
        return 'from-gray-300 to-gray-500'
      case 3:
        return 'from-amber-500 to-amber-700'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getRankBgColor = (rank) => {
    switch (rank) {
      case 1:
        return dark ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
      case 2:
        return dark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200'
      case 3:
        return dark ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-200'
      default:
        return dark ? 'bg-gray-800/30 border-gray-700' : 'bg-white border-gray-200'
    }
  }

  if (loading) {
    return (
      <motion.div 
        className={`min-h-screen flex items-center justify-center ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className={`text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>ランキングを読み込み中...</p>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div 
        className={`min-h-screen flex items-center justify-center ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full ${dark ? 'bg-red-900/20' : 'bg-red-100'} flex items-center justify-center mx-auto mb-4`}>
            <Trophy className="w-8 h-8 text-red-500" />
          </div>
            <p className={`text-lg ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>エラーが発生しました</p>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>ランキングデータの読み込みに失敗しました</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={`min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4 pb-32`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto relative">
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="relative inline-block mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center space-x-4">
              <motion.div
                className={`p-3 rounded-2xl ${dark ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20' : 'bg-gradient-to-br from-yellow-100 to-amber-100'} border ${dark ? 'border-yellow-500/30' : 'border-yellow-200'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Trophy className={`w-10 h-10 ${dark ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </motion.div>
              
              <div className="text-left">
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r ${dark ? 'from-yellow-400 via-amber-400 to-yellow-500' : 'from-yellow-600 via-amber-600 to-yellow-700'} bg-clip-text text-transparent leading-tight`}>
                  RANKING
                </h1>
                <div className={`text-sm sm:text-base font-medium ${dark ? 'text-gray-400' : 'text-gray-600'} tracking-wider`}>
                  連勝記録
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`inline-block px-6 py-3 rounded-full ${dark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'} backdrop-blur-sm`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              🏆 最高連勝記録を誇るプレイヤーたち 🏆
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="space-y-3 sm:space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {rankings.map((user, index) => {
            const rank = index + 1
            return (
              <motion.div
                key={user.id}
                className={`rounded-2xl p-4 sm:p-6 border-2 ${getRankBgColor(rank)} shadow-lg`}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(rank)}
                    <span className={`text-2xl sm:text-3xl font-black ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {rank}
                    </span>
                  </div>

                  <div className="flex-1 mx-4 sm:mx-6 min-w-0">
                    <p className={`text-lg sm:text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'} truncate`}>
                      {user.nickname}
                    </p>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                      {user.email}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`px-4 py-2 rounded-full ${dark ? 'bg-cyan-900/30' : 'bg-cyan-100'} border ${dark ? 'border-cyan-700' : 'border-cyan-200'}`}>
                      <div className="flex items-center space-x-2">
                        <Target className={`w-5 h-5 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                        <span className={`text-xl sm:text-2xl font-black ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          {user.bestStreak}
                        </span>
                        <span className={`text-sm font-semibold ${dark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                          連勝
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>


        {rankings.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Trophy className={`w-16 h-16 ${dark ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} />
            <p className={`text-lg ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
              まだランキングデータがありません
            </p>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              ゲームをプレイして最初の記録を作ってみてください！
            </p>
          </motion.div>
        )}
      </div>

      {!loading && (
        <motion.div
          className={`fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 ${dark ? 'bg-gray-900/95 border-t border-gray-700' : 'bg-white/95 border-t border-gray-200'} backdrop-blur-lg shadow-2xl`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="max-w-4xl mx-auto px-4 py-4">
            {currentUserRank ? (
              <div className={`rounded-2xl p-4 sm:p-5 border-2 ${dark ? 'bg-cyan-900/30 border-cyan-700' : 'bg-cyan-50 border-cyan-200'} shadow-xl`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    <h3 className={`text-sm sm:text-base font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      私の順位
                    </h3>
                  </div>
                  <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                    総ユーザー: {totalUsers}人
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {/* 왼쪽: 순위 */}
                  <div className="flex items-center space-x-3">
                    <Trophy className={`w-5 h-5 sm:w-6 sm:h-6 ${dark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <div>
                      <span className={`text-2xl sm:text-3xl font-black ${dark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        {currentUserRank.rank}
                      </span>
                      <span className={`text-sm sm:text-base font-semibold ${dark ? 'text-gray-400' : 'text-gray-600'} ml-1`}>
                        位
                      </span>
                    </div>
                  </div>

                  {/* 중앙: 사용자 정보 */}
                  <div className="flex-1 mx-4 sm:mx-6 min-w-0">
                    <p className={`text-base sm:text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'} truncate`}>
                      {currentUserRank.nickname}
                    </p>
                    <p className={`text-xs sm:text-sm ${dark ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                      {currentUserRank.email}
                    </p>
                  </div>

                  {/* 오른쪽: 연승 기록 */}
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full ${dark ? 'bg-cyan-900/50' : 'bg-cyan-100'} border ${dark ? 'border-cyan-700' : 'border-cyan-200'}`}>
                      <div className="flex items-center space-x-2">
                        <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                        <span className={`text-lg sm:text-2xl font-black ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          {currentUserRank.bestStreak}
                        </span>
                        <span className={`text-xs sm:text-sm font-semibold ${dark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                          連勝
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-2xl p-4 sm:p-5 border-2 ${dark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} shadow-xl text-center`}>
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <User className={`w-5 h-5 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                      <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        ログイン中: {userProfile?.nickname || currentUser.email}
                      </p>
                    </div>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      ゲームをプレイして記録を作成してください
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <User className={`w-5 h-5 ${dark ? 'text-gray-400' : 'text-gray-600'}`} />
                    <p className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                      ログインしてランキングに参加してください
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default RankingPage