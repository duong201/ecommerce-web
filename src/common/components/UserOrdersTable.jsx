import React, { useMemo } from 'react'
import DataTable from './DataTable'
import { buildOrderColumns } from '../config/tableColumns'
import { useFetch } from '../hooks/useFetch'
import { getOrders } from '../api'

const UserOrdersTable = ({ userId }) => {
  const { data: orders } = useFetch(getOrders, [])
  const userOrders = useMemo(
    () => orders.filter((order) => String(order.iduser) === String(userId)),
    [orders, userId],
  )

  return <DataTable columns={buildOrderColumns()} rows={userOrders} />
}

export default UserOrdersTable
