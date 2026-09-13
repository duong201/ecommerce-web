import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { translateLabel } from '../../../common/utils/labels'
import AdminLayout from '../../../common/components/layout/AdminLayout'
import './ListOrder.scss'
import OrderDetailPanel from './OrderDetailPanel'
import { buildOrderColumns } from '../../../common/config/tableColumns'
import { useFetch } from '../../../common/hooks/useFetch'
import { orderService } from '../../../services'

import { toast } from '../../../common/utils/toast'
import {
  Button,
  Card,
  PageHeader,
  Pagination,
  Segmented,
  Table,
  TableActions,
  useDialog,
} from '../../../common/components/ui'
import type { TableColumn } from '../../../common/components/ui'
import type { Order, OrderStatus, Paginated } from '../../../interface'

const EMPTY: Paginated<Order> = {
  data: [],
  meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
}

/** The happy path through fulfilment: each status advances to exactly one next. */
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'picking',
  picking: 'delivering',
  delivering: 'completed',
}

const STATUS_VALUES: (OrderStatus | 'all')[] = [
  'all',
  'pending',
  'confirmed',
  'picking',
  'delivering',
  'completed',
  'cancelled',
]

/**
 * Order fulfilment queue. A row expands in place to show its lines, where a
 * picker records the measured weight for anything sold by the kilo.
 */
const ListOrder = () => {
  const { t } = useTranslation()
  const { prompt } = useDialog()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<OrderStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchOrders = useCallback(
    () => orderService.list({ page, limit: 20, status: status === 'all' ? undefined : status }),
    [page, status],
  )
  const {
    data: orders,
    loading,
    refetch,
  } = useFetch<Paginated<Order>>(fetchOrders, [page, status], EMPTY)

  const advance = async (order: Order) => {
    const next = NEXT_STATUS[order.status]
    if (!next) return

    try {
      await orderService.updateStatus(order.id, next)
      toast.success(
        t('admin.orders.movedTo', {
          order: order.orderNumber,
          status: translateLabel('orderStatus', next),
        }),
      )
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('admin.orders.statusFailed'))
    }
  }

  const cancel = async (order: Order) => {
    const reason = await prompt({
      title: `Cancel ${order.orderNumber}?`,
      description: t('admin.orders.cancelDescription'),
      label: t('admin.orders.cancelReason'),
      inputType: 'multiline',
      required: true,
      confirmLabel: t('admin.orders.cancelConfirm'),
      cancelLabel: t('admin.orders.cancelKeep'),
      tone: 'danger',
    })
    if (reason === null) return

    try {
      await orderService.updateStatus(order.id, 'cancelled', reason)
      toast.success(t('admin.orders.cancelled'))
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('admin.orders.cancelFailed'))
    }
  }

  const weigh = async (orderId: string, itemId: string, sku: string) => {
    const input = await prompt({
      title: t('admin.orders.weighTitle'),
      description: `SKU ${sku}. Enter what the scale reads, in the selling unit.`,
      label: t('admin.orders.weighLabel'),
      inputType: 'number',
      required: true,
      confirmLabel: t('admin.orders.weighConfirm'),
      validate: (value) => (Number(value) < 0 ? t('admin.orders.weighNegative') : null),
    })
    if (input === null) return

    try {
      await orderService.weighItem(orderId, itemId, Number(input))
      toast.success(t('admin.orders.weighRecorded'))
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('admin.orders.weighFailed'))
    }
  }

  const columns: TableColumn<Order>[] = [
    ...buildOrderColumns(t),
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (row) => {
        const next = NEXT_STATUS[row.status]
        const open = expandedId === row.id

        return (
          <TableActions>
            <Button variant="link" size="sm" onClick={() => setExpandedId(open ? null : row.id)}>
              {open ? t('admin.orders.hide') : t('admin.orders.details')}
            </Button>

            {next && (
              <Button variant="link" size="sm" onClick={() => advance(row)}>
                → {translateLabel('orderStatus', next)}
              </Button>
            )}

            {row.status !== 'completed' && row.status !== 'cancelled' && (
              <Button variant="link" size="sm" className="is-danger" onClick={() => cancel(row)}>
                Cancel
              </Button>
            )}
          </TableActions>
        )
      },
    },
  ]

  return (
    <AdminLayout>
      <PageHeader
        eyebrow={t('admin.sections.selling')}
        title={t('admin.orders.title')}
        description={t('admin.orders.count', { count: orders.meta.total })}
        toolbar={
          <Segmented
            options={STATUS_VALUES.map((value) => ({
              value,
              label: value === 'all' ? t('admin.orders.all') : translateLabel('orderStatus', value),
            }))}
            value={status}
            ariaLabel={t('admin.orders.filterAria')}
            onChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          />
        }
      />

      <Card padding="none">
        <Table
          columns={columns}
          rows={orders.data}
          loading={loading}
          getRowKey={(row) => row.id}
          emptyTitle={t('admin.orders.emptyTitle')}
          renderExpanded={(row) =>
            expandedId === row.id ? <OrderDetailPanel order={row} onWeigh={weigh} /> : null
          }
        />
      </Card>

      <Pagination
        page={orders.meta.page}
        totalPages={orders.meta.totalPages}
        total={orders.meta.total}
        onChange={setPage}
      />
    </AdminLayout>
  )
}

export default ListOrder
