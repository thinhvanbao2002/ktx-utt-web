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
import { IProduct } from '../Room.props'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PATH } from 'common/constants/paths'
import { roomTypeServices } from 'features/admin/RoomType/RoomTypeApis'

const devices = [
  { id: 1, name: 'Máy lạnh' },
  { id: 2, name: 'Máy chiếu' },
  { id: 3, name: 'Đèn LED' }
]

const AddEditProduct = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [payload, setPayload] = useState<any>({
    q: '',
    limit: 5
  })
  const [categoryListOptions, setCategoryListOptions] = useState<any>([])
  const [roomTypeListOptions, setRoomTypeListOptions] = useState<any>([])
  const [images, setImages] = useState<Array<any>>([])
  const location = useLocation()
  const { state } = location || {}
  const record = state?.record || {}
  console.log('🚀 ~ AddEditProduct ~ record:', record)

  const initialValues = {
    name: record?.name,
    category_id: record?.category_id,
    product_type: record?.product_type,
    product_code: record?.product_code,
    price: record?.price,
    quantity: record?.quantity,
    image: record?.image,
    description: record?.description,
    introduce: record?.introduce
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

      console.log('🚀 ~ handleGetRoomTypeListOptions ~ res:', res)

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

  useEffect(() => {
    handleGetCategoryListOptions(payload)
    handleGetRoomTypeListOptions(payload)
    // setImages(defaultFile)
    // form.setFieldsValue({ images: defaultFile })
  }, [payload])

  const handleSubmit = async (value: IProduct) => {
    const payLoadAccount = {
      id: record?.id,
      name: value?.name,
      category_id: value?.category_id,
      price: value?.price,
      product_type: value?.product_type,
      quantity: Number(value?.quantity),
      description: value?.description,
      image: value?.image,
      product_photo: value?.product_photo,
      introduce: value?.introduce,
      product_code: value?.product_code
    }
    console.log('🚀 ~ handleSubmit ~ payLoadAccount:', payLoadAccount)
    let res
    try {
      if (record.id) {
        res = await productServices.put(payLoadAccount)
      } else {
        res = await productServices.post(payLoadAccount)
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
            <Input />
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
            name='price'
            label='Giá tiền'
            rules={[
              {
                required: true,
                message: `Giá tiền: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              },
              {
                pattern: Config._reg.number,
                message: `Giá tiền: Phải là số`
              }
            ]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='quantity' label='Số lượng sinh viên tối đa'>
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='image'
            label='Danh sách thiết bị'
            rules={[
              {
                required: true,
                message: `Ảnh sản phẩm: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <Select
              mode='multiple'
              allowClear
              style={{ width: '100%' }}
              placeholder='Chọn thiết bị'
              onChange={(value) => console.log('Selected devices:', value)}
            >
              {devices.map((device) => (
                <Option key={device.id} value={device.id}>
                  {device.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12} className='pl-[12px]'>
          <Form.Item name='product_photo' label='Ảnh chi tiết sản phẩm'>
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
                form.setFieldsValue({ product_photo: standardizationImage })
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
              navigate('/ad-product')
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
