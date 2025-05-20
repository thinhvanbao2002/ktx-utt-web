import { Button, Col, Form, Input, Row, Select } from 'antd'
import RadiusSelection from 'common/components/select/RadiusSelection'
import { TEXT_CONSTANTS } from 'common/constants/constants'
import { categoryServices } from 'features/admin/Building/BuildingApis'
import { useEffect, useState } from 'react'
const { Option } = Select
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import 'react-quill/dist/quill.snow.css'
import UploadMultipart from 'common/components/upload/UploadMultipartComponent'
import Config from 'common/constants/config'
import { useLocation } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import { openNotification } from 'common/utils'
import { productServices } from '../RoomApis'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PATH } from 'common/constants/paths'
import { roomTypeServices } from 'features/admin/RoomType/RoomTypeApis'
import { deviceServices } from 'features/admin/Device/DeviceApis'
import { IRoom } from '../Room.props'

const AddEditProduct = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [payload, setPayload] = useState<any>({
    q: '',
    limit: 5
  })
  const [categoryListOptions, setCategoryListOptions] = useState<any>([])
  const [roomTypeListOptions, setRoomTypeListOptions] = useState<any>([])
  const [deviceListOptions, setDeviceListOptions] = useState<any>([])
  const [images, setImages] = useState<Array<any>>([])
  const [devices, setDevices] = useState<Array<any>>([])
  console.log('🚀 ~ AddEditProduct ~ devices:', devices)
  const location = useLocation()
  const { state } = location || {}
  const record = state?.record || {}

  const initialValues = {
    room_number: record?.room_number,
    building_id: record?.building?.id,
    room_type_id: record?.room_type?.id,
    product_code: record?.product_code,
    price: record?.room_type?.price,
    quantity: record?.quantity,
    image: record?.image,
    devices: record?.room_devices?.map((item: any) => {
      return item?.device?.id
    }),
    floor: record?.floor,
    max_student: record?.room_type?.max_student
  }

  useEffect(() => {
    if (record && record.product_photo && record.product_photo.length) {
      const convertProductPhoto = record?.product_photo.map((p: any) => {
        return {
          uid: uuidv4(),
          name: uuidv4(),
          url: p?.url
        }
      })
      setImages(convertProductPhoto)
      form.setFieldsValue({ product_photo: convertProductPhoto })
    }
  }, [])

  const onChangeSearchCategory = async (value: any) => {
    setPayload({
      q: value
    })
  }

  const handleGetCategoryListOptions = async (payload: any) => {
    try {
      const res = await categoryServices.get(payload)
      setCategoryListOptions(
        res.data.map((item: any) => {
          return {
            text: item?.name,
            value: item?.id
          }
        })
      )
    } catch (error) {
      console.log('🚀 ~ handleGetCategoryListOptions ~ error:', error)
    }
  }

  const handleGetRoomTypeListOptions = async (payload: any) => {
    try {
      const res = await roomTypeServices.get(payload)

      setRoomTypeListOptions(
        res.data.map((item: any) => {
          return {
            text: item?.name,
            value: item?.id
          }
        })
      )
    } catch (error) {
      console.log('🚀 ~ handleGetRoomTypeListOptions ~ error:', error)
    }
  }

  const handleGetDeviceListOptions = async (payload: any) => {
    try {
      const res = await deviceServices.get(payload)
      console.log('🚀 ~ handleGetDeviceListOptions ~ res:', res)

      setDeviceListOptions(
        res.data.map((item: any) => {
          return {
            text: item?.name,
            value: item?.id
          }
        })
      )
    } catch (error) {
      console.log('🚀 ~ handleGetRoomTypeListOptions ~ error:', error)
    }
  }

  useEffect(() => {
    handleGetCategoryListOptions(payload)
    handleGetRoomTypeListOptions(payload)
    handleGetDeviceListOptions(payload)
  }, [payload])

  const handleSubmit = async (value: IRoom) => {
    const payLoadRoom = {
      id: record?.id,
      room_number: value?.room_number,
      room_type_id: value?.room_type_id,
      building_id: value?.building_id,
      quantity: Number(value?.quantity),
      image: value?.image,
      room_photos: value?.room_photos,
      floor: Number(value?.floor),
      device_ids: devices
    }

    let res

    try {
      if (record.id) {
        res = await productServices.patch(payLoadRoom)
      } else {
        res = await productServices.post(payLoadRoom)
      }
      if (res.status == 1) {
        if (record.id) {
          openNotification('success', 'Thành công', 'Cập nhật thành công')
          navigate(`${ADMIN_PATH.ROOM}`)
        } else {
          openNotification('success', 'Thành công', 'Thêm mới thành công')
          navigate(`${ADMIN_PATH.ROOM}`)
        }
      }
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
    }
  }

  return (
    <Form
      form={form}
      name='addAddEditProduct'
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
                message: `Mã phòng: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <Input placeholder='Nhập mã phòng' />
          </Form.Item>
        </Col>

        <Col md={8}>
          <Form.Item
            name={'room_type_id'}
            label={'Loại phòng'}
            rules={[
              {
                required: true,
                message: `Loại phòng: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <RadiusSelection
              showSearch={true}
              onSearch={(e) => onChangeSearchCategory(e)}
              placeholder={'Loại phòng'}
              options={roomTypeListOptions}
            />
          </Form.Item>
        </Col>

        <Col md={8}>
          <Form.Item
            name={'building_id'}
            label={'Tòa nhà'}
            rules={[
              {
                required: true,
                message: `Tòa nhà: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <RadiusSelection
              showSearch={true}
              onSearch={(e) => onChangeSearchCategory(e)}
              placeholder={'Tòa nhà'}
              options={categoryListOptions}
            />
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
                message: `Tầng: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              },
              {
                pattern: Config._reg.number,
                message: `Tầng: Phải là số`
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
                message: `Thiết bị: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <Select
              mode='multiple'
              allowClear
              style={{ width: '100%' }}
              placeholder='Chọn thiết bị'
              onChange={(value) => {
                setDevices(value)
              }}
            >
              {deviceListOptions.map((device: any) => (
                <Option key={device.value} value={device.value}>
                  {device.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12} className='pl-[12px]'>
          <Form.Item name='room_photos' label='Ảnh chi tiết sản phẩm'>
            <UploadMultipart
              defaultFileList={images}
              onFileListChange={(images) => {
                const standardizationImage = images.map((item: any) => {
                  if (item?.response?.url) {
                    return {
                      uid: item?.uid,
                      name: item?.name,
                      url: item?.response.url
                    }
                  }
                  return {
                    uid: item?.uid,
                    name: item?.name,
                    url: item.url
                  }
                })
                form.setFieldsValue({ room_photos: standardizationImage })
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24} className='mt-10'>
        <Col span={12}> </Col>
        <Col span={12} className='flex items-center justify-end'>
          <Button
            danger
            onClick={() => {
              navigate('/room')
            }}
          >
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

export default AddEditProduct
