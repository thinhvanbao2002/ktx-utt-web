/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Form, Input, DatePicker, Steps, message, Row, Col } from 'antd'
import { useAuth } from 'hooks/useAuth'
import { RentRoomStatus, IRentalRequestForm } from 'types/rental'
import { productServices } from 'features/admin/Room/RoomApis'
import { rentalServices } from '../RentalApis'

const { Step } = Steps

const RentalRequestPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id } = useParams()
  console.log('🚀 ~ RentalRequestPage ~ roomId:', id)
  const { user } = useAuth()
  const [currentStatus, setCurrentStatus] = useState<RentRoomStatus>(RentRoomStatus.DRAFT)

  const steps = [
    { title: 'Dự thảo', status: RentRoomStatus.DRAFT },
    { title: 'Chờ phê duyệt', status: RentRoomStatus.WAITING_FOR_CONFIRMATION },
    { title: 'Đã phê duyệt', status: RentRoomStatus.CONFIRMED },
    { title: 'Chờ ký hợp đồng', status: RentRoomStatus.CONTRACT_SIGNED },
    { title: 'Hoàn thành', status: RentRoomStatus.COMPLETED }
  ]

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        user_id: user.id,
        student_code: user.student_code,
        class_code: user.class_code,
        cccd_code: user.cccd_code,
        phone: user.phone
      })
    }
  }, [user, form])

  useEffect(() => {
    if (id) {
      handleGetRoomById(Number(id))
    } else {
      message.error('Không tìm thấy thông tin phòng')
      // navigate(-1);
    }
  }, [id])

  const handleSubmit = async (values: IRentalRequestForm) => {
    try {
      const data = await rentalServices.create(values)
      // TODO: Implement API call to submit rental request
      message.success('Gửi yêu cầu thuê phòng thành công')
      setCurrentStatus(RentRoomStatus.WAITING_FOR_CONFIRMATION)
    } catch (error) {
      message.error('Có lỗi xảy ra khi gửi yêu cầu')
    }
  }

  const handleCancel = () => {
    // TODO: Implement cancel rental request
    message.success('Đã hủy yêu cầu thuê phòng')
    navigate(-1)
  }

  const handleSignContract = () => {
    // TODO: Implement contract signing
    setCurrentStatus(RentRoomStatus.CONTRACT_SIGNED)
    message.success('Đã ký hợp đồng thành công')
  }

  const handleGetRoomById = async (id: number) => {
    try {
      const res = await productServices.getById(id)
      console.log('🚀 ~ handleGetRoomById ~ res:', res)
      if (res) {
        form.setFieldsValue({
          room_id: id,
          max_students: res?.room_type?.max_student,
          current_students: res?.room_students?.length || 0
        })
      }
    } catch (error) {
      console.log('🚀 ~ handleGetRoomById ~ error:', error)
      message.error('Không thể lấy thông tin phòng')
      navigate(-1)
    }
  }

  const renderActionButtons = () => {
    switch (currentStatus) {
      case RentRoomStatus.DRAFT:
        return (
          <>
            <Button type='primary' onClick={() => form.submit()}>
              Gửi
            </Button>
            <Button onClick={() => form.resetFields()}>Cập nhật</Button>
            <Button onClick={() => navigate(-1)}>Thoát</Button>
          </>
        )
      case RentRoomStatus.WAITING_FOR_CONFIRMATION:
        return (
          <>
            <Button danger onClick={handleCancel}>
              Hủy thuê phòng
            </Button>
            <Button onClick={() => form.resetFields()}>Cập nhật</Button>
            <Button onClick={() => navigate(-1)}>Thoát</Button>
          </>
        )
      case RentRoomStatus.CONFIRMED:
        return (
          <>
            <Button type='primary' onClick={handleSignContract}>
              Ký hợp đồng
            </Button>
            <Button danger onClick={handleCancel}>
              Hủy thuê phòng
            </Button>
            <Button onClick={() => form.resetFields()}>Cập nhật</Button>
            <Button onClick={() => navigate(-1)}>Thoát</Button>
          </>
        )
      case RentRoomStatus.CONTRACT_SIGNED:
      case RentRoomStatus.COMPLETED:
        return (
          <>
            <Button onClick={() => form.resetFields()}>Cập nhật</Button>
            <Button onClick={() => navigate(-1)}>Thoát</Button>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className='p-6'>
      <Card title='Yêu cầu thuê phòng' className='mb-6'>
        <Steps current={steps.findIndex((step) => step.status === currentStatus)} className='mb-8'>
          {steps.map((step) => (
            <Step key={step.status} title={step.title} />
          ))}
        </Steps>

        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={{
            room_id: id
          }}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name='room_id'
                label='Mã phòng'
                rules={[{ required: true, message: 'Vui lòng nhập mã phòng' }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='max_students' label='Số sinh viên tối đa'>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='current_students' label='Số sinh viên hiện tại'>
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name='user_id'
                label='Mã người dùng'
                rules={[{ required: true, message: 'Vui lòng nhập mã người dùng' }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='student_code'
                label='Mã sinh viên'
                rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='class_code' label='Mã lớp' rules={[{ required: true, message: 'Vui lòng nhập mã lớp' }]}>
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name='cccd_code'
                label='Số căn cước'
                rules={[{ required: true, message: 'Vui lòng nhập số căn cước' }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='phone'
                label='Số điện thoại liên hệ'
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='parent_phone'
                label='Số điện thoại phụ huynh'
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại phụ huynh' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name='contract_duration'
                label='Thời hạn hợp đồng (tháng)'
                rules={[{ required: true, message: 'Vui lòng nhập thời hạn hợp đồng' }]}
              >
                <Input type='number' min={1} />
              </Form.Item>
            </Col>
            {currentStatus === RentRoomStatus.CONTRACT_SIGNED && (
              <Col span={8}>
                <Form.Item
                  name='contract_signed_date'
                  label='Ngày ký hợp đồng'
                  rules={[{ required: true, message: 'Vui lòng chọn ngày ký hợp đồng' }]}
                >
                  <DatePicker className='w-full' />
                </Form.Item>
              </Col>
            )}
          </Row>

          {currentStatus === RentRoomStatus.CONTRACT_SIGNED && (
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name='contract_end_date'
                  label='Ngày kết thúc hợp đồng'
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc hợp đồng' }]}
                >
                  <DatePicker className='w-full' />
                </Form.Item>
              </Col>
            </Row>
          )}

          <div className='flex gap-2 justify-end mt-4'>{renderActionButtons()}</div>
        </Form>
      </Card>
    </div>
  )
}

export default RentalRequestPage
