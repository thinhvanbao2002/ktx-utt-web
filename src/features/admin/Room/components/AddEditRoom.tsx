import { Button, Col, Form, Input, Row, Select } from 'antd'
import RadiusSelection from 'common/components/select/RadiusSelection'
import { TEXT_CONSTANTS } from 'common/constants/constants'
import UploadMultipart from 'common/components/upload/UploadMultipartComponent'
import Config from 'common/constants/config'
import { useLocation, useNavigate } from 'react-router-dom'
import { openNotification } from 'common/utils'
import { productServices } from '../RoomApis'
import { ADMIN_PATH } from 'common/constants/paths'
import { IRoom, IRoomResponse } from '../Room.props'
import { useRoomImages } from '../hooks/useRoomImages'
import { useRoomOptions } from '../hooks/useRoomOptions'

const { Option } = Select

const AddEditRoom = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location || {}
  const record = (state?.record || {}) as IRoomResponse

  const { categoryListOptions, roomTypeListOptions, deviceListOptions, handleSearch } = useRoomOptions()

  const { images, handleImagesChange } = useRoomImages({ record, form })

  const initialValues: Partial<IRoom> = {
    room_number: record?.room_number,
    building_id: record?.building?.id,
    room_type_id: record?.room_type?.id,
    price: record?.room_type?.price,
    quantity: record?.quantity,
    image: record?.image,
    devices: record?.room_devices?.map((item) => item?.device?.id),
    floor: record?.floor,
    max_student: record?.room_type?.max_student
  }

  const handleSubmit = async (values: IRoom) => {
    try {
      const payload: IRoom = {
        id: record?.id,
        room_number: values.room_number,
        room_type_id: values.room_type_id,
        building_id: values.building_id,
        quantity: Number(values.quantity),
        image: values.image,
        room_photos: values.room_photos,
        floor: Number(values.floor),
        devices: values.devices
      }

      const res = record.id ? await productServices.patch(payload) : await productServices.post(payload)

      if (res.status) {
        openNotification('success', 'Thành công', record.id ? 'Cập nhật thành công' : 'Thêm mới thành công')
        navigate(ADMIN_PATH.ROOM)
      }
    } catch (error) {
      console.error('Error submitting room:', error)
      openNotification('error', 'Lỗi', 'Có lỗi xảy ra khi lưu thông tin phòng')
    }
  }

  return (
    <Form
      form={form}
      name='addEditRoom'
      labelAlign='left'
      scrollToFirstError
      layout='vertical'
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name='room_number'
            label='Mã phòng'
            rules={[
              {
                required: true,
                message: `Mã phòng: ${TEXT_CONSTANTS.IS_NOT_EMPTY}`
              }
            ]}
          >
            <Input placeholder='Nhập mã phòng' />
          </Form.Item>
        </Col>

        <Col md={8}>
          <Form.Item
            name='room_type_id'
            label='Loại phòng'
            rules={[
              {
                required: true,
                message: `Loại phòng: ${TEXT_CONSTANTS.IS_NOT_EMPTY}`
              }
            ]}
          >
            <RadiusSelection
              showSearch
              onSearch={handleSearch}
              placeholder='Loại phòng'
              options={roomTypeListOptions}
            />
          </Form.Item>
        </Col>

        <Col md={8}>
          <Form.Item
            name='building_id'
            label='Tòa nhà'
            rules={[
              {
                required: true,
                message: `Tòa nhà: ${TEXT_CONSTANTS.IS_NOT_EMPTY}`
              }
            ]}
          >
            <RadiusSelection showSearch onSearch={handleSearch} placeholder='Tòa nhà' options={categoryListOptions} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name='floor'
            label='Tầng'
            rules={[
              {
                required: true,
                message: `Tầng: ${TEXT_CONSTANTS.IS_NOT_EMPTY}`
              },
              {
                pattern: Config._reg.number,
                message: 'Tầng: Phải là số'
              }
            ]}
          >
            <Input placeholder='Nhập tầng' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='price' label='Giá tiền'>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='max_student' label='Số lượng sinh viên tối đa'>
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={8}>
          <Form.Item
            name='devices'
            label='Danh sách thiết bị'
            rules={[
              {
                required: true,
                message: `Thiết bị: ${TEXT_CONSTANTS.IS_NOT_EMPTY}`
              }
            ]}
          >
            <Select mode='multiple' allowClear style={{ width: '100%' }} placeholder='Chọn thiết bị'>
              {deviceListOptions.map((device) => (
                <Option key={device.value} value={device.value}>
                  {device.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12} className='pl-[12px]'>
          <Form.Item name='room_photos' label='Ảnh chi tiết phòng'>
            <UploadMultipart defaultFileList={images} onFileListChange={handleImagesChange} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24} className='mt-10'>
        <Col span={12} />
        <Col span={12} className='flex items-center justify-end'>
          <Button danger onClick={() => navigate(ADMIN_PATH.ROOM)}>
            Thoát
          </Button>
          <Button htmlType='submit' className='btn-confirm' style={{ marginLeft: '10px' }}>
            Xác nhận
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default AddEditRoom
