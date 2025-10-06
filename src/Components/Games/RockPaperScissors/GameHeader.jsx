import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, Flame } from 'lucide-react'

// 연승 달성 확률 계산 함수 (AI 난이도별 + 연승에 따른 역동적 변화)
const calculateStreakProbability = (winStreak, selectedAI) => {
  // AI별 기본 플레이어 승률 (winRate는 플레이어 승률을 의미)
  const basePlayerWinRate = selectedAI ? parseFloat(selectedAI.winRate.replace('%', '')) / 100 : 0.5
  const baseAiWinRate = 1 - basePlayerWinRate // 기본 AI 승률
  
  // 연승에 따른 역동적 승률 조정
  // 연승이 길어질수록 AI가 더 강해져서 플레이어 승률이 감소
  const streakPenalty = Math.min(winStreak * 0.05, 0.4) // 최대 40%까지 감소
  const adjustedPlayerWinRate = Math.max(basePlayerWinRate - streakPenalty, 0.1) // 최소 10% 유지
  const adjustedAiWinRate = 1 - adjustedPlayerWinRate
  
  // 0연승일 때는 다음 1연승 달성 확률을 보여줌
  if (winStreak === 0) {
    return {
      case1: Math.round(adjustedPlayerWinRate * 100 * 100) / 100, // 조정된 플레이어 승률
      case2: Math.round(adjustedPlayerWinRate * 100), // 무승부 무시
      description: "1連勝達成確率",
      aiWinRate: Math.round(adjustedAiWinRate * 100)
    }
  }
  
  // 연승 달성 확률 계산 (조정된 승률 기반)
  const case1Probability = Math.pow(adjustedPlayerWinRate, winStreak) * 100
  
  return {
    case1: Math.round(case1Probability * 100) / 100, // 소수점 2자리까지
    case2: Math.round(case1Probability * 100) / 100, // 동일한 계산
    description: winStreak === 1 ? "1連勝達成！" : `${winStreak}連勝達成！`,
    aiWinRate: Math.round(adjustedAiWinRate * 100)
  }
}

const GameHeader = ({ winStreak, bestStreak, totalPoints, dark, playerNickname, selectedAI, onChangeAI, currentUser, isLoadingStreak, playerChoice, aiChoice }) => {
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
        className="flex flex-wrap justify-center items-center gap-2 xs:gap-3 sm:gap-6 md:gap-8"
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
        
        {/* 포인트 */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className={`relative ${dark ? 'bg-green-600' : 'bg-green-500'} rounded-lg xs:rounded-xl sm:rounded-2xl p-2 xs:p-3 sm:p-4 md:p-6 shadow-2xl min-w-[70px] xs:min-w-[80px] sm:min-w-[110px]`}>
            <motion.div 
              className={`absolute inset-0 ${dark ? 'bg-green-600' : 'bg-green-500'} rounded-xl sm:rounded-2xl opacity-20 blur-xl`}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <div className="relative z-10 text-center">
              <motion.div 
                className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mx-auto mb-1 xs:mb-2"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⭐
              </motion.div>
              <motion.div 
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1"
                key={totalPoints}
                initial={{ scale: 1.3, rotate: 5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {totalPoints}
              </motion.div>
              <div className="text-xs font-bold text-green-100">
                ポイント
                {winStreak >= 3 && (
                  <div className="text-xs text-yellow-300 mt-1">
                    +{Math.floor(winStreak / 3)}ボーナス
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* AI 정보 */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className={`relative ${selectedAI ? selectedAI.color : (dark ? 'bg-purple-600' : 'bg-purple-500')} rounded-lg xs:rounded-xl sm:rounded-2xl p-2 xs:p-3 sm:p-4 md:p-6 shadow-2xl min-w-[70px] xs:min-w-[80px] sm:min-w-[110px]`}>
            <motion.div 
              className={`absolute inset-0 ${selectedAI ? selectedAI.color : (dark ? 'bg-purple-600' : 'bg-purple-500')} rounded-xl sm:rounded-2xl opacity-20 blur-xl`}
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
              const probabilities = calculateStreakProbability(winStreak, selectedAI)
              return (
                <div className="grid grid-cols-2 gap-4">
                  {/* AI 승률 */}
                  <motion.div 
                    className={`${dark ? 'bg-red-900/30' : 'bg-red-50'} rounded-xl p-4 border ${dark ? 'border-red-700' : 'border-red-200'}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-center">
                      <div className={`text-xs font-medium ${dark ? 'text-red-300' : 'text-red-600'} mb-2`}>
                        AI勝利確率
                      </div>
                      <div className={`text-lg font-black ${dark ? 'text-red-400' : 'text-red-700'} mb-1`}>
                        {probabilities.aiWinRate}%
                      </div>
                      <div className={`text-xs ${dark ? 'text-red-200' : 'text-red-500'}`}>
                        {selectedAI ? selectedAI.name : 'AI'}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* 플레이어 승률 */}
                  <motion.div 
                    className={`${dark ? 'bg-green-900/30' : 'bg-green-50'} rounded-xl p-4 border ${dark ? 'border-green-700' : 'border-green-200'}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-center">
                      <div className={`text-xs font-medium ${dark ? 'text-green-300' : 'text-green-600'} mb-2`}>
                        あなたの勝利確率
                      </div>
                      <div className={`text-lg font-black ${dark ? 'text-green-400' : 'text-green-700'} mb-1`}>
                        {probabilities.case1}%
                      </div>
                      <div className={`text-xs ${dark ? 'text-green-200' : 'text-green-500'}`}>
                        {probabilities.case1 < 1 ? `1/${Math.round(100/probabilities.case1)}` : ''}
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
