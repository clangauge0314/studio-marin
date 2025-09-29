import React from 'react'
import ChoiceDisplay from './ChoiceDisplay'

const GameArea = ({ playerChoice, aiChoice, isPlaying, dark }) => {
  return (
    <div className={`grid grid-cols-2 gap-6 h-full ${dark ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-6 transition-all duration-500 animate-fade-in`}>
      <div className="flex flex-col items-center justify-center animate-slide-in-left">
        <h3 className={`text-lg font-semibold mb-4 transition-all duration-300 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}>
          プレイヤー
        </h3>
        <ChoiceDisplay 
          choice={playerChoice}
          isPlaying={isPlaying}
          dark={dark}
        />
      </div>
      
      <div className="flex flex-col items-center justify-center animate-slide-in-right">
        <h3 className={`text-lg font-semibold mb-4 transition-all duration-300 ${dark ? 'text-red-400' : 'text-red-600'}`}>
          AI
        </h3>
        <ChoiceDisplay 
          choice={aiChoice}
          isPlaying={isPlaying}
          dark={dark}
          isAI={true}
        />
      </div>
    </div>
  )
}

export default GameArea
