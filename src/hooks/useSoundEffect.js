import { useRef, useCallback } from 'react'

export const useSoundEffect = () => {
  const soundRefs = useRef({
    choose: null,
    draw: null,
    lose: null,
    win: null
  })

  // 효과음 초기화
  const initSounds = useCallback(() => {
    soundRefs.current = {
      choose: new Audio('/choose.mp3'),
      draw: new Audio('/draw.mp3'),
      lose: new Audio('/lose.mp3'),
      win: new Audio('/win.mp3')
    }

    // 모든 효과음 볼륨 설정 (50%)
    Object.values(soundRefs.current).forEach(sound => {
      if (sound) {
        sound.volume = 0.5
      }
    })
  }, [])

  // 효과음 재생
  const playSound = useCallback((soundName) => {
    if (!soundRefs.current[soundName]) {
      initSounds()
    }

    const sound = soundRefs.current[soundName]
    if (sound) {
      // 이미 재생 중이면 처음부터 다시 재생
      sound.currentTime = 0
      sound.play().catch(error => {
        console.log('효과음 재생 실패:', error)
      })
    }
  }, [initSounds])

  return { playSound, initSounds }
}

