import { useCallback, useEffect, useState } from 'react'
import './adminDashbroad.css'
import { adminDashboardServices } from './adminDashboardApis'
import { formatPrice } from 'common/utils'
import { useAuth } from 'hooks/useAuth'
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer'
import StudentRegisterBarChart from './components/StudentRegisterBarChart'

function AdminDashboardScreen() {
  const [adminDashboardData, setAdminDashboardData] = useState<any>({})
  const { user } = useAuth()
  console.log('🚀 ~ AdminDashboardScreen ~ user:', user)

  const getAdminDashboarData = useCallback(async () => {
    try {
      const res = await adminDashboardServices.post()
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
      {user?.role === 'admin' && (
        <>
          <div className='w-full flex items-center justify-between text-custom-sm text-while'>
            <div className='w-[20%] h-[100px] shadow-block rounded-md bg-baseBackground flex items-center justify-center  '>
              <div className='text-center'>
                <div>Sinh viên</div>
                <div className='font-semibold text-custom-xl'>{formatPrice(adminDashboardData.student)}</div>
              </div>
            </div>
            <div className='w-[20%] h-[100px] shadow-block rounded-md bg-baseBackground flex items-center justify-center  '>
              <div className='text-center'>
                <div>Phòng</div>
                <div className='font-semibold text-custom-xl'>{formatPrice(adminDashboardData.room)}</div>
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
          <StudentRegisterBarChart />
        </>
      )}
      {user?.role === 'student' && <ReactPhotoSphereViewer src='/panoUTT.jpg' height='100%' width='100%' />}
    </>
  )
}

export default AdminDashboardScreen
