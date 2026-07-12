import React from 'react'
import { useParams } from 'react-router-dom';
import AdminLayout from '../../../common/components/AdminLayout';
import UserProfileCard from '../../../common/components/UserProfileCard';
import UserOrdersTable from '../../../common/components/UserOrdersTable';
import RevenueAreaChart from '../../../common/components/RevenueAreaChart';
import { useFetch } from '../../../common/hooks/useFetch';
import { getUser } from '../../../common/api';

const User = () => (
  <AdminLayout>
    <UserDetail />
  </AdminLayout>
)

const UserDetail = () => {
  const { id } = useParams()
  const { data: infoUser } = useFetch(() => getUser(id), [id], {})

  return (
    <div className='user-page'>
      <div className="row" style={{ margin: 0, paddingBottom: 20 }}>
        <div className="l-5 info">
          <UserProfileCard user={infoUser} editHref={`/admin/list-user/user/${id}/edit`} />
        </div>
        <div className="l-7 box-user-chart">
          <div className="user-chart">
            <RevenueAreaChart />
          </div>
        </div>
      </div>
      <div className="row mgt-32" style={{ margin: 0 }}>
        <UserOrdersTable userId={id} />
      </div>
    </div>
  )
}

export default User
