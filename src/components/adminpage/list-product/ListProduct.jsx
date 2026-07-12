import React from 'react'
import './ListProduct.scss'
import AdminLayout from '../../../common/components/AdminLayout'
import DataTable from '../../../common/components/DataTable'
import { buildProductColumns } from '../../../common/config/tableColumns'
import { useFetch } from '../../../common/hooks/useFetch'
import { getProducts } from '../../../common/api'

const ListProduct = () => (
  <AdminLayout>
    <ProductTable />
  </AdminLayout>
)

const ProductTable = () => {
  const { data: products } = useFetch(getProducts, [])

  return (
    <div className="list-user-page">
      <div className="list-user-header">
        <div className="row" style={{ margin: 0 }}>
          <div className="l-12" style={{ padding: 10 }}>
            <div className="editing-user-title">
              <span>Danh sách Product</span>
            </div>
          </div>
        </div>
      </div>
      <div className="table-user">
        <DataTable columns={buildProductColumns()} rows={products} />
      </div>
    </div>
  )
}

export default ListProduct
