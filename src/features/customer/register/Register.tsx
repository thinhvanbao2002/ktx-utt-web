import { Button, Form, Input } from 'antd'
import Config from 'common/constants/config'
import { openNotification, openNotificationError } from 'common/utils'
import { accountServices } from '../account/accountApis'
import { useNavigate } from 'react-router'
import { USER_PATH } from 'common/constants/paths'

function RegisterPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const res = await accountServices.register(values)
      if (res) {
        openNotification('success', 'Thành công', 'Đăng kí tài khoản thành công')
        navigate(`${USER_PATH.LOGIN}`)
      }
    } catch (error) {
      openNotificationError(error)
    }
  }
  return (
    <div className='w-full h-screen flex items-center justify-center bg-gray-50'>
      <div className='w-[500px] max-h-[90vh] shadow-custom-lg rounded-xl p-4 bg-white overflow-y-auto'>
        <div className='py-6'>
          <div className='mb-6'>
            <img className='w-[400px] mx-auto' src='/logoUTT.png' alt='' />
            <h3 className='text-custom-xl text-center mt-4'>Đăng kí tài khoản</h3>
          </div>
          <Form layout='vertical' form={form}>
            <Form.Item
              label='Họ và tên'
              name='name'
              rules={[
                { required: true, message: 'Vui lòng nhập tên đầy đủ!' },
                { pattern: Config._reg.name, message: 'Họ và tên không hợp lệ!' }
              ]}
            >
              <Input className='h-12' placeholder='Nhập họ và tên...' />
            </Form.Item>

            <Form.Item
              label='Số điện thoại'
              className='mt-5'
              name='phone'
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: Config._reg.phone, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input className='h-12' placeholder='Nhập số điện thoại...' />
            </Form.Item>

            <Form.Item
              label='Email'
              className='mt-5'
              name='email'
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { pattern: Config._reg.email, message: 'Email không hợp lệ!' }
              ]}
            >
              <Input className='h-12' placeholder='Nhập email...' />
            </Form.Item>

            <Form.Item
              label='Mã CCCD'
              className='mt-5'
              name='cccd_code'
              rules={[
                { required: true, message: 'Vui lòng nhập mã CCCD!' },
                { pattern: /^[0-9]{12}$/, message: 'Mã CCCD phải có 12 số!' }
              ]}
            >
              <Input className='h-12' placeholder='Nhập mã CCCD...' />
            </Form.Item>

            <Form.Item
              label='Mã lớp'
              className='mt-5'
              name='class_code'
              rules={[{ required: true, message: 'Vui lòng nhập mã lớp!' }]}
            >
              <Input className='h-12' placeholder='Nhập mã lớp...' />
            </Form.Item>

            <Form.Item
              label='Mã sinh viên'
              className='mt-5'
              name='student_code'
              rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
            >
              <Input className='h-12' placeholder='Nhập mã sinh viên...' />
            </Form.Item>

            <Form.Item
              label='Mật khẩu'
              className='mt-5'
              name='password'
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { pattern: Config._reg.pass, message: 'Mật khẩu không hợp lệ!' }
              ]}
              hasFeedback
            >
              <Input.Password className='h-12' placeholder='Nhập mật khẩu...' />
            </Form.Item>

            <Form.Item
              label='Nhập lại mật khẩu'
              className='mt-5'
              name='confirmPassword'
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'))
                  }
                })
              ]}
            >
              <Input.Password className='h-12' placeholder='Nhập lại mật khẩu...' />
            </Form.Item>

            <Form.Item>
              <Button
                className='bg-black hover:bg-gray-700 mt-5 w-full h-12'
                type='primary'
                htmlType='submit'
                onClick={handleSubmit}
              >
                Đăng kí
              </Button>
            </Form.Item>
            <div className='text-center mt-4'>
              <p className='text-gray-600'>
                Đã có tài khoản?{' '}
                <a href={USER_PATH.LOGIN} className='text-blue-600 hover:text-blue-800 font-medium'>
                  Đăng nhập tại đây
                </a>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
