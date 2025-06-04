/* eslint-disable @typescript-eslint/no-unused-vars */
import { Modal, message } from 'antd'
import { IRoom } from '@/types/room'

interface DeleteRoomProps {
  visible: boolean
  onCancel: () => void
  room: IRoom | null
}

const DeleteRoom = ({ visible, onCancel, room }: DeleteRoomProps) => {
  const handleDelete = async () => {
    try {
      // TODO: Implement API call to delete room
      message.success('Xóa phòng thành công')
      onCancel()
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa phòng')
    }
  }

  return (
    <Modal
      title='Xóa phòng'
      open={visible}
      onOk={handleDelete}
      onCancel={onCancel}
      okText='Xóa'
      cancelText='Hủy'
      okButtonProps={{ danger: true }}
    >
      <p>Bạn có chắc chắn muốn xóa phòng {room?.roomNumber}?</p>
    </Modal>
  )
}

export default DeleteRoom
