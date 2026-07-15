import React from 'react'
import './Header.css'
import Navbar from './Navbar'
import Search from './Search'
import type { CartItem } from '../../../interface'

interface HeaderProps {
  cartItem?: CartItem[]
}

const Header = ({ cartItem }: HeaderProps) => {
  return (
    <>
      <header className="header">
        <div className="grid wide">
          <Navbar />
          <Search cartItem={cartItem} />
        </div>
      </header>
    </>
  )
}

export default Header
