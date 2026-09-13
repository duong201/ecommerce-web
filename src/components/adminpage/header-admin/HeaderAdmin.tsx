import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import './HeaderAdmin.scss'
import {
  MenuIcon,
  SearchIcon,
  ShoppingCartOutlinedIcon,
  LogoutIcon,
} from '../../../common/components/ui/icons'
import { Avatar, IconButton, ThemeToggle } from '../../../common/components/ui'
import { authService } from '../../../services'
import { getCurrentUser } from '../../../common/utils/session'

interface AdminTopbarProps {
  onToggleSidebar?: () => void
}

/**
 * Admin topbar.
 *
 * The previous version carried eight decorative links - language, fullscreen,
 * notifications, messages, settings - that all routed back to `/admin` and did
 * nothing. What is left is the three controls that work: search, theme, and the
 * account.
 */
const AdminTopbar = ({ onToggleSidebar }: AdminTopbarProps) => {
  const { t } = useTranslation()
  const history = useHistory()
  const user = getCurrentUser()

  const logout = async () => {
    await authService.logout()
    history.push('/dang-nhap')
  }

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__brand">
        <IconButton
          className="admin-topbar__burger"
          label={t('admin.shell.toggleMenu')}
          icon={<MenuIcon />}
          onClick={onToggleSidebar}
        />
        <Link to="/admin" className="admin-topbar__logo">
          <span aria-hidden="true">🍇</span>
          <span className="admin-topbar__logo-text">
            Trái <em>Ngon</em>
          </span>
        </Link>
      </div>

      <div className="admin-topbar__search">
        <SearchIcon />
        <input
          type="search"
          placeholder={t('admin.shell.searchPlaceholder')}
          aria-label={t('admin.shell.searchAria')}
        />
      </div>

      <div className="admin-topbar__actions">
        <Link to="/" className="admin-topbar__storefront">
          <ShoppingCartOutlinedIcon />
          <span>{t('admin.shell.viewShop')}</span>
        </Link>

        <ThemeToggle />

        <div className="admin-topbar__user">
          <Avatar name={user?.fullName} size="sm" />
          <span className="admin-topbar__user-name">
            {user?.fullName ?? t('admin.shell.staff')}
          </span>
        </div>

        <IconButton label={t('admin.shell.signOut')} icon={<LogoutIcon />} onClick={logout} />
      </div>
    </header>
  )
}

export default AdminTopbar
