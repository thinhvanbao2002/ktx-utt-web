/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Table, Space, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons'
import AddEditRoom from '../components/AddEditRoom'
import { IRoom } from '../Room.props'
import DeleteRoom from '../components/DeleteRoom'
import RoomImageViewer from '../components/RoomImageViewer'

const RoomPage = () => {
  const [isAddEditModalVisible, setIsAddEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null)
  const navigate = useNavigate()

  const handleAddEdit = (room: IRoom | null) => {
    console.log('11111111')

    setSelectedRoom(room)
    setIsAddEditModalVisible(true)
  }

  const handleDelete = (room: IRoom) => {
    setSelectedRoom(room)
    setIsDeleteModalVisible(true)
  }

  const handleViewImages = (room: IRoom) => {
    setSelectedRoom(room)
    setIsImageViewerVisible(true)
  }

  const handleRentRoom = (room: IRoom) => {
    navigate(`/rental/request/${room.id}`)
  }

  const columns = [
    {
      title: 'Mã phòng',
      dataIndex: 'roomNumber',
      key: 'roomNumber'
    },
    {
      title: 'Loại phòng',
      dataIndex: 'roomType',
      key: 'roomType'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IRoom) => (
        <Space size='middle'>
          <Button
            type='primary'
            icon={<HomeOutlined />}
            onClick={() => {
              console.log('11111111111111')
              handleRentRoom(record)
            }}
          >
            Thuê phòng
          </Button>
          <Button type='primary' icon={<EditOutlined />} onClick={() => handleAddEdit(record)}>
            Sửa
          </Button>
          <Button type='primary' danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            Xóa
          </Button>
          {record.images && record.images.length > 0 && (
            <Button type='primary' onClick={() => handleViewImages(record)}>
              Xem ảnh
            </Button>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className='p-6'>
      <Card
        title='Quản lý phòng'
        extra={
          <Button type='primary' icon={<PlusOutlined />} onClick={() => handleAddEdit(null)}>
            Thêm phòng
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={[]} // TODO: Add data source
          rowKey='id'
        />
      </Card>

      <AddEditRoom
        visible={isAddEditModalVisible}
        onCancel={() => setIsAddEditModalVisible(false)}
        room={selectedRoom}
      />

      <DeleteRoom visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} room={selectedRoom} />

      <RoomImageViewer
        visible={isImageViewerVisible}
        onCancel={() => setIsImageViewerVisible(false)}
        room={selectedRoom}
      />
    </div>
  )
}

export default RoomPage
