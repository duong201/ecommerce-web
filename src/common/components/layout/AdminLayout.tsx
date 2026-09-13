import React, { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminTopbar from '../../../components/adminpage/header-admin/HeaderAdmin'
import AdminSidebar from '../../../components/adminpage/sidebar-admin/SidebarAdmin'
import './AdminLayout.scss'

interface AdminLayoutProps {
  children: ReactNode
}

/**
 * Admin chrome: fixed topbar, collapsible sidebar, scrolling content column.
 *
 * The layout is a CSS grid rather than the old fixed-position topbar plus
 * `width: calc(100% - 26rem)` on every page - a rule each page had to repeat
 * and which most of them had stopped carrying, so they rendered underneath the
 * header.
 */
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Lock the page behind the mobile sidebar so it does not scroll underneath.
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className={['admin', sidebarOpen ? 'is-sidebar-open' : ''].filter(Boolean).join(' ')}>
      <AdminTopbar onToggleSidebar={() => setSidebarOpen((open) => !open)} />

      <AdminSidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <button
          type="button"
          className="admin__backdrop"
          data-testid="sidebar-backdrop"
          aria-label={t('admin.shell.closeMenu')}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="admin__content" id="admin-main">
        <div className="admin__content-inner">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout
