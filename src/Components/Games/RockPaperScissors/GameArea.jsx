import React from 'react'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import ChoiceDisplay from './ChoiceDisplay'

const GameArea = ({ playerChoice, aiChoice, isPlaying, dark, playerNickname, selectedAI }) => {
  return (
    <motion.div 
      className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-6 md:gap-8 bg-transparent rounded-lg p-1 xs:p-2 sm:p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 플레이어 영역 */}
      <motion.div 
        className="flex flex-col items-center justify-center"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div 
          className="relative mb-3 xs:mb-4 sm:mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <div className={`relative ${dark ? 'bg-cyan-600' : 'bg-cyan-500'} rounded-lg xs:rounded-xl sm:rounded-2xl px-2 xs:px-3 sm:px-4 sm:py-2.5 md:px-6 md:py-3 py-1.5 xs:py-2 shadow-xl`}>
            <motion.div 
              className={`absolute inset-0 ${dark ? 'bg-cyan-600' : 'bg-cyan-500'} rounded-xl sm:rounded-2xl opacity-20 blur-lg`}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative z-10 flex items-center space-x-1 xs:space-x-2">
              <Crown className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-yellow-300" />
              <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-white">{playerNickname || 'ゲスト'}</h3>
            </div>
          </div>
        </motion.div>
        
        <ChoiceDisplay 
          choice={playerChoice}
          isPlaying={isPlaying}
          dark={dark}
        />
      </motion.div>
      
      {/* AI 영역 */}
      <motion.div 
        className="flex flex-col items-center justify-center"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.div 
          className="relative mb-3 xs:mb-4 sm:mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <div className={`relative ${selectedAI ? selectedAI.color : (dark ? 'bg-red-600' : 'bg-red-500')} rounded-lg xs:rounded-xl sm:rounded-2xl px-2 xs:px-3 sm:px-4 sm:py-2.5 md:px-6 md:py-3 py-1.5 xs:py-2 shadow-xl`}>
            <motion.div 
              className={`absolute inset-0 ${selectedAI ? selectedAI.color : (dark ? 'bg-red-600' : 'bg-red-500')} rounded-xl sm:rounded-2xl opacity-20 blur-lg`}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <div className="relative z-10 flex items-center space-x-1 xs:space-x-2">
              <motion.div 
                className="relative w-4 h-4 xs:w-5 xs:h-5 sm:w-7 sm:h-7 md:w-8 md:h-8"
                animate={{ 
                  rotate: [0, 2, -2, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <img 
                  src={selectedAI?.avatar || '/char_1.png'} 
                  alt={selectedAI?.name || 'AI'}
                  className="w-full h-full rounded-full object-cover border border-white/40"
                />
              </motion.div>
              <div className="flex flex-col">
                <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-white">
                  {selectedAI ? selectedAI.name : 'AI'}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>
        
        <ChoiceDisplay 
          choice={aiChoice}
          isPlaying={isPlaying}
          dark={dark}
          isAI={true}
        />
      </motion.div>
    </motion.div>
  )
}

export default GameArea
