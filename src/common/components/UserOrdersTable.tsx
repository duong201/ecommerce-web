import React, { useMemo } from 'react'
import DataTable from './DataTable'
import { buildOrderColumns } from '../config/tableColumns'
import { useFetch } from '../hooks/useFetch'
import { getOrders } from '../api'
import type { Order } from '../../interface'

interface UserOrdersTableProps {
  userId: string | number
}

const UserOrdersTable = ({ userId }: UserOrdersTableProps) => {
  const { data: orders } = useFetch<Order[]>(getOrders, [], [])
  const userOrders = useMemo(
    () => orders.filter((order) => String(order.iduser) === String(userId)),
    [orders, userId],
  )

  return <DataTable columns={buildOrderColumns()} rows={userOrders} />
}

export default UserOrdersTable
