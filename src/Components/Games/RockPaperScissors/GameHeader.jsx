import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, Flame } from 'lucide-react'

// 연승 달성 확률 계산 함수
const calculateStreakProbability = (winStreak) => {
  // 0연승일 때는 다음 1연승 달성 확률을 보여줌
  if (winStreak === 0) {
    return {
      case1: 33.33, // 1/3 = 33.33%
      case2: 50.00, // 1/2 = 50%
      description: "1連勝達成確率"
    }
  }
  
  // Case 1: 무승부가 나오면 연승이 끊긴다고 가정
  // 연승 k회 달성 확률 = (1/3)^k
  const case1Probability = Math.pow(1/3, winStreak) * 100
  
  // Case 2: 무승부는 무시하고 승패가 날 때만 세는 규칙
  // 연승 k회 달성 확률 = (1/2)^k
  const case2Probability = Math.pow(1/2, winStreak) * 100
  
  return {
    case1: Math.round(case1Probability * 100) / 100, // 소수점 2자리까지
    case2: Math.round(case2Probability * 100) / 100,
    description: winStreak === 1 ? "1連勝達成！" : `${winStreak}連勝達成！`
  }
}

const GameHeader = ({ winStreak, bestStreak, dark, playerNickname, selectedAI, onChangeAI, currentUser, isLoadingStreak, playerChoice, aiChoice }) => {
  return (
    <motion.div 
      className="text-center mb-4 sm:mb-6"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 게임 타이틀 */}
      <motion.div 
        className="relative mb-4 sm:mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.h2 
          className={`text-lg xs:text-xl sm:text-3xl md:text-4xl font-black mb-2 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}
        >
          じゃんけんゲーム - 連勝チャレンジ
        </motion.h2>
        
        {/* 장식 요소 */}
        <motion.div 
          className="flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${dark ? 'bg-cyan-400' : 'bg-cyan-500'} rounded-full`}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </motion.div>
      </motion.div>
      
      {/* 연승 기록 보드 */}
      <motion.div 
        className="flex justify-center items-center space-x-2 xs:space-x-3 sm:space-x-6 md:space-x-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* 현재 연승 */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className={`relative ${dark ? 'bg-cyan-600' : 'bg-cyan-500'} rounded-lg xs:rounded-xl sm:rounded-2xl p-2 xs:p-3 sm:p-4 md:p-6 shadow-2xl min-w-[70px] xs:min-w-[80px] sm:min-w-[110px]`}>
            <motion.div 
              className={`absolute inset-0 ${dark ? 'bg-cyan-600' : 'bg-cyan-500'} rounded-xl sm:rounded-2xl opacity-20 blur-xl`}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative z-10 text-center">
              <Flame className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-300 mx-auto mb-1 xs:mb-2" />
              <motion.div 
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1"
                key={winStreak}
                initial={{ scale: 1.3, rotate: 5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {winStreak}
              </motion.div>
              <div className="text-xs font-bold text-cyan-100 mt-1">
                現在連勝
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* AI 정보 */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className={`relative ${dark ? 'bg-purple-600' : 'bg-purple-500'} rounded-lg xs:rounded-xl sm:rounded-2xl p-2 xs:p-3 sm:p-4 md:p-6 shadow-2xl min-w-[70px] xs:min-w-[80px] sm:min-w-[110px]`}>
            <motion.div 
              className={`absolute inset-0 ${dark ? 'bg-purple-600' : 'bg-purple-500'} rounded-xl sm:rounded-2xl opacity-20 blur-xl`}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <div className="relative z-10 text-center">
              <motion.div 
                className="relative w-8 h-8 xs:w-10 xs:h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-1 xs:mb-2"
                animate={{ 
                  rotate: [0, 1, -1, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <img 
                  src={selectedAI?.avatar || '/char_1.png'} 
                  alt={selectedAI?.name || 'AI'}
                  className="w-full h-full rounded-full object-cover border-2 border-white/40 shadow-lg"
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/60"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div className="text-xs font-bold text-white">
                {selectedAI ? selectedAI.name : 'AI'}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* 최고 기록 */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className={`relative ${dark ? 'bg-yellow-600' : 'bg-yellow-500'} rounded-lg xs:rounded-xl sm:rounded-2xl p-2 xs:p-3 sm:p-4 md:p-6 shadow-2xl min-w-[70px] xs:min-w-[80px] sm:min-w-[110px]`}>
            <motion.div 
              className={`absolute inset-0 ${dark ? 'bg-yellow-600' : 'bg-yellow-500'} rounded-xl sm:rounded-2xl opacity-20 blur-xl`}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <div className="relative z-10 text-center">
              <Trophy className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white mx-auto mb-1 xs:mb-2" />
              <motion.div 
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1"
                key={bestStreak}
                initial={{ scale: 1.3, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isLoadingStreak ? (
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  bestStreak
                )}
              </motion.div>
              <div className="text-xs font-bold text-orange-100 mt-1">
                最高記録
              </div>
              {!currentUser && (
                <div className="text-xs text-white/70 mt-1">
                  ゲストプレイでは記録されません
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 연승 달성 확률 표시 */}
      <motion.div 
        className="mt-4 sm:mt-6 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className={`${dark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'} rounded-2xl px-6 py-4 shadow-xl border ${dark ? 'border-gray-700' : 'border-gray-200'} max-w-lg`}>
          <div className="text-center">
            {(() => {
              const probabilities = calculateStreakProbability(winStreak)
              return (
                <div className="grid grid-cols-2 gap-4">
                  {/* Case 1: 무승부 포함 */}
                  <motion.div 
                    className={`${dark ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-xl p-4 border ${dark ? 'border-blue-700' : 'border-blue-200'}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-center">
                      <div className={`text-xs font-medium ${dark ? 'text-blue-300' : 'text-blue-600'} mb-2`}>
                        引き分け含む
                      </div>
                      <div className={`text-2xl font-black ${dark ? 'text-blue-400' : 'text-blue-700'} mb-1`}>
                        {probabilities.case1}%
                      </div>
                      <div className={`text-xs ${dark ? 'text-blue-200' : 'text-blue-500'}`}>
                        {probabilities.case1 < 1 ? `1/${Math.round(100/probabilities.case1)}` : ''}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Case 2: 무승부 무시 */}
                  <motion.div 
                    className={`${dark ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-xl p-4 border ${dark ? 'border-purple-700' : 'border-purple-200'}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-center">
                      <div className={`text-xs font-medium ${dark ? 'text-purple-300' : 'text-purple-600'} mb-2`}>
                        引き分け無視
                      </div>
                      <div className={`text-2xl font-black ${dark ? 'text-purple-400' : 'text-purple-700'} mb-1`}>
                        {probabilities.case2}%
                      </div>
                      <div className={`text-xs ${dark ? 'text-purple-200' : 'text-purple-500'}`}>
                        {probabilities.case2 < 1 ? `1/${Math.round(100/probabilities.case2)}` : ''}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })()}
            
            {/* 하단 설명 */}
            <motion.div 
              className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'} mt-4 pt-3 border-t ${dark ? 'border-gray-700' : 'border-gray-200'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {winStreak === 0 ? (
                <span>連勝を始めてみよう！</span>
              ) : (
                <span>現在<span className={`font-bold ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}>{winStreak}</span>連勝を達成中！</span>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GameHeader
