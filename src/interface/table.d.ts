import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  className?: string
  render?: (row: T) => ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  getRowKey?: (row: T) => string | number
}
