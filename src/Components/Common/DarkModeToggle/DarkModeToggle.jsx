import React from 'react'
import { Sun, Moon } from 'lucide-react'
import useDarkModeStore from '../../../Store/useDarkModeStore'

const DarkModeToggle = () => {
  const { dark, toggleDark } = useDarkModeStore()

  return (
    <button
      onClick={toggleDark}
      className={`fixed bottom-20 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
        dark 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-gray-600' 
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
      }`}
      aria-label="다크모드 토글"
    >
      {dark ? (
        <Sun className="w-6 h-6" />
      ) : (
        <Moon className="w-6 h-6" />
      )}
    </button>
  )
}

export default DarkModeToggle
