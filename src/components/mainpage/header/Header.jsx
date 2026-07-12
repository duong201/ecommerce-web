import React from 'react'
import './Header.css'
import Navbar from './Navbar'
import Search from './Search'

const Header = ({ cartItem }) => {
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
