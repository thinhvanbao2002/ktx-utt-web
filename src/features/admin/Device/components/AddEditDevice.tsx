import { Button, Col, Form, Input, Row } from 'antd'
import { TEXT_CONSTANTS } from 'common/constants/constants'

import { IDevice } from '../Device.props'

interface IAddEditCategory {
  onFinish?: (value: any) => void
  onClose?: () => void
  rowSelected?: IDevice
}

export const AddEditCategory = ({ onFinish, onClose, rowSelected }: IAddEditCategory) => {
  const [form] = Form.useForm()

  const initialvalue = {
    device_code: rowSelected?.device_code,
    name: rowSelected?.name
  }

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
        <Col span={24}>
          <Form.Item
            name='device_code'
            label='Mã thiết bị'
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
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            name='name'
            label='Tên thiết bị'
            rules={[
              {
                required: true,
                message: `Địa chỉ: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
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
