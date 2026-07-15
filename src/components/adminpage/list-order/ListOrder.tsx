import React from 'react'
import './ListOrder.scss'
import AdminLayout from '../../../common/components/AdminLayout'
import DataTable from '../../../common/components/DataTable'
import { buildOrderColumns } from '../../../common/config/tableColumns'
import { useFetch } from '../../../common/hooks/useFetch'
import { getOrders } from '../../../common/api'
import type { Order } from '../../../interface'

const ListOrder = () => (
  <AdminLayout>
    <OrderTable />
  </AdminLayout>
)

const OrderTable = () => {
  const { data: dataOrder } = useFetch<Order[]>(getOrders, [], [])

  return (
    <div className="list-user-page">
      <div className="list-user-header">
        <div className="row" style={{ margin: 0 }}>
          <div className="l-12" style={{ padding: 10 }}>
            <div className="editing-user-title">
              <span>Danh sách Order</span>
            </div>
          </div>
        </div>
      </div>
      <div className="table-user">
        <DataTable columns={buildOrderColumns()} rows={dataOrder} />
      </div>
    </div>
  )
}

export default ListOrder
