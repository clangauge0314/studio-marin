import React from 'react'

const ChoiceDisplay = ({ choice, isPlaying, dark, isAI = false }) => {
  const getChoiceIcon = (choice) => {
    switch (choice) {
      case 'rock':
        return '✊'
      case 'paper':
        return '✋'
      case 'scissors':
        return '✌️'
      default:
        return '❓'
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

  return (
    <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 transition-all duration-500 transform hover:scale-105 ${
      choice 
        ? dark 
          ? 'border-cyan-500 bg-cyan-900/30 animate-bounce-in' 
          : 'border-cyan-500 bg-cyan-100 animate-bounce-in'
        : dark 
          ? 'border-gray-600 bg-gray-700 animate-pulse' 
          : 'border-gray-300 bg-gray-200 animate-pulse'
    }`}>
      <div className="text-6xl mb-2 transition-all duration-300">
        {isPlaying && !choice ? '⏳' : getChoiceIcon(choice)}
      </div>
      <div className={`text-sm font-medium transition-all duration-300 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
        {isPlaying && !choice ? '選択中...' : getChoiceText(choice)}
      </div>
    </div>
  )
}

export default ChoiceDisplay
