import React from 'react'
import { render, screen } from '@testing-library/react'
import DataTable from './DataTable'
import type { Column } from '../../interface'

interface Row {
  id: number
  name: string
  price: number
  qty: number
}

const columns: Column<Row>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
  { key: 'total', header: 'Total', render: (row) => `$${row.price * row.qty}` },
]

const rows: Row[] = [
  { id: 1, name: 'Áo thun', price: 10, qty: 2 },
  { id: 2, name: 'Quần jean', price: 20, qty: 3 },
]

describe('DataTable', () => {
  it('renders a header cell for every column', () => {
    render(<DataTable columns={columns} rows={rows} />)
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('renders one row per data item using row[key] by default', () => {
    render(<DataTable columns={columns} rows={rows} />)
    expect(screen.getByText('Áo thun')).toBeInTheDocument()
    expect(screen.getByText('Quần jean')).toBeInTheDocument()
  })

  it('uses a column render function when provided', () => {
    render(<DataTable columns={columns} rows={rows} />)
    expect(screen.getByText('$20')).toBeInTheDocument()
    expect(screen.getByText('$60')).toBeInTheDocument()
  })

  it('renders no data rows when rows is empty', () => {
    render(<DataTable columns={columns} rows={[]} />)
    expect(screen.queryByText('Áo thun')).not.toBeInTheDocument()
  })

  it('supports a custom getRowKey', () => {
    const getRowKey = jest.fn((row) => `row-${row.id}`)
    render(<DataTable columns={columns} rows={rows} getRowKey={getRowKey} />)
    expect(getRowKey).toHaveBeenCalledWith(rows[0])
    expect(getRowKey).toHaveBeenCalledWith(rows[1])
  })
})
