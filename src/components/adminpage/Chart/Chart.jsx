import React from 'react'
import './Chart.scss'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: '0', total: 0 },
  { name: 'Tháng 1', total: 4000 },
  { name: 'Tháng 2', total: 2100 },
  { name: 'Tháng 3', total: 1200 },
  { name: 'Tháng 4', total: 1600 },
  { name: 'Tháng 5', total: 800 },
  { name: 'Tháng 6', total: 2700 },
]

const Chart = () => {
  return (
    <>
      <div className="chart">
        <span className="chart-header">Last 6 months (income)</span>
        <div className="chart-body" data-testid="chart-body">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={730}
              height={250}
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#total)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

export default Chart
