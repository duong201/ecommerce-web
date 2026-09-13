import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import './SidebarAdmin.scss'
import {
  DashboardIcon,
  CreditCardOutlinedIcon,
  LocalShippingOutlinedIcon,
  LocalOfferOutlinedIcon,
  StoreMallDirectoryOutlinedIcon,
  Inventory2OutlinedIcon,
  AgricultureOutlinedIcon,
  RateReviewOutlinedIcon,
  PersonOutlineIcon,
} from '../../../common/components/ui/icons'
import { isAdmin } from '../../../common/utils/session'

interface SidebarAdminProps {
  isOpen?: boolean
  onNavigate?: () => void
}

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
  adminOnly?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

/** Grouped so a manager can find "the stock screen" without reading every row. */
const SECTIONS: NavSection[] = [
  {
    title: 'admin.sections.overview',
    items: [{ to: '/admin', label: 'admin.nav.dashboard', icon: <DashboardIcon /> }],
  },
  {
    title: 'admin.sections.selling',
    items: [
      { to: '/admin/don-hang', label: 'admin.nav.orders', icon: <CreditCardOutlinedIcon /> },
      {
        to: '/admin/khung-gio-giao',
        label: 'admin.nav.deliverySlots',
        icon: <LocalShippingOutlinedIcon />,
      },
      { to: '/admin/ma-giam-gia', label: 'admin.nav.coupons', icon: <LocalOfferOutlinedIcon /> },
    ],
  },
  {
    title: 'admin.sections.stock',
    items: [
      {
        to: '/admin/san-pham',
        label: 'admin.nav.products',
        icon: <StoreMallDirectoryOutlinedIcon />,
      },
      { to: '/admin/kho', label: 'admin.nav.batches', icon: <Inventory2OutlinedIcon /> },
      {
        to: '/admin/nha-cung-cap',
        label: 'admin.nav.suppliers',
        icon: <AgricultureOutlinedIcon />,
      },
    ],
  },
  {
    title: 'admin.sections.customers',
    items: [
      { to: '/admin/danh-gia', label: 'admin.nav.reviews', icon: <RateReviewOutlinedIcon /> },
      {
        to: '/admin/nguoi-dung',
        label: 'admin.nav.users',
        icon: <PersonOutlineIcon />,
        adminOnly: true,
      },
    ],
  },
]

const AdminSidebar = ({ isOpen = false, onNavigate }: SidebarAdminProps) => {
  const { t } = useTranslation()
  const admin = isAdmin()

  return (
    <nav
      className={['admin-sidebar', isOpen ? 'is-open' : ''].filter(Boolean).join(' ')}
      data-testid="sidebar-admin"
      aria-label={t('admin.nav.aria')}
    >
      {SECTIONS.map((section) => {
        const items = section.items.filter((item) => !item.adminOnly || admin)
        if (items.length === 0) return null

        return (
          <div className="admin-sidebar__section" key={section.title}>
            <p className="admin-sidebar__title">{t(section.title)}</p>
            <ul>
              {items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    exact={item.to === '/admin'}
                    className="admin-sidebar__link"
                    activeClassName="is-active"
                    onClick={onNavigate}
                  >
                    <span className="admin-sidebar__icon">{item.icon}</span>
                    {t(item.label)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}

export default AdminSidebar
