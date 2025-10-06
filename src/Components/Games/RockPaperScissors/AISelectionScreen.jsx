import React from 'react'
import { motion } from 'framer-motion'
import { Star, Trophy } from 'lucide-react'
import { AI_CHARACTERS } from './AICharacters'

const AISelectionScreen = ({ onSelectAI, dark }) => {
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
              <div className={`relative ${ai.color} rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 px-8 sm:px-6 md:px-8 shadow-2xl overflow-hidden`}>
                {/* 글로우 효과 */}
                <motion.div
                  className={`absolute inset-0 ${ai.color} rounded-2xl sm:rounded-3xl opacity-20 blur-xl`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
        
                <div className="relative z-10 text-center">
                  {/* 아바타 */}
                  <motion.div 
                    className="relative mb-4 sm:mb-6"
                    animate={{ 
                      rotate: [0, 3, -3, 0],
                      scale: [1, 1.08, 1],
                      y: [0, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto">
                      {/* 외부 글로우 효과 */}
                      <motion.div
                        className={`absolute inset-0 ${ai.color} rounded-full opacity-30 blur-lg`}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                      />
                      
                      {/* 메인 이미지 컨테이너 */}
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/40 shadow-2xl">
                        <img 
                          src={ai.avatar} 
                          alt={ai.name}
                          className="w-full h-full object-cover object-center"
                        />
                        
                        {/* 내부 글로우 효과 */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-white/60"
                          animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.6, 0.9, 0.6]
                          }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        
                        {/* 상단 하이라이트 */}
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full" />
                      </div>
                      
                    </div>
                  </motion.div>
                  
                  {/* 이름 */}
                  <div className="mb-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-1">{ai.name}</h3>
                  </div>
                  
                  {/* 성격 */}
                  <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3 font-medium">{ai.personality}</p>
                  
                  {/* 설명 */}
                  <p className="text-xs text-white/80 mb-3">{ai.description}</p>
                  
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

export default AISelectionScreen
