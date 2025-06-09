import React, { useEffect, useState } from 'react'
import { Form, Input, Row, Col, Card, Button, Select } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'
import { userServices } from '../../../services/userServices'

const { useForm } = Form

const AddEditManager: React.FC = () => {
  const [form] = useForm()
  const navigate = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('student')

  useEffect(() => {
    if (id) {
      setIsEdit(true)
      handleGetUserById(Number(id))
    }
  }, [id])

  const handleGetUserById = async (id: number) => {
    try {
      setIsLoading(true)
      const res = await userServices.getById(id)
      if (res) {
        form.setFieldsValue({
          ...res,
          password: undefined
        })
        setSelectedRole(res.role)
      }
    } catch (error) {
      console.log('🚀 ~ handleGetUserById ~ error:', error)
      message.error('Không thể lấy thông tin người dùng')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true)
      if (isEdit) {
        await userServices.update(Number(id), values)
        message.success('Cập nhật người dùng thành công')
      } else {
        await userServices.create(values)
        message.success('Thêm người dùng thành công')
      }
      navigate(-1)
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
      message.error(isEdit ? 'Cập nhật người dùng thất bại' : 'Thêm người dùng thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='p-6'>
      <Card title={isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'} className='mb-6'>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={{
            role: 'student'
          }}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name='role'
                label='Loại tài khoản'
                rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản' }]}
              >
                <Select
                  options={[
                    { value: 'student', label: 'Sinh viên' },
                    { value: 'admin', label: 'Quản trị viên' }
                  ]}
                  onChange={(value) => setSelectedRole(value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='username'
                label='Tên đăng nhập'
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='password'
                label='Mật khẩu'
                rules={[{ required: !isEdit, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name='full_name'
                label='Họ và tên'
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='email'
                label='Email'
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='phone'
                label='Số điện thoại'
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {selectedRole === 'student' && (
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name='student_code'
                  label='Mã sinh viên'
                  rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='class_code'
                  label='Mã lớp'
                  rules={[{ required: true, message: 'Vui lòng nhập mã lớp' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='cccd_code'
                  label='Số căn cước'
                  rules={[{ required: true, message: 'Vui lòng nhập số căn cước' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          )}

          <div className='flex gap-2 justify-end mt-4'>
            <Button type='primary' htmlType='submit' loading={isLoading}>
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button onClick={() => navigate(-1)}>Thoát</Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default AddEditManager
