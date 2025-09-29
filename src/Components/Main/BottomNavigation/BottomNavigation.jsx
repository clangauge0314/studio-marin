import React from 'react'
import { Home, FileText, Gamepad2, Trophy } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import useDarkModeStore from '../../../Store/useDarkModeStore'

const BottomNavigation = () => {
  const { dark } = useDarkModeStore()
  const location = useLocation()

  const navItems = [
    { id: 'home', label: 'ホーム', icon: Home, href: '/' },
    { id: 'board', label: '掲示板', icon: FileText, href: '/board' },
    { id: 'events', label: 'イベント&ゲーム', icon: Gamepad2, href: '/events' },
    { id: 'ranking', label: 'ランキング', icon: Trophy, href: '#ranking' },
  ]

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden ${dark ? 'bg-black border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = (item.href === '/' && location.pathname === '/') || 
                           (item.href === '/board' && location.pathname === '/board') ||
                           (item.href === '/events' && location.pathname === '/events')
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
                  isActive
                    ? 'text-[#06b6d4]'
                    : dark 
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-900' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default BottomNavigation
