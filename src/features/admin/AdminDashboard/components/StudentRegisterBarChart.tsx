import React, { useCallback, useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'
import { adminDashboardServices } from '../adminDashboardApis'

const StudentRegisterBarChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [data, setData] = useState<{ month: number; count: number }[]>([])
  const listYear = [2021, 2022, 2023, 2024, 2025, 2026, 2027]

  const getStatistics = useCallback(async (year: number) => {
    try {
      const res = await adminDashboardServices.getStudentRegisterStatistics(year)
      if (res && res) {
        setData(res as unknown as { month: number; count: number }[])
      }
    } catch (error) {
      console.log('---- error ----',error)
    }
  }, [])

  useEffect(() => {
    getStatistics(selectedYear)
  }, [selectedYear, getStatistics])

  // Đảm bảo luôn có đủ 12 tháng, kể cả không có data
  const fullData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const found = data.find((d: any) => d.month === month)
    return { month, count: found ? found.count : 0 }
  })

  const monthLabels = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
  ]
  const colors = [
    '#4e73df',
    '#1cc88a',
    '#36b9cc',
    '#f6c23e',
    '#e74a3b',
    '#858796',
    '#fd7e14',
    '#20c997',
    '#6f42c1',
    '#f8f9fc',
    '#5a5c69',
    '#e83e8c'
  ]

  return (
    <div className='bg-white rounded-lg p-6 mt-8 shadow-lg'>
      <h2 className='text-2xl font-bold text-center mb-6 text-gray-700'>
        📊 Thống kê sinh viên đăng ký phòng theo tháng
      </h2>
      <div className='flex justify-center mb-4'>
        <select
          className='p-2 border rounded-md text-lg font-semibold cursor-pointer'
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {listYear.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width='100%' height={400}>
        <BarChart data={fullData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <defs>
            <linearGradient id='colorBar' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#4e73df' stopOpacity={0.8} />
              <stop offset='100%' stopColor='#36b9cc' stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' stroke='#ddd' />
          <XAxis
            dataKey='month'
            stroke='#666'
            tick={{ fontSize: 14 }}
            tickFormatter={(month) => monthLabels[month - 1]}
          />
          <YAxis stroke='#666' tick={{ fontSize: 14 }} allowDecimals={false} />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.length ? (
                <div className='bg-gray-900 text-white p-3 rounded-lg shadow-lg'>
                  <p className='font-bold'>{monthLabels[payload[0].payload.month - 1]}</p>
                  <p>Số sinh viên: {payload[0].value}</p>
                </div>
              ) : null
            }
          />
          <Bar dataKey='count' fill='url(#colorBar)' radius={[12, 12, 0, 0]} barSize={40}>
            <LabelList dataKey='count' position='top' style={{ fill: '#222', fontWeight: 'bold', fontSize: 16 }} />
            {fullData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} cursor='pointer' />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StudentRegisterBarChart
