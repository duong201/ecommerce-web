import React from 'react'
import { Link } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'
import { useHistory } from 'react-router-dom'
import {
  getCurrentUserId,
  getCurrentUserName,
  clearUserSession,
} from '../../../common/utils/session'

const Navbar = () => {
  const idUser = getCurrentUserId()
  const userName = getCurrentUserName()
  const history = useHistory()
  const logout = () => {
    clearUserSession()
    history.push('/user/login')
  }

  return (
    <>
      <nav className="header__navbar">
        <ul className="header__navbar-list header__navbar-list--secondary">
          <li className="header__navbar-item separate">Vào cửa hàng trên ứng dụng</li>
          <li className="header__navbar-item">Kết nối</li>
        </ul>
        <ul className="header__navbar-list">
          <li className="header__navbar-item header__navbar-item--optional">
            <button type="button" className="header__navbar-link">
              Thông báo
            </button>
          </li>
          <li className="header__navbar-item header__navbar-item--optional">
            <button type="button" className="header__navbar-link">
              Trợ giúp
            </button>
          </li>
          <li className="header__navbar-item bold header-info">
            {idUser ? (
              <div className="boxInfo">
                {userName}
                <div className="optionInfo">
                  <Link to={`/user/info/${idUser}`} className="optionInfo-item">
                    Xem thông tin
                  </Link>
                  <div onClick={logout} className="optionInfo-item">
                    Đăng xuất
                    <LogoutIcon style={{ marginLeft: '.5rem' }} />
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/user/login" className="header__navbar-link">
                Đăng nhập
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar
