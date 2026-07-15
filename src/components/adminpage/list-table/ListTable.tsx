import React from 'react'
import './ListTable.scss'
import DataTable from '../../../common/components/DataTable'
import { buildProductColumns } from '../../../common/config/tableColumns'
import type { Product } from '../../../interface'

interface ListTableProps {
  products?: Product[]
}

const ListTable = ({ products = [] }: ListTableProps) => {
  const topSold = [...products].sort((a, b) => b.sold - a.sold).slice(0, 10)

  return <DataTable columns={buildProductColumns()} rows={topSold} />
}

export default ListTable
