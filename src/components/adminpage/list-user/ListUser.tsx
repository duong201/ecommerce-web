import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../../common/components/layout/AdminLayout'
import { buildUserColumns } from '../../../common/config/tableColumns'
import { useFetch } from '../../../common/hooks/useFetch'
import { userService } from '../../../services'
import { toast } from '../../../common/utils/toast'
import { SearchIcon } from '../../../common/components/ui/icons'
import {
  Card,
  Input,
  PageHeader,
  Pagination,
  Table,
  useDialog,
} from '../../../common/components/ui'
import type { Paginated, User } from '../../../interface'

const EMPTY: Paginated<User> = {
  data: [],
  meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
}

const SEARCH_DEBOUNCE_MS = 300

/** Customer and staff accounts. Deleting is a soft disable; orders are kept. */
const ListUser = () => {
  const { t } = useTranslation()
  const { confirm } = useDialog()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')

  // Debounced so typing a name does not fire a request per keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(search.trim())
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [search])

  const fetchUsers = useCallback(
    () => userService.list({ page, limit: 20, q: query || undefined }),
    [page, query],
  )
  const {
    data: users,
    loading,
    refetch,
  } = useFetch<Paginated<User>>(fetchUsers, [page, query], EMPTY)

  const remove = async (user: User) => {
    const confirmed = await confirm({
      title: `Disable ${user.fullName}?`,
      description: t('admin.users.disableDescription'),
      confirmLabel: t('admin.users.disableConfirm'),
      tone: 'danger',
    })
    if (!confirmed) return

    try {
      await userService.remove(user.id)
      toast.success(t('admin.users.disabled'))
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('admin.users.disableFailed'))
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        eyebrow={t('admin.sections.customers')}
        title={t('admin.users.title')}
        description={t('admin.users.count', { count: users.meta.total })}
        toolbar={
          <Input
            className="admin-search"
            type="search"
            size="sm"
            aria-label={t('admin.users.searchAria')}
            placeholder={t('admin.users.searchPlaceholder')}
            iconLeft={<SearchIcon />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
      />

      <Card padding="none">
        <Table
          columns={buildUserColumns(t, { onDelete: remove })}
          rows={users.data}
          loading={loading}
          getRowKey={(row) => row.id}
          emptyTitle={t('admin.users.emptyTitle')}
        />
      </Card>

      <Pagination
        page={users.meta.page}
        totalPages={users.meta.totalPages}
        total={users.meta.total}
        onChange={setPage}
      />
    </AdminLayout>
  )
}

export default ListUser
