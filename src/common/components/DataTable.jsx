import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

/**
 * Generic admin table. `columns` is an array of
 * { key, header, className, render(row) } — `render` is optional and
 * defaults to `row[key]`.
 */
const DataTable = ({ columns, rows, getRowKey = (row) => row.id }) => (
  <TableContainer component={Paper} className="table">
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col.key} className={`tableCell ${col.className || ''}`}>
              {col.header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={getRowKey(row)}>
            {columns.map((col) => (
              <TableCell key={col.key} className={`tableCell ${col.className || ''}`}>
                {col.render ? col.render(row) : row[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export default DataTable
