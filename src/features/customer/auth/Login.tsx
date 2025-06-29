import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router'
import { USER_PATH } from 'common/constants/paths'
import { authService } from './service/Apis'
import { openNotification, openNotificationError } from 'common/utils'
import { useState } from 'react'
import LocalStorage from 'apis/localStorage'
import { useDispatch } from 'react-redux'
import { setLogin } from 'redux/slice/login.slice'

function LoginPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const values = await form.validateFields()
      const res = await authService.login(values)
      if (res.status) {
        LocalStorage.setToken(res?.data?.token)
        LocalStorage.setData(res?.data?.id)
        LocalStorage.setRole(res?.data?.role)
        dispatch(setLogin(res?.data))
        openNotification('success', 'Thành công', 'Đăng nhập thành công')
        navigate('/')
      }
    } catch (error) {
      openNotificationError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full h-screen flex items-center justify-center bg-gray-50'>
      <div className='w-[500px] max-h-[90vh] shadow-custom-lg rounded-xl p-4 bg-white overflow-y-auto'>
        <div className='py-6'>
          <div className='mb-6'>
            <img className='w-[400px] mx-auto' src='/logoUTT.png' alt='' />
            <h3 className='text-custom-xl text-center mt-4'>Đăng nhập</h3>
          </div>
          <Form onFinish={handleSubmit} layout='vertical'>
            <Form.Item
              label='Số điện thoại'
              className='mt-5'
              name='phone'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại!'
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: 'Số điện thoại không hợp lệ!'
                }
              ]}
            >
              <Input className='h-12' placeholder='Nhập số điện thoại...' />
            </Form.Item>
            <Form.Item
              label='Mật khẩu'
              className='mt-5'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!'
                }
              ]}
            >
              <Input.Password className='h-12' placeholder='Nhập mật khẩu...' />
            </Form.Item>
            <Form.Item>
              <Button
                className='bg-black hover:bg-gray-700 mt-5 w-full h-12'
                type='primary'
                htmlType='submit'
                loading={isLoading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
            <div className='text-center mt-4'>
              <p className='text-gray-600'>
                Bạn chưa có tài khoản?{' '}
                <a href={USER_PATH.REGISTER} className='text-blue-600 hover:text-blue-800 font-medium'>
                  Đăng ký ngay
                </a>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
