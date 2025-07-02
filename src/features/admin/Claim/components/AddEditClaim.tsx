import { Button, Col, Form, Input, Row, Select } from 'antd'
import { IClaim } from '../Claim.props'

interface IAddEditClaim {
  onFinish?: (value: any) => void
  onClose?: () => void
  rowSelected?: IClaim
}

export const AddEditClaim = ({ onFinish, onClose, rowSelected }: IAddEditClaim) => {
  const [form] = Form.useForm()

  const isEdit = !!rowSelected?.id
  const initialvalue = isEdit
    ? {
        student_code: rowSelected?.student_code,
        student_name: rowSelected?.student_name,
        room_number: rowSelected?.room_number,
        content: rowSelected?.content,
        supporter: rowSelected?.supporter,
        status: rowSelected?.status
      }
    : { status: 'pending' }

  return (
    <Form
      form={form}
      initialValues={initialvalue}
      name='addEditClaim'
      labelAlign='left'
      onFinish={onFinish}
      scrollToFirstError
      layout='vertical'
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name='student_code'
            label='Mã sinh viên'
            rules={[{ required: true, message: 'Mã sinh viên không được để trống' }]}
          >
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='student_name'
            label='Tên sinh viên'
            rules={[{ required: true, message: 'Tên sinh viên không được để trống' }]}
          >
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name='room_number'
            label='Phòng'
            rules={[{ required: true, message: 'Phòng không được để trống' }]}
          >
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='supporter' label='Người hỗ trợ'>
            <Input disabled={!isEdit} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            name='content'
            label='Nội dung yêu cầu'
            rules={[{ required: true, message: 'Nội dung không được để trống' }]}
          >
            <Input.TextArea rows={4} disabled={isEdit} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          {isEdit && (
            <Form.Item
              name='status'
              label='Trạng thái'
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select>
                <Select.Option value='pending'>Chờ xử lý</Select.Option>
                <Select.Option value='resolved'>Đã xử lý</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Col>
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
