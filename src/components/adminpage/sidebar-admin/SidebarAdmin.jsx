import React from 'react'
import './SidebarAdmin.scss'
import { Link, useHistory } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { clearAdminSession } from '../../../common/utils/session'

const SidebarAdmin = ({ isOpen = false, onNavigate }) => {
  const history = useHistory()

  const logout = () => {
    clearAdminSession()
    history.push("/user/login");
  }

  return (
    <>
      <div className={`sidebar-admin ${isOpen ? 'open' : ''}`}>
        <ul className='sidebar-list' onClick={onNavigate}>
          <li className="sidebar-item">
            Main
          </li>
          <li className="sidebar-item">
            <Link to="/admin" className="sidebar-link">
              <DashboardIcon className="sidebar-icon" />
              Trang chủ
            </Link>
          </li>
          <li className="sidebar-item">
            Danh sách
          </li>
          <li className="sidebar-item">
            <Link to="/admin/list-user" className="sidebar-link">
              <PersonOutlineOutlinedIcon className="sidebar-icon" />
              Người dùng
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/admin/list-product" className="sidebar-link">
              <StoreMallDirectoryOutlinedIcon className="sidebar-icon" />
              Sản phẩm
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/admin/list-order" className="sidebar-link">
              <CreditCardOutlinedIcon className="sidebar-icon" />
              Đặt hàng
            </Link>
          </li>
          {/* <li className="sidebar-item">
            <Link to='/admin' className="sidebar-link">
              <LocalShippingOutlinedIcon className="sidebar-icon" />
              Vận chuyển
            </Link>
          </li> */}
          {/* <li className="sidebar-item">
            Tiện ích
          </li>
          <li className="sidebar-item">
            <Link to="/admin" className="sidebar-link">
              <ChatBubbleOutlineOutlinedIcon className="sidebar-icon" />
              Trò chuyện
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/admin" className="sidebar-link">
              <NotificationsNoneOutlinedIcon className="sidebar-icon" />
              Thông báo
            </Link>
          </li> */}
          <li className="sidebar-item">
            Admin
          </li>

          <li className="sidebar-item">
            <div onClick={logout} className="sidebar-link">
              <LogoutOutlinedIcon className="sidebar-icon" />
              Đăng xuất
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}

export default SidebarAdmin