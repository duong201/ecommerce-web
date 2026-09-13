import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { translateLabel } from '../../../common/utils/labels'
import AdminLayout from '../../../common/components/layout/AdminLayout'
import { buildCouponColumns } from '../../../common/config/tableColumns'
import { useFetch } from '../../../common/hooks/useFetch'
import { couponService } from '../../../services'

import { toast } from '../../../common/utils/toast'
import {
  Badge,
  Button,
  Card,
  PageHeader,
  Table,
  TableActions,
  useDialog,
} from '../../../common/components/ui'
import type { TableColumn } from '../../../common/components/ui'
import type { Coupon } from '../../../interface'

const TYPE_TONE = {
  percentage: 'brand',
  fixed_amount: 'info',
  free_delivery: 'accent',
} as const

const CouponsPage = () => {
  const { t } = useTranslation()
  const { confirm } = useDialog()
  const fetchCoupons = useCallback(() => couponService.listAll(), [])
  const { data: coupons, loading, refetch } = useFetch<Coupon[]>(fetchCoupons, [], [])

  const toggleActive = async (coupon: Coupon) => {
    try {
      await couponService.update(coupon.id, { isActive: !coupon.isActive })
      toast.success(coupon.isActive ? t('admin.coupons.paused') : t('admin.coupons.reactivated'))
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('admin.coupons.updateFailed'))
    }
  }

  const remove = async (coupon: Coupon) => {
    const confirmed = await confirm({
      title: `Delete coupon ${coupon.code}?`,
      description:
        coupon.usedCount > 0
          ? `It has been used ${coupon.usedCount} times, so it will be deactivated instead of deleted — the discount history on those orders has to survive.`
          : t('admin.coupons.neverUsed'),
      confirmLabel: t('common.delete'),
      tone: 'danger',
    })
    if (!confirmed) return

    try {
      const result = await couponService.remove(coupon.id)
      toast.success(
        result.deleted ? t('admin.coupons.deleted') : t('admin.coupons.deactivatedInstead'),
      )
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('admin.coupons.deleteFailed'))
    }
  }

  const columns: TableColumn<Coupon>[] = [
    ...buildCouponColumns(t),
    {
      key: 'type',
      header: t('admin.columns.type'),
      align: 'center',
      render: (row) => (
        <Badge tone={TYPE_TONE[row.type] ?? 'neutral'} size="sm">
          {translateLabel('couponType', row.type)}
        </Badge>
      ),
    },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (row) => (
        <TableActions>
          <Button variant="link" size="sm" onClick={() => toggleActive(row)}>
            {row.isActive ? t('admin.coupons.pause') : t('admin.coupons.resume')}
          </Button>
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
        eyebrow={t('admin.sections.selling')}
        title={t('admin.coupons.title')}
        description={`${coupons.length} discount programmes`}
      />

      <Card padding="none">
        <Table
          columns={columns}
          rows={coupons}
          loading={loading}
          getRowKey={(row) => row.id}
          emptyTitle={t('admin.coupons.emptyTitle')}
        />
      </Card>
    </AdminLayout>
  )
}

export default CouponsPage
