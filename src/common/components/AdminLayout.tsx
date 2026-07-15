import React, { ReactNode, useState } from 'react'
import HeaderAdmin from '../../components/adminpage/header-admin/HeaderAdmin'
import SidebarAdmin from '../../components/adminpage/sidebar-admin/SidebarAdmin'

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-page">
      <div className="grid">
        <div className="row" style={{ margin: '0' }}>
          <HeaderAdmin onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        </div>
        <div className="row" style={{ margin: '0', width: '100%' }}>
          <SidebarAdmin isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
          {sidebarOpen && (
            <div
              className="sidebar-backdrop"
              data-testid="sidebar-backdrop"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
