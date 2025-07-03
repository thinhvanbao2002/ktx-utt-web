import { Button, Col, Form, Input, Row } from 'antd'
import Config from 'common/constants/config'
import { TEXT_CONSTANTS } from 'common/constants/constants'
import { IAccount } from '../Student.props'
import RadiusSelection from 'common/components/select/RadiusSelection'

interface IAddEditAccount {
  onFinish?: (value: any) => void
  onClose?: () => void
  rowSelected?: IAccount
}

export const AddEditManager = ({ onFinish, onClose, rowSelected }: IAddEditAccount) => {
  const [form] = Form.useForm()

  console.log('---- row selected ----', rowSelected)

  const initialvalue = {
    name: rowSelected?.name,
    phone: rowSelected?.phone,
    email: rowSelected?.email,
    password: rowSelected?.password,
    avatar: rowSelected?.avatar,
    status: rowSelected?.s,
    role: rowSelected?.role || 'admin',
    cccd_code: rowSelected?.cccd_code,
    class_code: rowSelected?.class_code,
    student_code: rowSelected?.student_code,
    hometown: rowSelected?.hometown,
    room_number: rowSelected?.latest_room?.room_number,
    price: rowSelected?.latest_room?.room_type?.price,
    building: rowSelected?.latest_room?.building?.name
  }
  console.log('🚀 ~ initialvalue:', initialvalue)

  const isEdit = !!rowSelected

  return (
    <Form
      form={form}
      initialValues={initialvalue}
      name='addEditAccount'
      labelAlign='left'
      onFinish={onFinish}
      scrollToFirstError
      layout='vertical'
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name='name'
            label='Họ và tên'
            rules={[
              {
                required: true,
                message: `Họ và tên: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              }
            ]}
          >
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='phone'
            label='Số điện thoại'
            rules={[
              {
                required: true,
                message: `Số điện thoại: ${TEXT_CONSTANTS.IS_NOT_EMPTY}`
              },
              {
                min: 10,
                max: 10,
                pattern: Config._reg.phone,
                message: `Số điện thoại: Không đúng định dạng`
              }
            ]}
          >
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name='email'
            label='Email'
            rules={[
              {
                required: true,
                message: `Email: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
              },
              {
                type: 'email',
                message: `Email: Không đúng định dạng`
              }
            ]}
          >
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='role'
            label='Vai trò'
            rules={[
              {
                required: true,
                message: 'Vai trò: Bắt buộc chọn'
              }
            ]}
          >
            <RadiusSelection
              onChange={(value: string) => {
                initialvalue.role = value
              }}
              defaultValue={'user'}
              options={[
                { value: 'admin', text: 'Quản trị viên' },
                { value: 'student', text: 'Sinh viên' }
              ]}
              placeholder='Chọn vai trò'
              disabled={isEdit}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        {!rowSelected && (
          <Col span={12}>
            <Form.Item
              name='password'
              label='Password'
              rules={[
                {
                  required: true,
                  message: `Password: ${TEXT_CONSTANTS.IS_NOT_EMPTY} `
                },
                {
                  pattern: Config._reg.pass,
                  message: `Password: Không đúng định dạng`
                }
              ]}
            >
              <Input type='password' />
            </Form.Item>
          </Col>
        )}
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
                onChange={(value: string) => {
                  initialvalue.status = value
                }}
                defaultValue={'active'}
                options={[
                  { value: 'active', text: 'Hoạt động' },
                  { value: 'inactive', text: 'Ngừng hoạt động' }
                ]}
                placeholder='Trạng thái'
                disabled={isEdit}
              />
            </Form.Item>
          </Col>
        )}
        <Col span={12}>
          <Form.Item name='cccd_code' label='Mã căn cước'>
            <Input type='cccd_code' disabled={isEdit} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name='class_code' label='Mã lớp'>
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='student_code' label='Mã sinh viên'>
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name='hometown' label='Quê quán'>
            <Input placeholder='Nhập quê quán (không bắt buộc)' disabled={isEdit} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='room_number' label='Phòng hiện tại'>
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name='price' label='Giá phòng (Hiện đang ở)'>
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='building' label='Toà nhà (Hiện đang ở)'>
            <Input disabled={isEdit} />
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
