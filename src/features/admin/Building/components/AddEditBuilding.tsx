import { Button, Col, Form, Input, Row } from 'antd'
import { TEXT_CONSTANTS } from 'common/constants/constants'

import RadiusSelection from 'common/components/select/RadiusSelection'
import { ICategory } from '../Building.props'
import TextArea from 'antd/es/input/TextArea'

interface IAddEditCategory {
  onFinish?: (value: any) => void
  onClose?: () => void
  rowSelected?: ICategory
}

export const AddEditCategory = ({ onFinish, onClose, rowSelected }: IAddEditCategory) => {
  const [form] = Form.useForm()

  const initialvalue = {
    name: rowSelected?.name,
    address: rowSelected?.address,
    note: rowSelected?.note,
    status: rowSelected?.status
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
        <Col span={12}>
          <Form.Item
            name='name'
            label='Tên tòa nhà'
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
            name='address'
            label='Địa chỉ'
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
        <Col span={24}>
          <Form.Item name='note' label='Mô tả'>
            <TextArea rows={4} placeholder='Nhập mô tả tòa nhà' maxLength={2000} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        {rowSelected && (
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
        )}
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
