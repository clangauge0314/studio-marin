import React from 'react'

const GameControls = ({ onPlayerChoice, isPlaying, onReset, onPlayAgain, hasResult, dark }) => {
  const choices = [
    { value: 'rock', label: 'グー', icon: '✊' },
    { value: 'paper', label: 'パー', icon: '✋' },
    { value: 'scissors', label: 'チョキ', icon: '✌️' }
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 선택 버튼들 */}
      <div className="flex justify-center space-x-4">
        {choices.map((choice, index) => (
          <button
            key={choice.value}
            onClick={() => onPlayerChoice(choice.value)}
            disabled={isPlaying}
            className={`w-20 h-20 rounded-full border-4 transition-all duration-300 flex flex-col items-center justify-center transform hover:scale-110 animate-slide-up ${
              isPlaying
                ? dark
                  ? 'border-gray-600 bg-gray-700 text-gray-500 cursor-not-allowed scale-95'
                  : 'border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed scale-95'
                : dark
                  ? 'border-cyan-500 bg-cyan-900/30 text-cyan-400 hover:bg-cyan-800/50 hover:shadow-lg hover:shadow-cyan-500/25'
                  : 'border-cyan-500 bg-cyan-100 text-cyan-600 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/25'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-2xl mb-1 transition-transform duration-200">{choice.icon}</span>
            <span className="text-xs font-medium">{choice.label}</span>
          </button>
        ))}
      </div>

      {/* 액션 버튼들 */}
      <div className="flex justify-center space-x-4 animate-slide-up">
        {hasResult && (
          <button
            onClick={onPlayAgain}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              dark
                ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/25'
                : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25'
            }`}
          >
            もう一度
          </button>
        )}
        
        <button
          onClick={onReset}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 mb-8 ${
            dark
              ? 'bg-gray-600 text-white hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-500/25'
              : 'bg-gray-500 text-white hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-500/25'
          }`}
        >
          リセット
        </button>
      </div>
    </div>
  )
}

export default GameControls
