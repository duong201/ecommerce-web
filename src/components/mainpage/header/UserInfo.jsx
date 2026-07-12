import React from 'react'
import './UserInfo.scss'
import { useParams } from 'react-router-dom';
import UserProfileCard from '../../../common/components/UserProfileCard';
import UserOrdersTable from '../../../common/components/UserOrdersTable';
import RevenueAreaChart from '../../../common/components/RevenueAreaChart';
import { useFetch } from '../../../common/hooks/useFetch';
import { getUser } from '../../../common/api';

const UserInfo = () => {
  const { id } = useParams()
  const { data: infoUser } = useFetch(() => getUser(id), [id], {})

  return (
    <div className='grid wide'>
      <div className="row" style={{ margin: 0, paddingBottom: 20 }}>
        <div className="c-12 m-12 l-5 info mgt-32">
          <UserProfileCard user={infoUser} editHref={`/admin/list-user/user/${id}/edit`} />
        </div>
        <div className="c-12 m-12 l-7 box-user-chart mgt-32">
          <div className="user-chart">
            <RevenueAreaChart />
          </div>
        </div>
      </div>
      <div className="row" style={{ margin: 0 }}>
        <div className="list-user-info">
          <div className="table-user">
            <UserOrdersTable userId={id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
