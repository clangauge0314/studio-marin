import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  RotateCcw, 
  Play, 
  Sparkles, 
  Crown,
  Star,
  Flame
} from 'lucide-react'
import { FaHandRock, FaHandPaper, FaHandScissors } from 'react-icons/fa'
import useDarkModeStore from '../../../Store/useDarkModeStore'
import { useAuth } from '../../../Contexts/AuthContext'

// ChoiceDisplay 컴포넌트
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
      default:
        return '選択してください'
    }
  }

  const getChoiceColor = (choice) => {
    switch (choice) {
      case 'rock':
        return 'from-red-500 to-orange-500'
      case 'paper':
        return 'from-cyan-500 to-blue-500'
      case 'scissors':
        return 'from-green-500 to-emerald-500'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  return (
    <motion.div 
      className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 ${
        choice 
          ? `bg-gradient-to-br ${getChoiceColor(choice)} border-transparent shadow-2xl` 
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
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${getChoiceColor(choice)} opacity-20 blur-xl`}
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
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-cyan-500" />
          </motion.div>
        ) : (
          getChoiceIcon(choice)
        )}
      </motion.div>
      
      {/* 텍스트 */}
      <motion.div 
        className={`text-xs sm:text-sm font-bold transition-all duration-300 ${
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

// GameHeader 컴포넌트
const GameHeader = ({ winStreak, bestStreak, dark, playerNickname, selectedAI, onChangeAI }) => {
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
          className={`text-2xl sm:text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent`}
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 3, repeat: Infinity }}
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
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
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
        className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* 현재 연승 */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl min-w-[90px] sm:min-w-[110px]">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl sm:rounded-2xl opacity-20 blur-xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative z-10 text-center">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-300 mx-auto mb-2" />
              <motion.div 
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1"
                key={winStreak}
                initial={{ scale: 1.3, rotate: 5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {winStreak}
              </motion.div>
              <div className="text-xs sm:text-sm font-bold text-cyan-100 mt-1">
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
          <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl min-w-[90px] sm:min-w-[110px]">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl opacity-20 blur-xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <div className="relative z-10 text-center">
              <div className="text-3xl sm:text-4xl mb-2">{selectedAI?.avatar || '🤖'}</div>
              <div className="text-xs sm:text-sm font-bold text-white">
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
          <div className="relative bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl min-w-[90px] sm:min-w-[110px]">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl sm:rounded-2xl opacity-20 blur-xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <div className="relative z-10 text-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white mx-auto mb-2" />
              <motion.div 
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1"
                key={bestStreak}
                initial={{ scale: 1.3, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {bestStreak}
              </motion.div>
              <div className="text-xs sm:text-sm font-bold text-orange-100 mt-1">
                最高記録
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// GameArea 컴포넌트
const GameArea = ({ playerChoice, aiChoice, isPlaying, dark, playerNickname }) => {
  return (
    <motion.div 
      className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 bg-transparent rounded-lg p-2 sm:p-4 md:p-6"
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
          className="relative mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 shadow-xl">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl sm:rounded-2xl opacity-20 blur-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative z-10 flex items-center space-x-2">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">{playerNickname || 'ゲスト'}</h3>
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
          className="relative mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 shadow-xl">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl opacity-20 blur-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <div className="relative z-10 flex items-center space-x-2">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" />
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">AI</h3>
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

// GameResult 컴포넌트
const GameResult = ({ result, playerChoice, aiChoice, dark, isGameOver, winStreak, bestStreak }) => {
  const getResultMessage = () => {
    if (!result) return null
    
    if (isGameOver) {
      // 높은 연승에서 패배 시 더 절망적인 색상
      const isDramaticLoss = winStreak >= 5
      return {
        text: 'ゲーム終了！',
        subtitle: `最終連勝: ${winStreak}回`,
        bestRecord: bestStreak,
        color: isDramaticLoss ? 'from-gray-800 to-gray-900' : 'from-gray-600 to-gray-700',
        icon: Flame,
        bgColor: isDramaticLoss ? 'from-gray-800 to-black' : 'from-gray-600 to-gray-800',
        isDramatic: isDramaticLoss
      }
    }
    
    switch (result) {
      case 'player':
        return { 
          text: '連勝継続中！', 
          subtitle: `${winStreak}連勝`,
          color: 'from-green-500 to-emerald-500',
          icon: Trophy,
          bgColor: 'from-green-500 to-emerald-600'
        }
      case 'tie':
        return { 
          text: '引き分け！', 
          subtitle: '連勝は継続',
          color: 'from-yellow-500 to-orange-500',
          icon: Star,
          bgColor: 'from-yellow-500 to-orange-600'
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
        className={`relative inline-block bg-gradient-to-br ${resultMessage.bgColor} rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl ${
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
          className={`absolute inset-0 bg-gradient-to-br ${resultMessage.bgColor} rounded-3xl opacity-20 blur-2xl`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <div className="relative z-10">
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
            className="text-2xl sm:text-3xl font-black text-white mb-2"
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
            className="text-white/90 text-lg sm:text-xl font-bold mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {resultMessage.subtitle}
          </motion.p>
          
          {isGameOver && resultMessage.bestRecord !== undefined && (
            <motion.div
              className="text-white/80 text-base sm:text-lg font-medium border-t border-white/30 pt-3 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="flex items-center justify-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>最高記録: {resultMessage.bestRecord}連勝</span>
              </p>
            </motion.div>
          )}
          
          {playerChoice && aiChoice && (
            <motion.div 
              className="text-white/70 text-sm sm:text-base font-medium mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p>
                {getChoiceText(playerChoice)} vs {getChoiceText(aiChoice)}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// GameControls 컴포넌트
const GameControls = ({ onPlayerChoice, isPlaying, onReset, onPlayAgain, hasResult, dark, isGameOver, onStartNewGame }) => {
  const choices = [
    { value: 'rock', label: 'グー', icon: FaHandRock, color: 'from-red-500 to-orange-500' },
    { value: 'paper', label: 'パー', icon: FaHandPaper, color: 'from-cyan-500 to-blue-500' },
    { value: 'scissors', label: 'チョキ', icon: FaHandScissors, color: 'from-green-500 to-emerald-500' }
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
              disabled={isPlaying}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center transform ${
                isPlaying
                  ? dark
                    ? 'border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed scale-95'
                    : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed scale-95'
                  : `border-transparent bg-gradient-to-br ${choice.color} text-white hover:scale-110 hover:shadow-2xl cursor-pointer`
              }`}
              whileHover={!isPlaying ? { 
                scale: 1.1, 
                rotateY: 10,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              } : {}}
              whileTap={!isPlaying ? { scale: 0.95 } : {}}
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
              {!isPlaying && (
                <motion.div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${choice.color} opacity-20 blur-xl`}
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
                {isPlaying ? '選択中...' : choice.label}
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
            className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
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
                className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
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
              className="relative bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
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

// AI 캐릭터 데이터
const AI_CHARACTERS = [
  {
    id: 1,
    name: 'ロボ丸',
    difficulty: '簡単',
    winRate: '30%',
    avatar: '🤖',
    color: 'from-blue-500 to-cyan-500',
    description: '初心者向けAI'
  },
  {
    id: 2,
    name: 'サムライ',
    difficulty: '普通',
    winRate: '50%',
    avatar: '⚔️',
    color: 'from-purple-500 to-pink-500',
    description: 'バランスタイプ'
  },
  {
    id: 3,
    name: 'マスター',
    difficulty: '難しい',
    winRate: '70%',
    avatar: '👑',
    color: 'from-orange-500 to-red-500',
    description: '上級者向けAI'
  },
  {
    id: 4,
    name: 'レジェンド',
    difficulty: '超難しい',
    winRate: '90%',
    avatar: '⭐',
    color: 'from-yellow-500 to-orange-500',
    description: '最強のAI'
  }
]

// AI 선택 화면 컴포넌트
const AISelectionScreen = ({ onSelectAI, dark }) => {
  console.log('AISelectionScreen 렌더링, dark:', dark)
  return (
    <motion.div
      className={`relative w-full h-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl py-8 sm:py-12 ${
        dark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-full blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl"
          animate={{ 
            x: [0, -20, 0],
            y: [0, 10, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-8 space-y-8 sm:space-y-12">
        {/* 타이틀 */}
        <motion.div
          className="text-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            AI対戦相手を選択
          </motion.h2>
          <p className={`text-base sm:text-lg md:text-xl ${dark ? 'text-gray-300' : 'text-gray-600'}`}>挑戦するAIを選んでください</p>
        </motion.div>

        {/* AI 캐릭터 그리드 */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {AI_CHARACTERS.map((ai, index) => (
            <motion.div
              key={ai.id}
              className="relative cursor-pointer w-full"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectAI(ai)}
            >
              <div className={`relative bg-gradient-to-br ${ai.color} rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 px-12 sm:px-8 md:px-10 shadow-2xl overflow-hidden`}>
                {/* 글로우 효과 */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${ai.color} rounded-2xl sm:rounded-3xl opacity-20 blur-xl`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
                
                <div className="relative z-10 text-center">
                  {/* 아바타 */}
                  <motion.div 
                    className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {ai.avatar}
                  </motion.div>
                  
                  {/* 이름 */}
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{ai.name}</h3>
                  
                  {/* 설명 */}
                  <p className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3">{ai.description}</p>
                  
                  {/* 난이도 & 승률 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-2">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                      <span className="text-xs sm:text-sm font-bold text-white">{ai.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                      <span className="text-xs sm:text-sm font-bold text-white">勝率: {ai.winRate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

// 메인 RockPaperScissors 컴포넌트
const RockPaperScissors = () => {
  console.log('=== RockPaperScissors 시작 ===')
  
  try {
    const { dark } = useDarkModeStore()
    console.log('✅ dark store 로드 성공:', dark)
    
    const { userProfile } = useAuth()
    console.log('✅ auth context 로드 성공:', userProfile)
    
    const [selectedAI, setSelectedAI] = useState(null)
    console.log('✅ selectedAI state 생성 성공')
    
    const [gameState, setGameState] = useState({
      playerChoice: null,
      aiChoice: null,
      result: null,
      winStreak: 0,
      bestStreak: 0,
      isGameOver: false,
      isPlaying: false
    })
    console.log('✅ gameState 생성 성공:', gameState)

  const handlePlayerChoice = (choice) => {
    if (gameState.isPlaying || gameState.isGameOver) return
    
    setGameState(prev => ({
      ...prev,
      playerChoice: choice,
      isPlaying: true
    }))

    // AI 선택 (랜덤)
    setTimeout(() => {
      const choices = ['rock', 'paper', 'scissors']
      const aiChoice = choices[Math.floor(Math.random() * choices.length)]
      
      setGameState(prev => {
        const result = determineWinner(choice, aiChoice)
        let newWinStreak = prev.winStreak
        let newBestStreak = prev.bestStreak
        let isGameOver = false
        
        if (result === 'player') {
          // 승리 시 연승 증가
          newWinStreak++
          if (newWinStreak > newBestStreak) {
            newBestStreak = newWinStreak
          }
        } else if (result === 'ai') {
          // 패배 시 게임 종료
          isGameOver = true
          if (prev.winStreak > newBestStreak) {
            newBestStreak = prev.winStreak
          }
        }
        // 무승부(tie)는 연승 유지하고 계속 진행
        
        return {
          ...prev,
          aiChoice,
          result,
          winStreak: isGameOver ? prev.winStreak : newWinStreak,
          bestStreak: newBestStreak,
          isGameOver,
          isPlaying: false
        }
      })
    }, 1000)
  }

  const determineWinner = (player, ai) => {
    if (player === ai) return 'tie'
    
    const winConditions = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    }
    
    return winConditions[player] === ai ? 'player' : 'ai'
  }

  const resetGame = () => {
    setGameState({
      playerChoice: null,
      aiChoice: null,
      result: null,
      winStreak: 0,
      bestStreak: gameState.bestStreak, // 최고 기록은 유지
      isGameOver: false,
      isPlaying: false
    })
  }

  const playAgain = () => {
    setGameState(prev => ({
      ...prev,
      playerChoice: null,
      aiChoice: null,
      result: null,
      isPlaying: false
    }))
  }

  const startNewGame = () => {
    setGameState({
      playerChoice: null,
      aiChoice: null,
      result: null,
      winStreak: 0,
      bestStreak: 0,
      isGameOver: false,
      isPlaying: false
    })
  }

  // 결과 자동 숨김 효과 (게임 오버가 아닐 때만)
  useEffect(() => {
    if (gameState.result && !gameState.isGameOver) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          result: null,
          playerChoice: null,
          aiChoice: null
        }))
      }, 2000) // 2초 후 자동으로 사라짐
      
      return () => clearTimeout(timer)
    }
  }, [gameState.result, gameState.isGameOver])

  // AI 선택 핸들러
  const handleSelectAI = (ai) => {
    setSelectedAI(ai)
  }

  // AI 변경 핸들러
  const handleChangeAI = () => {
    setSelectedAI(null)
    resetGame()
  }

    // AI가 선택되지 않았으면 선택 화면 표시
    if (!selectedAI) {
      console.log('✅ AI 선택 화면 렌더링 시작')
      return (
        <motion.div 
          className={`w-full max-w-6xl mx-auto ${dark ? 'text-white' : 'text-gray-900'}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AISelectionScreen onSelectAI={handleSelectAI} dark={dark} />
        </motion.div>
      )
    }

    console.log('✅ 게임 화면 렌더링 시작')
    return (
    <motion.div 
      className={`w-full max-w-4xl mx-auto ${dark ? 'text-white' : 'text-gray-900'}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 게임 캔버스 */}
      <motion.div
        className={`relative w-full h-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl py-6 sm:py-8 ${
          dark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <motion.div 
            className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-full blur-3xl"
            animate={{ 
              x: [0, 20, 0],
              y: [0, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-2xl"
            animate={{ 
              x: [0, -15, 0],
              y: [0, 15, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </div>

        {/* 컨텐츠 영역 - Flexbox로 변경 */}
        <div className="relative z-10 flex flex-col px-4 sm:px-6 space-y-4 sm:space-y-6">
          {/* 게임 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GameHeader 
              winStreak={gameState.winStreak}
              bestStreak={gameState.bestStreak}
              dark={dark}
              playerNickname={userProfile?.nickname}
              selectedAI={selectedAI}
              onChangeAI={handleChangeAI}
            />
          </motion.div>
          
          {/* 게임 영역 */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GameArea 
              playerChoice={gameState.playerChoice}
              aiChoice={gameState.aiChoice}
              isPlaying={gameState.isPlaying}
              dark={dark}
              playerNickname={userProfile?.nickname}
            />
            
            {/* 결과 영역 - 게임 영역 위에 오버레이 */}
            <AnimatePresence mode="wait">
              {gameState.result && (
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                  key={gameState.result}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <GameResult
                    result={gameState.result}
                    playerChoice={gameState.playerChoice}
                    aiChoice={gameState.aiChoice}
                    dark={dark}
                    isGameOver={gameState.isGameOver}
                    winStreak={gameState.winStreak}
                    bestStreak={gameState.bestStreak}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* 컨트롤 영역 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <GameControls
              onPlayerChoice={handlePlayerChoice}
              isPlaying={gameState.isPlaying}
              onReset={resetGame}
              onPlayAgain={playAgain}
              hasResult={gameState.result !== null}
              dark={dark}
              isGameOver={gameState.isGameOver}
              onStartNewGame={startNewGame}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
    )
  } catch (error) {
    console.error('❌ RockPaperScissors 에러:', error)
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">에러 발생!</h1>
        <p className="text-gray-600 mt-4">{error.toString()}</p>
      </div>
    )
  }
}

export default RockPaperScissors
