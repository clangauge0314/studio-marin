import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react'
import useDarkModeStore from '../../../Store/useDarkModeStore'
import './MusicPlayer.css'

const MusicPlayer = ({ autoPlay = false, musicPath = '/music.mp3', isInline = false, dark: darkProp, onPlayStateChange }) => {
  const { dark: darkStore } = useDarkModeStore()
  const dark = darkProp !== undefined ? darkProp : darkStore
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.1)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.loop = true
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      const newPlayingState = !isPlaying
      setIsPlaying(newPlayingState)
      if (onPlayStateChange) {
        onPlayStateChange(newPlayingState)
      }
    }
  }

  // 외부에서 재생 제어할 수 있는 함수
  useEffect(() => {
    if (autoPlay && audioRef.current && !isPlaying) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            if (onPlayStateChange) {
              onPlayStateChange(true)
            }
          })
          .catch((error) => {
            console.log('자동 재생 실패:', error)
          })
      }
    }
  }, [autoPlay])

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <motion.div
      className={isInline ? '' : 'fixed bottom-6 right-6 z-[9999]'}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <audio ref={audioRef} src={musicPath} />
      
      <motion.div
        className={`${
          dark 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        } border rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden ${isInline ? 'w-full max-w-md mx-auto' : ''}`}
        animate={isInline ? {} : { 
          width: isExpanded ? '280px' : '64px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => !isInline && setIsExpanded(true)}
        onMouseLeave={() => !isInline && setIsExpanded(false)}
      >
        <div className="p-4">
          <div className="flex items-center space-x-3">
            {/* 재생/일시정지 버튼 */}
            <motion.button
              onClick={togglePlay}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                dark
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5" fill="currentColor" />
              )}
            </motion.button>

            {/* 확장 시 표시되는 컨트롤 */}
            <AnimatePresence>
              {(isExpanded || isInline) && (
                <motion.div
                  className="flex items-center space-x-3 flex-1"
                  initial={isInline ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={isInline ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* 음소거 버튼 */}
                  <motion.button
                    onClick={toggleMute}
                    className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                      dark
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </motion.button>

                  {/* 볼륨 슬라이더 */}
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer volume-slider"
                      style={{
                        background: `linear-gradient(to right, ${
                          dark ? '#06b6d4' : '#0891b2'
                        } 0%, ${
                          dark ? '#06b6d4' : '#0891b2'
                        } ${volume * 100}%, ${
                          dark ? '#4b5563' : '#d1d5db'
                        } ${volume * 100}%, ${
                          dark ? '#4b5563' : '#d1d5db'
                        } 100%)`
                      }}
                    />
                  </div>

                  {/* 볼륨 퍼센트 */}
                  <div className={`text-xs font-medium min-w-[32px] text-right ${
                    dark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BGM 라벨 */}
          <AnimatePresence>
            {(isExpanded || isInline) && (
              <motion.div
                className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-700"
                initial={isInline ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={isInline ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  <Music className={`w-3 h-3 ${dark ? 'text-cyan-400' : 'text-cyan-500'}`} />
                  <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                    ゲームBGM
                  </span>
                  <motion.div
                    className={`ml-auto w-2 h-2 rounded-full ${
                      isPlaying 
                        ? 'bg-green-500' 
                        : 'bg-gray-400'
                    }`}
                    animate={isPlaying ? {
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 호버 힌트 (축소 상태일 때만, inline이 아닐 때만) */}
      {!isInline && !isExpanded && (
        <motion.div
          className={`absolute bottom-full right-0 mb-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg ${
            dark 
              ? 'bg-gray-900 text-white border border-gray-700' 
              : 'bg-gray-800 text-white'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          BGMプレイヤー
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            dark ? 'border-t-gray-900' : 'border-t-gray-800'
          }`} />
        </motion.div>
      )}
    </motion.div>
  )
}

export default MusicPlayer

