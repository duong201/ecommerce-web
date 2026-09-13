import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../../common/components/layout/AdminLayout'
import { buildProductColumns } from '../../../common/config/tableColumns'
import { useFetch } from '../../../common/hooks/useFetch'
import { productService } from '../../../services'
import { toast } from '../../../common/utils/toast'
import { SearchIcon } from '../../../common/components/ui/icons'
import {
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
  Table,
  TableActions,
  useDialog,
} from '../../../common/components/ui'
import type { TableColumn } from '../../../common/components/ui'
import type { Paginated, Product } from '../../../interface'

const EMPTY: Paginated<Product> = {
  data: [],
  meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
}

const SEARCH_DEBOUNCE_MS = 300

const ListProduct = () => {
  const { t } = useTranslation()
  const { confirm } = useDialog()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(search.trim())
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [search])

  const fetchProducts = useCallback(
    () => productService.listForAdmin({ page, limit: 20, q: query || undefined }),
    [page, query],
  )
  const {
    data: products,
    loading,
    refetch,
  } = useFetch<Paginated<Product>>(fetchProducts, [page, query], EMPTY)

  const remove = async (product: Product) => {
    const confirmed = await confirm({
      title: `Delete “${product.name}”?`,
      description: t('admin.products.deleteDescription'),
      confirmLabel: t('admin.products.deleteConfirm'),
      tone: 'danger',
    })
    if (!confirmed) return

    try {
      await productService.remove(product.id)
      toast.success(t('admin.products.deleted'))
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('admin.products.deleteFailed'))
    }
  }

  const columns: TableColumn<Product>[] = [
    ...buildProductColumns(t),
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (row) => (
        <TableActions>
          <Button variant="link" size="sm" className="is-danger" onClick={() => remove(row)}>
            Delete
          </Button>
        </TableActions>
      ),
    },
  ]

  return (
    <AdminLayout>
      <PageHeader
        eyebrow={t('admin.sections.stock')}
        title={t('admin.products.title')}
        description={t('admin.products.countInCatalogue', { count: products.meta.total })}
        toolbar={
          <Input
            className="admin-search"
            type="search"
            size="sm"
            aria-label={t('admin.products.searchAria')}
            placeholder={t('admin.products.searchPlaceholder')}
            iconLeft={<SearchIcon />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
      />

      <Card padding="none">
        <Table
          columns={columns}
          rows={products.data}
          loading={loading}
          getRowKey={(row) => row.id}
          emptyTitle={t('admin.products.emptyTitle')}
        />
      </Card>

      <Pagination
        page={products.meta.page}
        totalPages={products.meta.totalPages}
        total={products.meta.total}
        onChange={setPage}
      />
    </AdminLayout>
  )
}

export default ListProduct
