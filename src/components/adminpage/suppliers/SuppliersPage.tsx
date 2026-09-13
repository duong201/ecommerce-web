import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../../common/components/layout/AdminLayout'
import { buildSupplierColumns } from '../../../common/config/tableColumns'
import { useFetch } from '../../../common/hooks/useFetch'
import { supplierService } from '../../../services'
import { formatDate } from '../../../common/utils/format'
import { VerifiedOutlinedIcon } from '../../../common/components/ui/icons'
import { Alert, Card, PageHeader, Table } from '../../../common/components/ui'
import './SuppliersPage.scss'
import type { Supplier } from '../../../interface'

/**
 * Supplier list. The banner at the top exists because an expired certificate is
 * a compliance problem, not a data-entry one — it has to be visible before the
 * table is read.
 */
const SuppliersPage = () => {
  const { t } = useTranslation()
  const fetchSuppliers = useCallback(() => supplierService.list(false), [])
  const { data: suppliers, loading } = useFetch<Supplier[]>(fetchSuppliers, [], [])

  const fetchExpiring = useCallback(() => supplierService.expiringCertificates(30), [])
  const { data: expiring } = useFetch<Supplier[]>(fetchExpiring, [], [])

  return (
    <AdminLayout>
      <PageHeader
        eyebrow={t('admin.sections.stock')}
        title={t('admin.suppliers.title')}
        description={`${suppliers.length} growers and wholesalers`}
      />

      {expiring.length > 0 && (
        <Alert
          tone="warning"
          icon={<VerifiedOutlinedIcon />}
          title={`${expiring.length} certificate${expiring.length > 1 ? 's' : ''} lapse within 30 days`}
          className="suppliers__alert"
        >
          {expiring
            .map((supplier) => `${supplier.name} (${formatDate(supplier.certExpiry)})`)
            .join(' · ')}
        </Alert>
      )}

      <Card padding="none">
        <Table
          columns={buildSupplierColumns(t)}
          rows={suppliers}
          loading={loading}
          getRowKey={(row) => row.id}
          emptyTitle={t('admin.suppliers.emptyTitle')}
          emptyDescription={t('admin.suppliers.emptyDescription')}
        />
      </Card>
    </AdminLayout>
  )
}

export default SuppliersPage
