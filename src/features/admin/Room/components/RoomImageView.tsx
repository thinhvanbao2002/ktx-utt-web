import React, { useEffect, useState } from 'react'
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer'
import '@photo-sphere-viewer/core/index.css'
import { useLocation, useNavigate } from 'react-router'
import { IRoomResponse } from '../Room.props'
import { ADMIN_PATH } from 'common/constants/paths'
import { Button } from 'antd'

function RoomImageView() {
  const location = useLocation()
  const { state } = location || {}
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const record = (state?.record || {}) as IRoomResponse

  useEffect(() => {
    setImages(record.room_photos)
  }, [record])

  console.log('🚀 ~ RoomImageView ~ images:', images)

  return (
    <div className='w-full flex flex-col items-center justify-center p-4'>
      <div className='w-full max-w-5xl'>
        {/* Nút điều hướng - flex container */}
        <div className='flex space-x-4 mb-8'>
          <Button danger onClick={() => navigate(ADMIN_PATH.ROOM)}>
            Thoát
          </Button>
          <Button htmlType='submit' className='btn-confirm'>
            Xác nhận
          </Button>
        </div>

        {/* Ảnh panorama */}
        <div className='space-y-10'>
          {images &&
            images.length > 0 &&
            images.map((item: any, index: number) => (
              <div key={index} className='w-full h-[500px]'>
                <ReactPhotoSphereViewer src={item?.url} height='100%' width='100%' />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default RoomImageView
