import React from 'react'
import useDarkModeStore from '../../../Store/useDarkModeStore'
import NavbarLogo from './NavbarLogo'
import NavbarMenu from './NavbarMenu'
import NavbarUser from './NavbarUser'

const Navbar = () => {
  const { dark } = useDarkModeStore()

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 shadow-lg ${dark ? 'bg-black border-b border-gray-700' : 'bg-white'}`}>
      <div className="flex justify-between items-center h-full px-4 sm:px-6 lg:px-8">
        <NavbarLogo />
        <NavbarMenu />
        <NavbarUser />
      </div>
    </nav>
  )
}

export default Navbar
