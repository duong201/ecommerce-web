import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './InventoryPage.scss'
import AdminLayout from '../../../common/components/layout/AdminLayout'
import { buildBatchColumns, buildMovementColumns } from '../../../common/config/tableColumns'
import { useFetch } from '../../../common/hooks/useFetch'
import { inventoryService } from '../../../services'
import { formatPrice, formatQuantity } from '../../../common/utils/format'
import { toast } from '../../../common/utils/toast'
import {
  Button,
  Card,
  Checkbox,
  PageHeader,
  Segmented,
  Table,
  TableActions,
  useDialog,
} from '../../../common/components/ui'
import type { TableColumn } from '../../../common/components/ui'
import type { InventoryBatch, InventoryLevel, Paginated, StockMovement } from '../../../interface'

const EMPTY_BATCHES: Paginated<InventoryBatch> = {
  data: [],
  meta: { total: 0, page: 1, limit: 50, totalPages: 0 },
}
const EMPTY_MOVEMENTS: Paginated<StockMovement> = {
  data: [],
  meta: { total: 0, page: 1, limit: 50, totalPages: 0 },
}

type Tab = 'batches' | 'levels' | 'movements'

const TABS = [
  { value: 'batches' as const, label: 'admin.inventory.tabBatches' },
  { value: 'levels' as const, label: 'admin.inventory.tabLevels' },
  { value: 'movements' as const, label: 'admin.inventory.tabMovements' },
]

const LEVEL_COLUMNS: TableColumn<InventoryLevel>[] = [
  {
    key: 'variantId',
    header: 'admin.columns.variant',
    render: (row) => <span className="cell-mono">{row.variantId.slice(0, 8)}</span>,
  },
  {
    key: 'onHandQuantity',
    header: 'admin.columns.onHand',
    align: 'right',
    numeric: true,
    render: (row) => formatQuantity(row.onHandQuantity),
  },
  {
    key: 'reservedQuantity',
    header: 'admin.columns.reserved',
    align: 'right',
    numeric: true,
    render: (row) => formatQuantity(row.reservedQuantity),
  },
  {
    key: 'availableQuantity',
    header: 'admin.columns.available',
    align: 'right',
    numeric: true,
    render: (row) => (
      <span className={row.availableQuantity > 0 ? 'tone-ok' : 'tone-bad'}>
        {formatQuantity(row.availableQuantity)}
      </span>
    ),
  },
]

/**
 * Stock screen. Three views over the same inventory: the batches themselves,
 * the rolled-up level per variant, and the movement ledger that explains how a
 * level got where it is.
 */
const InventoryPage = () => {
  const { t } = useTranslation()
  const { confirm, prompt } = useDialog()
  const [tab, setTab] = useState<Tab>('batches')
  const [expiringOnly, setExpiringOnly] = useState(false)

  const fetchBatches = useCallback(
    () =>
      inventoryService.listBatches({
        limit: 50,
        inStockOnly: expiringOnly || undefined,
        expiringWithinDays: expiringOnly ? 3 : undefined,
      }),
    [expiringOnly],
  )
  const {
    data: batches,
    loading: batchesLoading,
    refetch: refetchBatches,
  } = useFetch<Paginated<InventoryBatch>>(fetchBatches, [expiringOnly], EMPTY_BATCHES)

  const fetchLevels = useCallback(() => inventoryService.listLevels(), [])
  const { data: levels, loading: levelsLoading } = useFetch<InventoryLevel[]>(fetchLevels, [], [])

  const fetchMovements = useCallback(() => inventoryService.listMovements({ limit: 50 }), [])
  const { data: movements, loading: movementsLoading } = useFetch<Paginated<StockMovement>>(
    fetchMovements,
    [],
    EMPTY_MOVEMENTS,
  )

  const writeOff = async (batch: InventoryBatch) => {
    const quantity = await prompt({
      title: t('admin.inventory.writeOffFrom', { batch: batch.batchCode }),
      description: `${formatQuantity(batch.remainingQuantity)} remaining in this batch.`,
      label: t('admin.inventory.writeOffQuantity'),
      inputType: 'number',
      required: true,
      confirmLabel: t('admin.inventory.continue'),
      validate: (value) => {
        const amount = Number(value)
        if (amount <= 0) return t('admin.inventory.quantityPositive')
        if (amount > Number(batch.remainingQuantity)) return t('admin.inventory.quantityTooLarge')
        return null
      },
    })
    if (quantity === null) return

    const reason = await prompt({
      title: t('admin.inventory.writeOffWhy'),
      label: t('admin.inventory.writeOffReason'),
      defaultValue: t('admin.inventory.writeOffDefault'),
      inputType: 'multiline',
      confirmLabel: t('admin.inventory.writeOffConfirm'),
      tone: 'danger',
    })
    if (reason === null) return

    try {
      await inventoryService.recordMovement({
        batchId: batch.id,
        type: 'spoilage',
        quantityDelta: -Number(quantity),
        reason: reason || undefined,
      })
      toast.success(t('admin.inventory.writeOffRecorded'))
      refetchBatches()
    } catch (error) {
      toast.error((error as Error).message || t('admin.inventory.writeOffFailed'))
    }
  }

  const markdown = async (batch: InventoryBatch) => {
    const price = await prompt({
      title: t('admin.inventory.markDownBatch', { batch: batch.batchCode }),
      description: `Unit cost is ${formatPrice(batch.unitCostAmount)}. The markdown price shows on the storefront's deals rail.`,
      label: t('admin.inventory.markdownPrice'),
      inputType: 'number',
      required: true,
      confirmLabel: t('admin.inventory.markdownConfirm'),
      validate: (value) => (Number(value) < 0 ? t('admin.inventory.priceNegative') : null),
    })
    if (price === null) return

    try {
      await inventoryService.updateBatch(batch.id, { markdownPriceAmount: Number(price) })
      toast.success(t('admin.inventory.markdownSet'))
      refetchBatches()
    } catch (error) {
      toast.error((error as Error).message || t('admin.inventory.markdownFailed'))
    }
  }

  const discard = async (batch: InventoryBatch) => {
    const confirmed = await confirm({
      title: t('admin.inventory.discardBatch', { batch: batch.batchCode }),
      description: t('admin.inventory.discardDescription'),
      confirmLabel: t('admin.inventory.discardConfirm'),
      tone: 'danger',
    })
    if (!confirmed) return

    try {
      const result = await inventoryService.removeBatch(batch.id)
      toast.success(
        result.deleted ? t('admin.inventory.batchDeleted') : t('admin.inventory.batchDiscarded'),
      )
      refetchBatches()
    } catch (error) {
      toast.error((error as Error).message || t('admin.inventory.discardFailed'))
    }
  }

  const batchColumns: TableColumn<InventoryBatch>[] = [
    ...buildBatchColumns(t),
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (row) =>
        row.status === 'active' ? (
          <TableActions>
            <Button variant="link" size="sm" onClick={() => markdown(row)}>
              {t('admin.inventory.markDown')}
            </Button>
            <Button variant="link" size="sm" onClick={() => writeOff(row)}>
              {t('admin.inventory.writeOff')}
            </Button>
            <Button variant="link" size="sm" className="is-danger" onClick={() => discard(row)}>
              {t('admin.inventory.discard')}
            </Button>
          </TableActions>
        ) : null,
    },
  ]

  return (
    <AdminLayout>
      <PageHeader
        eyebrow={t('admin.sections.stock')}
        title={t('admin.inventory.title')}
        description={t('admin.inventory.description')}
        toolbar={
          <Segmented
            options={TABS.map((tab) => ({ ...tab, label: t(tab.label) }))}
            value={tab}
            onChange={setTab}
            ariaLabel={t('admin.inventory.viewAria')}
            variant="tabs"
          />
        }
      />

      {tab === 'batches' && (
        <>
          <div className="inventory__filters">
            <Checkbox
              label={t('admin.inventory.expiringOnly')}
              checked={expiringOnly}
              onChange={(event) => setExpiringOnly(event.target.checked)}
            />
          </div>

          <Card padding="none">
            <Table
              columns={batchColumns}
              rows={batches.data}
              loading={batchesLoading}
              getRowKey={(row) => row.id}
              emptyTitle={
                expiringOnly
                  ? t('admin.inventory.emptyExpiring')
                  : t('admin.inventory.emptyBatches')
              }
              emptyDescription={
                expiringOnly
                  ? t('admin.inventory.emptyExpiringDescription')
                  : t('admin.inventory.emptyBatchesDescription')
              }
            />
          </Card>
        </>
      )}

      {tab === 'levels' && (
        <Card padding="none">
          <Table
            columns={LEVEL_COLUMNS}
            rows={levels}
            loading={levelsLoading}
            getRowKey={(row) => row.variantId}
            emptyTitle={t('admin.inventory.emptyLevels')}
          />
        </Card>
      )}

      {tab === 'movements' && (
        <Card padding="none">
          <Table
            columns={buildMovementColumns(t)}
            rows={movements.data}
            loading={movementsLoading}
            density="compact"
            getRowKey={(row) => row.id}
            emptyTitle={t('admin.inventory.emptyMovements')}
            emptyDescription={t('admin.inventory.emptyMovementsDescription')}
          />
        </Card>
      )}
    </AdminLayout>
  )
}

export default InventoryPage
