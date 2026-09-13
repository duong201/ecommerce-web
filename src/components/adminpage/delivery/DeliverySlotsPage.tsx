import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../../common/components/layout/AdminLayout'
import { buildSlotColumns } from '../../../common/config/tableColumns'
import { useFetch } from '../../../common/hooks/useFetch'
import { deliveryService } from '../../../services'
import { toast } from '../../../common/utils/toast'
import { AddIcon } from '../../../common/components/ui/icons'
import {
  Button,
  Card,
  PageHeader,
  Table,
  TableActions,
  useDialog,
} from '../../../common/components/ui'
import type { TableColumn } from '../../../common/components/ui'
import type { DeliverySlot } from '../../../interface'

/** Delivery windows and their capacity. Capacity is what caps orders per day. */
const DeliverySlotsPage = () => {
  const { t } = useTranslation()
  const { confirm, prompt } = useDialog()
  const [busy, setBusy] = useState(false)

  const fetchSlots = useCallback(() => deliveryService.listAll(), [])
  const { data: slots, loading, refetch } = useFetch<DeliverySlot[]>(fetchSlots, [], [])

  const generate = async () => {
    setBusy(true)
    try {
      const result = await deliveryService.generate({ days: 7, maxOrders: 15 })
      toast.success(`Created ${result.created} slots`)
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('admin.slots.createFailed'))
    } finally {
      setBusy(false)
    }
  }

  const changeCapacity = async (slot: DeliverySlot) => {
    const input = await prompt({
      title: `Capacity for ${slot.label}`,
      description: `${slot.bookedCount} orders are already booked into this slot.`,
      label: t('admin.slots.capacityLabel'),
      inputType: 'number',
      defaultValue: String(slot.maxOrders),
      required: true,
      confirmLabel: t('admin.slots.save'),
      validate: (value) => {
        const amount = Number(value)
        if (amount < 1) return t('admin.slots.capacityMin')
        if (amount < slot.bookedCount) return `At least ${slot.bookedCount} — that many are booked`
        return null
      },
    })
    if (input === null) return

    try {
      await deliveryService.update(slot.id, { maxOrders: Number(input) })
      toast.success(t('admin.slots.capacityUpdated'))
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('admin.slots.capacityFailed'))
    }
  }

  const remove = async (slot: DeliverySlot) => {
    const confirmed = await confirm({
      title: `Delete the ${slot.label} slot?`,
      description: t('admin.slots.deleteDescription'),
      confirmLabel: t('common.delete'),
      tone: 'danger',
    })
    if (!confirmed) return

    try {
      const result = await deliveryService.remove(slot.id)
      toast.success(result.deleted ? t('admin.slots.deleted') : t('admin.slots.closedInstead'))
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('admin.slots.deleteFailed'))
    }
  }

  const columns: TableColumn<DeliverySlot>[] = [
    ...buildSlotColumns(t),
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (row) => (
        <TableActions>
          <Button variant="link" size="sm" onClick={() => changeCapacity(row)}>
            Capacity
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
        title={t('admin.slots.title')}
        description={`${slots.length} slots configured`}
        actions={
          <Button iconLeft={<AddIcon />} loading={busy} onClick={generate}>
            Generate the next 7 days
          </Button>
        }
      />

      <Card padding="none">
        <Table
          columns={columns}
          rows={slots}
          loading={loading}
          getRowKey={(row) => row.id}
          emptyTitle={t('admin.slots.emptyTitle')}
          emptyDescription={t('admin.slots.emptyDescription')}
        />
      </Card>
    </AdminLayout>
  )
}

export default DeliverySlotsPage
