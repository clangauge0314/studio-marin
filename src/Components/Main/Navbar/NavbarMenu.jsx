import React from 'react'
import { Link } from 'react-router-dom'
import useDarkModeStore from '../../../Store/useDarkModeStore'

const NavbarMenu = () => {
  const { dark } = useDarkModeStore()

  const menuItems = [
    { to: '/board', label: '掲示板' },
    { to: '/events', label: 'イベント&ゲーム' },
    { to: '/ranking', label: 'ランキング&報酬' }
  ]

  return (
    <div className="hidden lg:flex items-center space-x-8">
      {menuItems.map((item) => (
        <Link 
          key={item.to}
          to={item.to} 
          className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            dark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-500'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default NavbarMenu
