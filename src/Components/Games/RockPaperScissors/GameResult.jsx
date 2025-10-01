import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Sparkles, Star, Flame } from 'lucide-react'

const GameResult = ({ result, playerChoice, aiChoice, dark, isGameOver, winStreak, bestStreak, selectedAI }) => {
  const getResultMessage = () => {
    if (!result) return null
    
    if (isGameOver) {
      // 높은 연승에서 패배 시 더 절망적인 색상
      const isDramaticLoss = winStreak >= 5
      return {
        text: '負けました！',
        subtitle: `最終連勝: ${winStreak}回`,
        bestRecord: bestStreak,
        color: isDramaticLoss ? (dark ? 'bg-gray-800' : 'bg-gray-700') : (dark ? 'bg-gray-600' : 'bg-gray-500'),
        icon: Flame,
        bgColor: isDramaticLoss ? (dark ? 'bg-gray-800' : 'bg-gray-700') : (dark ? 'bg-gray-600' : 'bg-gray-500'),
        isDramatic: isDramaticLoss
      }
    }
    
    switch (result) {
      case 'player':
        return { 
          text: '勝利！', 
          subtitle: `${winStreak}連勝継続中`,
          color: dark ? 'bg-green-600' : 'bg-green-500',
          icon: Trophy,
          bgColor: dark ? 'bg-green-600' : 'bg-green-500'
        }
      case 'ai':
        return { 
          text: `${selectedAI?.name || 'AI'}の勝利！`, 
          subtitle: '連勝終了',
          color: dark ? 'bg-red-600' : 'bg-red-500',
          icon: Flame,
          bgColor: dark ? 'bg-red-600' : 'bg-red-500'
        }
      case 'tie':
        return { 
          text: '引き分け！', 
          subtitle: '連勝は継続',
          color: dark ? 'bg-yellow-600' : 'bg-yellow-500',
          icon: Star,
          bgColor: dark ? 'bg-yellow-600' : 'bg-yellow-500'
        }
      default:
        return null
    }
  }

  const getChoiceText = (choice) => {
    switch (choice) {
      case 'rock':
        return 'グー'
      case 'paper':
        return 'パー'
      case 'scissors':
        return 'チョキ'
      default:
        return choice
    }
  }

  const resultMessage = getResultMessage()

  if (!resultMessage) {
    return (
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-cyan-500 mx-auto mb-4" />
        </motion.div>
        <p className={`text-base sm:text-lg md:text-xl font-bold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>グー、パー、チョキの中から選んでください！</p>
      </motion.div>
    )
  }

  const IconComponent = resultMessage.icon

  return (
    <motion.div 
      className="text-center py-8"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        type: "spring",
        stiffness: 100
      }}
    >
      <motion.div 
        className={`relative block w-full max-w-md mx-auto ${resultMessage.bgColor} rounded-2xl sm:rounded-3xl px-12 py-8 sm:px-12 sm:py-12 md:px-16 md:py-16 shadow-2xl ${
          resultMessage.isDramatic ? 'border-2 border-red-500' : ''
        }`}
        animate={resultMessage.isDramatic ? { 
          boxShadow: [
            '0 0 0 0 rgba(239, 68, 68, 0.7)',
            '0 0 0 30px rgba(239, 68, 68, 0)',
            '0 0 0 0 rgba(239, 68, 68, 0)'
          ],
          scale: [1, 1.02, 1]
        } : { 
          boxShadow: [
            '0 0 0 0 rgba(59, 130, 246, 0.4)',
            '0 0 0 20px rgba(59, 130, 246, 0)',
            '0 0 0 0 rgba(59, 130, 246, 0)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* 배경 글로우 효과 */}
        <motion.div
          className={`absolute inset-0 ${resultMessage.bgColor} rounded-3xl opacity-20 blur-2xl`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <IconComponent className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white mx-auto mb-3 sm:mb-4" />
          </motion.div>
          
          <motion.h3 
            className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6 tracking-wider whitespace-nowrap"
            animate={{ 
              textShadow: [
                '0 0 0 rgba(255,255,255,0)',
                '0 0 20px rgba(255,255,255,0.8)',
                '0 0 0 rgba(255,255,255,0)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {resultMessage.text}
          </motion.h3>
          
          <motion.p
            className="text-white/90 text-lg sm:text-xl font-bold mb-6 sm:mb-8 tracking-wide whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {resultMessage.subtitle}
          </motion.p>
          
          {isGameOver && resultMessage.bestRecord !== undefined && (
            <motion.div
              className="text-white/80 text-base sm:text-lg font-medium border-t border-white/30 pt-4 sm:pt-6 mt-4 sm:mt-6 tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="flex items-center justify-center space-x-2 whitespace-nowrap">
                <Trophy className="w-5 h-5" />
                <span>最高記録: {resultMessage.bestRecord}連勝</span>
              </p>
            </motion.div>
          )}
          
          {playerChoice && aiChoice && (
            <motion.div 
              className="text-white/70 text-sm sm:text-base font-medium mt-4 sm:mt-6 tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="whitespace-nowrap">
                {getChoiceText(playerChoice)} vs {selectedAI?.name || 'AI'}: {getChoiceText(aiChoice)}
              </p>
              {isGameOver && (
                <motion.p 
                  className="text-white/60 text-xs sm:text-sm font-medium mt-2 whitespace-nowrap"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  最後の選択: {getChoiceText(playerChoice)}
                </motion.p>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GameResult
