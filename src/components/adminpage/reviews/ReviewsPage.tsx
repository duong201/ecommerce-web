import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { translateLabel } from '../../../common/utils/labels'
import './ReviewsPage.scss'
import AdminLayout from '../../../common/components/layout/AdminLayout'
import { buildReviewColumns } from '../../../common/config/tableColumns'
import { useFetch } from '../../../common/hooks/useFetch'
import { reviewService } from '../../../services'

import { toast } from '../../../common/utils/toast'
import {
  Card,
  CardHeader,
  PageHeader,
  Rating,
  Segmented,
  Table,
} from '../../../common/components/ui'
import type { FreshnessReportRow, Paginated, Review, ReviewStatus } from '../../../interface'

const EMPTY: Paginated<Review> = {
  data: [],
  meta: { total: 0, page: 1, limit: 50, totalPages: 0 },
}

const STATUS_VALUES: ReviewStatus[] = ['pending', 'approved', 'rejected']

/** Below this, freshness scores point at stock sitting too long before delivery. */
const FRESHNESS_CONCERN = 3.5

const ReviewsPage = () => {
  const { t } = useTranslation()
  const [status, setStatus] = useState<ReviewStatus>('pending')

  const fetchReviews = useCallback(
    () => reviewService.listForModeration({ status, limit: 50 }),
    [status],
  )
  const {
    data: reviews,
    loading,
    refetch,
  } = useFetch<Paginated<Review>>(fetchReviews, [status], EMPTY)

  const fetchFreshness = useCallback(() => reviewService.freshnessReport(), [])
  const { data: freshness } = useFetch<FreshnessReportRow[]>(fetchFreshness, [], [])

  const moderate = async (id: string, next: 'approved' | 'rejected') => {
    try {
      await reviewService.moderate(id, { status: next })
      toast.success(
        next === 'approved' ? t('admin.reviews.published') : t('admin.reviews.rejected'),
      )
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('admin.reviews.updateFailed'))
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        eyebrow={t('admin.sections.customers')}
        title={t('admin.reviews.title')}
        description={t('admin.reviews.count', { count: reviews.meta.total })}
        toolbar={
          <Segmented
            options={STATUS_VALUES.map((value) => ({
              value,
              label: translateLabel('reviewStatus', value),
            }))}
            value={status}
            onChange={setStatus}
            ariaLabel={t('admin.reviews.filterAria')}
          />
        }
      />

      {freshness.length > 0 && (
        <Card padding="none" className="freshness-panel">
          <CardHeader
            title={t('admin.reviews.freshnessTitle')}
            subtitle={t('admin.reviews.freshnessSubtitle')}
          />
          <ul className="freshness-panel__list">
            {freshness.slice(0, 5).map((row) => (
              <li key={row.productName}>
                <span className="freshness-panel__name">{row.productName}</span>
                <Rating value={row.avgFreshness} size="sm" />
                <strong className={row.avgFreshness < FRESHNESS_CONCERN ? 'tone-bad' : 'tone-ok'}>
                  {Number(row.avgFreshness).toFixed(1)}
                </strong>
                <em>{row.sampleSize} reviews</em>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card padding="none">
        <Table
          columns={buildReviewColumns(t, {
            onApprove: (id) => moderate(id, 'approved'),
            onReject: (id) => moderate(id, 'rejected'),
          })}
          rows={reviews.data}
          loading={loading}
          getRowKey={(row) => row.id}
          emptyTitle={t('admin.reviews.emptyTitle', {
            status: translateLabel('reviewStatus', status).toLowerCase(),
          })}
          emptyDescription={status === 'pending' ? t('admin.reviews.emptyPending') : undefined}
        />
      </Card>
    </AdminLayout>
  )
}

export default ReviewsPage
