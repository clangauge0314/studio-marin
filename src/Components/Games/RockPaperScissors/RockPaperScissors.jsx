import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import useDarkModeStore from '../../../Store/useDarkModeStore'
import { useAuth } from '../../../Contexts/AuthContext'

// 컴포넌트 imports
import GameHeader from './GameHeader'
import GameArea from './GameArea'
import GameResult from './GameResult'
import GameControls from './GameControls'
import AISelectionScreen from './AISelectionScreen'

// 메인 RockPaperScissors 컴포넌트
const RockPaperScissors = () => {
  const { dark } = useDarkModeStore()
  const { currentUser, userProfile } = useAuth()
  
  const [selectedAI, setSelectedAI] = useState(null)
  const [userBestStreak, setUserBestStreak] = useState(0)
  const [isLoadingStreak, setIsLoadingStreak] = useState(true)
  
  const [gameState, setGameState] = useState({
    playerChoice: null,
    aiChoice: null,
    result: null,
    winStreak: 0,
    bestStreak: 0,
    isGameOver: false,
    isPlaying: false,
    isCooldown: false
  })

  // 사용자의 최고 연승기록을 Firestore에서 가져오기
  const loadUserBestStreak = async () => {
    if (!currentUser) {
      setUserBestStreak(0)
      setIsLoadingStreak(false)
      return
    }

    try {
      const userDocRef = doc(db, 'userStreaks', currentUser.email)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        setUserBestStreak(data.bestStreak || 0)
        setGameState(prev => ({
          ...prev,
          bestStreak: data.bestStreak || 0
        }))
      } else {
        setUserBestStreak(0)
        setGameState(prev => ({
          ...prev,
          bestStreak: 0
        }))
      }
    } catch (error) {
      console.error('최고 연승기록 로드 실패:', error)
      // 게스트 유저가 아닐 때만 에러 메시지 표시
      if (currentUser && !currentUser.isAnonymous) {
        toast.error('最高連勝記録の読み込みに失敗しました')
      }
    } finally {
      setIsLoadingStreak(false)
    }
  }

  // 최고 연승기록을 Firestore에 저장/업데이트
  const updateUserBestStreak = async (newBestStreak) => {
    if (!currentUser) return

    try {
      const userDocRef = doc(db, 'userStreaks', currentUser.email)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        // 기존 문서 업데이트
        await updateDoc(userDocRef, {
          bestStreak: newBestStreak,
          updatedAt: new Date()
        })
      } else {
        // 새 문서 생성
        await setDoc(userDocRef, {
          bestStreak: newBestStreak,
          email: currentUser.email,
          nickname: userProfile?.nickname || 'ユーザー',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      
      setUserBestStreak(newBestStreak)
      toast.success(`新しい最高記録: ${newBestStreak}連勝！`)
    } catch (error) {
      console.error('최고 연승기록 저장 실패:', error)
      // 게스트 유저가 아닐 때만 에러 메시지 표시
      if (currentUser && !currentUser.isAnonymous) {
        toast.error('最高連勝記録の保存に失敗しました')
      }
    }
  }

  const handlePlayerChoice = (choice) => {
    if (gameState.isPlaying || gameState.isGameOver || gameState.isCooldown) return
    
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
        
        // 로그인된 사용자이고 새로운 최고 기록을 달성한 경우 DB 업데이트
        if (currentUser && newBestStreak > userBestStreak) {
          updateUserBestStreak(newBestStreak)
        }
        
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
      bestStreak: userBestStreak, // 최고 기록은 유지
      isGameOver: false,
      isPlaying: false,
      isCooldown: false
    })
  }

  const playAgain = () => {
    setGameState(prev => ({
      ...prev,
      playerChoice: null,
      aiChoice: null,
      result: null,
      isPlaying: false,
      isCooldown: false
    }))
  }

  const startNewGame = () => {
    setGameState({
      playerChoice: null,
      aiChoice: null,
      result: null,
      winStreak: 0,
      bestStreak: userBestStreak,
      isGameOver: false,
      isPlaying: false,
      isCooldown: false
    })
  }

  // 컴포넌트 마운트 시 사용자 최고 연승기록 로드
  useEffect(() => {
    loadUserBestStreak()
  }, [currentUser])

  // 결과 자동 숨김 효과
  useEffect(() => {
    if (gameState.result) {
      if (gameState.result === 'player') {
        // 승리 시 4초 후 사라짐
        setGameState(prev => ({ ...prev, isCooldown: true }))
        
        const timer = setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            result: null,
            playerChoice: null,
            aiChoice: null,
            isCooldown: false
          }))
        }, 4000) // 4초 후 자동으로 사라짐
        
        return () => clearTimeout(timer)
      } else if (gameState.result === 'tie') {
        // 무승부 시 2초 후 사라짐
        setGameState(prev => ({ ...prev, isCooldown: true }))
        
        const timer = setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            result: null,
            playerChoice: null,
            aiChoice: null,
            isCooldown: false
          }))
        }, 2000) // 2초 후 자동으로 사라짐
        
        return () => clearTimeout(timer)
      } else {
        // 게임 종료 시 2초 후 사라짐
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
              currentUser={currentUser}
              isLoadingStreak={isLoadingStreak}
              playerChoice={gameState.playerChoice}
              aiChoice={gameState.aiChoice}
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
              selectedAI={selectedAI}
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
                    selectedAI={selectedAI}
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
              isCooldown={gameState.isCooldown}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RockPaperScissors