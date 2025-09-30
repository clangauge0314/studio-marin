import React from 'react'
import { Link } from 'react-router-dom'
import useDarkModeStore from '../../../Store/useDarkModeStore'

const NavbarLogo = () => {
  const { dark } = useDarkModeStore()

  return (
    <Link to="/" className="flex-shrink-0">
      <img 
        src={dark ? "/logo-dark.jpg" : "/logo-white.jpg"} 
        alt="Studio Marin Logo" 
        className="h-12 w-auto"
      />
    </Link>
  )
}

export default NavbarLogo
