import React from 'react'

const GameHeader = ({ score, dark }) => {
  return (
    <div className="text-center mb-6 animate-fade-in">
      <h2 className={`text-2xl font-bold mb-4 transition-all duration-500 ${dark ? 'text-white' : 'text-gray-900'}`}>
        じゃんけんゲーム
      </h2>
      
      <div className="flex justify-center items-center space-x-8 animate-slide-up">
        <div className={`text-center transition-all duration-300 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}>
          <div className="text-3xl font-bold animate-pulse">{score.player}</div>
          <div className="text-sm">プレイヤー</div>
        </div>
        
        <div className={`text-2xl font-bold transition-all duration-300 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
          VS
        </div>
        
        <div className={`text-center transition-all duration-300 ${dark ? 'text-red-400' : 'text-red-600'}`}>
          <div className="text-3xl font-bold animate-pulse">{score.ai}</div>
          <div className="text-sm">AI</div>
        </div>
      </div>
    </div>
  )
}

export default GameHeader
