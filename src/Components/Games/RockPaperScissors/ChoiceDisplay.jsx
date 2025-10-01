import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { FaHandRock, FaHandPaper, FaHandScissors } from 'react-icons/fa'

const ChoiceDisplay = ({ choice, isPlaying, dark, isAI = false }) => {
  const getChoiceIcon = (choice) => {
    switch (choice) {
      case 'rock':
        return <FaHandRock className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
      case 'paper':
        return <FaHandPaper className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
      case 'scissors':
        return <FaHandScissors className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
      default:
        return <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
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
    }
  }

  const getChoiceColor = (choice) => {
    switch (choice) {
      case 'rock':
        return 'bg-red-500'
      case 'paper':
        return 'bg-cyan-500'
      case 'scissors':
        return 'bg-green-500'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <motion.div 
      className={`relative flex flex-col items-center justify-center w-16 h-16 xs:w-20 xs:h-20 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-xl xs:rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 ${
        choice 
          ? `${getChoiceColor(choice)} border-transparent shadow-2xl` 
          : dark 
            ? 'border-gray-600 bg-gray-800/50' 
            : 'border-gray-300 bg-gray-100/50'
      }`}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      animate={choice ? { 
        boxShadow: [
          '0 0 0 0 rgba(59, 130, 246, 0.4)',
          '0 0 0 10px rgba(59, 130, 246, 0)',
          '0 0 0 0 rgba(59, 130, 246, 0)'
        ]
      } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {/* 배경 글로우 효과 */}
      {choice && (
        <motion.div
          className={`absolute inset-0 rounded-3xl ${getChoiceColor(choice)} opacity-20 blur-xl`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* 아이콘 */}
      <motion.div 
        className="relative z-10 text-white mb-1 sm:mb-2 md:mb-3"
        animate={isPlaying && !choice ? { 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ duration: 0.5, repeat: isPlaying && !choice ? Infinity : 0 }}
      >
        {isPlaying && !choice ? (
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-3xl xs:text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-cyan-400">?</span>
          </motion.div>
        ) : choice ? (
          getChoiceIcon(choice)
        ) : (
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-3xl xs:text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-cyan-400">?</span>
          </motion.div>
        )}
      </motion.div>
      
      {/* 텍스트 */}
      <motion.div 
        className={`text-xs font-bold transition-all duration-300 ${
          choice ? 'text-white' : (dark ? 'text-gray-400' : 'text-gray-600')
        }`}
        animate={choice ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 0.5, repeat: choice ? Infinity : 0 }}
      >
        {isPlaying && !choice ? '選択中...' : getChoiceText(choice)}
      </motion.div>
    </motion.div>
  )
}

export default ChoiceDisplay
