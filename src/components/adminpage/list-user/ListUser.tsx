import React from 'react'
import './ListUser.scss'
import AdminLayout from '../../../common/components/AdminLayout'
import DataTable from '../../../common/components/DataTable'
import { buildUserColumns } from '../../../common/config/tableColumns'
import { useFetch } from '../../../common/hooks/useFetch'
import { getUsers, deleteUser } from '../../../common/api'
import type { User } from '../../../interface'

const ListUser = () => (
  <AdminLayout>
    <UserTable />
  </AdminLayout>
)

const UserTable = () => {
  const { data: user, setData: setUser } = useFetch<User[]>(getUsers, [], [])

  const handleDelete = (id: number) => {
    deleteUser(id).then((response) => {
      if (response.data.status === 'success') {
        setUser((current) => current.filter((item) => item.id !== id))
      }
    })
  }

  return (
    <div className="list-user-page">
      <div className="list-user-header">
        <div className="row" style={{ margin: 0 }}>
          <div className="l-12" style={{ padding: 10 }}>
            <div className="editing-user-title">
              <span>Danh sách User</span>
            </div>
          </div>
        </div>
      </div>
      <div className="table-user">
        <DataTable columns={buildUserColumns({ onDelete: handleDelete })} rows={user} />
      </div>
    </div>
  )
}

export default ListUser
