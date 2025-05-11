import { useCallback, useEffect, useState } from 'react'
import './adminDashbroad.css'
import { adminDashboardServices } from './adminDashboardApis'
import { formatPrice } from 'common/utils'

function AdminDashboardScreen() {
  const [adminDashboardData, setAdminDashboardData] = useState<any>({})

  const getAdminDashboarData = useCallback(async () => {
    try {
      const res = await adminDashboardServices.get()
      if (res) {
        setAdminDashboardData({ ...res?.data })
      }
    } catch (error) {
      console.log('🚀 ~ getAdminDashboarData ~ error:', error)
    }
  }, [])

  useEffect(() => {
    getAdminDashboarData()
  }, [])
  return (
    <>
      <div className='w-full flex items-center justify-between text-custom-sm text-while'>
        <div className='w-[20%] h-[100px] shadow-block rounded-md bg-baseBackground flex items-center justify-center  '>
          <div className='text-center'>
            <div>Sinh viên</div>
            <div className='font-semibold text-custom-xl'>100</div>
          </div>
        </div>
        <div className='w-[20%] h-[100px] shadow-block rounded-md bg-baseBackground flex items-center justify-center  '>
          <div className='text-center'>
            <div>Phòng</div>
            <div className='font-semibold text-custom-xl'>{formatPrice(adminDashboardData.countProducts)}</div>
          </div>
        </div>
        <div className='w-[20%] h-[100px] shadow-block rounded-md bg-baseBackground flex items-center justify-center  '>
          <div className='text-center'>
            <div>Yêu cầu thuê phòng</div>
            <div className='font-semibold text-custom-xl'>{formatPrice(adminDashboardData.countCategories)}</div>
          </div>
        </div>
        <div className='w-[20%] h-[100px] shadow-block rounded-md bg-baseBackground flex items-center justify-center  '>
          <div className='text-center'>
            <div>Yêu cầu hỗ trợ</div>
            <div className='font-semibold text-custom-xl'>{formatPrice(adminDashboardData.countOrders)}</div>
          </div>
        </div>
      </div>
      {/* <div>
        <RevenueChart />
      </div> */}
    </>
  )
}

export default AdminDashboardScreen
