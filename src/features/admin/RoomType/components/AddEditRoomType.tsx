import { Button, Col, Form, Input, Row, Select } from 'antd'
import { TEXT_CONSTANTS } from 'common/constants/constants'

import { IRoomType } from '../RoomType.props'
import Config from 'common/constants/config'

interface IAddEditCategory {
  onFinish?: (value: any) => void
  onClose?: () => void
  rowSelected?: IRoomType
}

export const AddEditCategory = ({ onFinish, onClose, rowSelected }: IAddEditCategory) => {
  const [form] = Form.useForm()

  const initialvalue = {
    name: rowSelected?.name,
    price: rowSelected?.price,
    max_student: rowSelected?.max_student,
    gender: rowSelected?.gender || 'male'
  }
  console.log('🚀 ~ AddEditCategory ~ initialvalue:', initialvalue)

  return (
    <Form
      form={form}
      initialValues={initialvalue}
      name='addAddEditCategory'
      labelAlign='left'
      onFinish={onFinish}
      scrollToFirstError
      layout='vertical'
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name='name'
            label='Tên loại phòng'
            rules={[
              {
                required: true,
                message: `Họ và tên: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='max_student'
            label='Số sinh viên tối đa'
            rules={[
              {
                required: true,
                message: `Địa chỉ: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              },
              {
                pattern: Config._reg.number,
                message: `Chỉ được phép nhập số`
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name='price'
            label='Giá tiền'
            rules={[
              {
                required: true,
                message: `Địa chỉ: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              },
              {
                pattern: Config._reg.number,
                message: `Giá tiền: Phải là số`
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='gender'
            label='Loại phòng cho'
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng cho nam hay nữ!' }]}
          >
            <Select>
              <Select.Option value='male'>Nam</Select.Option>
              <Select.Option value='female'>Nữ</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        {/* {rowSelected && (
          <Col span={12}>
            <Form.Item
              label=' Trạng thái'
              name='status'
              rules={[
                {
                  required: true,
                  message: 'Trạng thái hoạt động: Bắt buộc chọn'
                }
              ]}
            >
              <RadiusSelection
                onChange={() => {}}
                options={[
                  { value: 1, text: 'Hoạt động' },
                  { value: 2, text: 'Ngừng hoạt động' }
                ]}
                placeholder='Trạng thái'
              />
            </Form.Item>
          </Col>
        )} */}
      </Row>
      <Row gutter={24}>
        <Col span={12}> </Col>
        <Col span={12} className='flex items-center justify-end'>
          <Button danger onClick={onClose}>
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
