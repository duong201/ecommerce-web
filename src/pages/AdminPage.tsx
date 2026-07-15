import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import HomePage from '../components/adminpage/homepage/HomePage'
import AdminLayout from '../common/components/AdminLayout'
import { getCurrentAdminId } from '../common/utils/session'

const AdminPage = () => {
  const idAdmin = getCurrentAdminId()
  const history = useHistory()

  useEffect(() => {
    if (!idAdmin) {
      history.push('/user/login')
    }
  }, [idAdmin, history])

  if (!idAdmin) return null

  return (
    <AdminLayout>
      <HomePage />
    </AdminLayout>
  )
}

export default AdminPage
