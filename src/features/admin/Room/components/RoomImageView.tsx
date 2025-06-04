import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { productServices } from '../RoomApis'
import { ADMIN_PATH } from 'common/constants/paths'
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer'

const RoomImageView = () => {
  const navigate = useNavigate()
  const [room, setRoom] = useState<any>({})
  const { id } = useParams()

  const getRoomById = async (id: any) => {
    const res = await productServices.getById(id)
    if (res) {
      setRoom(res)
    }
    return res
  }

  useEffect(() => {
    getRoomById(id)
  }, [])

  return (
    <>
      <div className='w-full flex flex-col items-center justify-center p-4'>
        <div className='w-full max-w-5xl'>
          <div className='flex space-x-4 mb-8'>
            <Button danger onClick={() => navigate(ADMIN_PATH.ROOM)}>
              Thoát
            </Button>
            <Button htmlType='submit' className='btn-confirm'>
              Thuê phòng ngay
            </Button>
          </div>

          {/* Ảnh panorama */}
          <div className='space-y-10'>
            {room.room_photos &&
              room.room_photos.length > 0 &&
              room.room_photos.map((item: any, index: number) => (
                <div key={index} className='w-full h-[500px]'>
                  <ReactPhotoSphereViewer src={item?.url} height='100%' width='100%' />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default RoomImageView
