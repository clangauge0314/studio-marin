import React from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Play } from 'lucide-react'
import { FaHandRock, FaHandPaper, FaHandScissors } from 'react-icons/fa'

const GameControls = ({ onPlayerChoice, isPlaying, onReset, onPlayAgain, hasResult, dark, isGameOver, onStartNewGame, isCooldown }) => {
  const choices = [
    { value: 'rock', label: 'グー', icon: FaHandRock, color: 'bg-red-500' },
    { value: 'paper', label: 'パー', icon: FaHandPaper, color: 'bg-cyan-500' },
    { value: 'scissors', label: 'チョキ', icon: FaHandScissors, color: 'bg-green-500' }
  ]

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      {/* 선택 버튼들 */}
      <motion.div 
        className="flex justify-center space-x-4 sm:space-x-6 md:space-x-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {choices.map((choice, index) => {
          const IconComponent = choice.icon
          return (
            <motion.button
              key={choice.value}
              onClick={() => onPlayerChoice(choice.value)}
              disabled={isPlaying || isCooldown || isGameOver}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center transform ${
                isPlaying || isCooldown || isGameOver
                  ? dark
                    ? 'border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed scale-95'
                    : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed scale-95'
                  : `border-transparent ${choice.color} text-white hover:scale-110 hover:shadow-2xl cursor-pointer`
              }`}
              whileHover={!isPlaying && !isCooldown && !isGameOver ? { 
                scale: 1.1, 
                rotateY: 10,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              } : {}}
              whileTap={!isPlaying && !isCooldown && !isGameOver ? { scale: 0.95 } : {}}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.9 + index * 0.1,
                type: "spring",
                stiffness: 100
              }}
            >
              {/* 배경 글로우 효과 */}
              {!isPlaying && !isCooldown && !isGameOver && (
                <motion.div
                  className={`absolute inset-0 rounded-3xl ${choice.color} opacity-20 blur-xl`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                />
              )}
      
              <motion.div 
                className="relative z-10"
                animate={isPlaying ? { 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
              >
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-1 sm:mb-2" />
              </motion.div>
              
              <span className="text-xs sm:text-sm font-bold">
                {isPlaying ? '選択中...' : isCooldown ? 'クールダウン中...' : isGameOver ? 'ゲーム終了' : choice.label}
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* 액션 버튼들 */}
      <motion.div 
        className="flex justify-center space-x-4 sm:space-x-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        {isGameOver ? (
          <motion.button
            onClick={onStartNewGame}
            className={`relative ${dark ? 'bg-cyan-600' : 'bg-cyan-500'} text-white px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2`}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(6, 182, 212, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
            <span>新しいゲーム</span>
          </motion.button>
        ) : (
          <>
            {hasResult && (
              <motion.button
                onClick={onPlayAgain}
                className={`relative ${dark ? 'bg-green-600' : 'bg-green-500'} text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2`}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(34, 197, 94, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
                <span>次へ</span>
              </motion.button>
            )}
            
            <motion.button
              onClick={onReset}
              className={`relative ${dark ? 'bg-gray-600' : 'bg-gray-500'} text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2`}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(107, 114, 128, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              <span>リセット</span>
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

export default GameControls
