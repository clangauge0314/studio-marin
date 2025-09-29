import React from 'react'
import useDarkModeStore from '../../Store/useDarkModeStore'

const BoardPage = () => {
  const { dark } = useDarkModeStore()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className={`text-4xl font-bold text-center transition-colors duration-300 ${dark ? 'text-white' : 'text-gray-900'}`}>
        掲示板
      </h1>
    </div>
  )
}

export default BoardPage
