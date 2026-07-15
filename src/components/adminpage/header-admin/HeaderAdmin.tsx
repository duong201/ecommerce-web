import React from 'react'
import { Link } from 'react-router-dom'
import './HeaderAdmin.scss'
import MenuIcon from '@mui/icons-material/Menu'
import NavbarAdmin from './NavbarAdmin'

interface HeaderAdminProps {
  onToggleSidebar?: () => void
}

const HeaderAdmin = ({ onToggleSidebar }: HeaderAdminProps) => {
  return (
    <>
      <div className="header-admin">
        <button
          type="button"
          className="header-admin__menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>
        <Link to="/admin" className="header-admin__logo">
          <span>Tipee</span>
        </Link>
        <div className="navbar-admin">
          <NavbarAdmin />
        </div>
      </div>
    </>
  )
}

export default HeaderAdmin
