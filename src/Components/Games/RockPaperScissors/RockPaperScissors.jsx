import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useDarkModeStore from '../../../Store/useDarkModeStore'
import { useAuth } from '../../../Contexts/AuthContext'
import GameHeader from './GameHeader'
import GameArea from './GameArea'
import GameControls from './GameControls'
import GameResult from './GameResult'

const RockPaperScissors = () => {
  const { dark } = useDarkModeStore()
  const { userProfile } = useAuth()
  const [gameState, setGameState] = useState({
    playerChoice: null,
    aiChoice: null,
    result: null,
    score: { player: 0, ai: 0 },
    isPlaying: false
  })

  const handlePlayerChoice = (choice) => {
    if (gameState.isPlaying) return
    
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
        const newScore = { ...prev.score }
        
        if (result === 'player') newScore.player++
        else if (result === 'ai') newScore.ai++
        
        return {
          ...prev,
          aiChoice,
          result,
          score: newScore,
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
      score: { player: 0, ai: 0 },
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

  return (
    <motion.div 
      className={`w-full max-w-4xl mx-auto p-4 ${dark ? 'text-white' : 'text-gray-900'}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <GameHeader 
          score={gameState.score}
          dark={dark}
        />
      </motion.div>
      
      <motion.div 
        className="grid grid-rows-2 gap-6 h-[70vh] min-h-[500px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* 상단: 게임 영역 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GameArea
            playerChoice={gameState.playerChoice}
            aiChoice={gameState.aiChoice}
            isPlaying={gameState.isPlaying}
            dark={dark}
          />
        </motion.div>
        
        {/* 하단: 컨트롤 및 결과 */}
        <motion.div 
          className="flex flex-col justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {gameState.result && (
              <motion.div
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
                />
              </motion.div>
            )}
          </AnimatePresence>
          
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
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default RockPaperScissors
