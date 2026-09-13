import React from 'react'
import AdminDashboard from '../components/adminpage/homepage/HomePage'
import AdminLayout from '../common/components/layout/AdminLayout'
import RequireStaff from './RequireStaff'

const AdminPage = () => (
  <RequireStaff>
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  </RequireStaff>
)

export default AdminPage
