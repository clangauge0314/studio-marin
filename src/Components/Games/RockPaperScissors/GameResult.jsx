import React from 'react'

const GameResult = ({ result, playerChoice, aiChoice, dark }) => {
  const getResultMessage = () => {
    if (!result) return null
    
    switch (result) {
      case 'player':
        return { text: 'プレイヤーの勝利！🎉', color: 'text-green-500' }
      case 'ai':
        return { text: 'AIの勝利！🤖', color: 'text-red-500' }
      case 'tie':
        return { text: '引き分け！🤝', color: 'text-yellow-500' }
      default:
        return null
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
        return choice
    }
  }

  const resultMessage = getResultMessage()

  if (!resultMessage) {
    return (
      <div className={`text-center py-4 animate-fade-in ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        <p className="text-lg">グー、パー、チョキの中から選んでください！</p>
      </div>
    )
  }

  return (
    <div className="text-center py-4 animate-bounce-in">
      <div className={`text-2xl font-bold mb-2 transition-all duration-500 ${resultMessage.color}`}>
        {resultMessage.text}
      </div>
      
      {playerChoice && aiChoice && (
        <div className={`text-sm transition-all duration-300 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            プレイヤー: {getChoiceText(playerChoice)} vs AI: {getChoiceText(aiChoice)}
          </p>
        </div>
      )}
    </div>
  )
}

export default GameResult
