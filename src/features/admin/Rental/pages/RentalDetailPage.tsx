/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Form, Input, DatePicker, Steps, message, Row, Col } from 'antd'
import { useAuth } from 'hooks/useAuth'
import { RentRoomStatus } from 'types/rental'
import { rentalServices } from '../RentalApis'
import dayjs from 'dayjs'

const { Step } = Steps

const RentalDetailPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const [currentStatus, setCurrentStatus] = useState<any>(RentRoomStatus.DRAFT)
  const [isLoading, setIsLoading] = useState(false)
  const [rental, setRental] = useState<any>(null)

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

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      let action = RentRoomStatus.DRAFT

      // Xác định action dựa trên trạng thái hiện tại
      switch (currentStatus) {
        case RentRoomStatus.DRAFT:
          action = RentRoomStatus.WAITING_FOR_CONFIRMATION
          break
        case RentRoomStatus.WAITING_FOR_CONFIRMATION:
          action = RentRoomStatus.CONFIRMED
          break
        case RentRoomStatus.CONFIRMED:
          action = RentRoomStatus.CONTRACT_SIGNED
          break
        case RentRoomStatus.CONTRACT_SIGNED:
          action = RentRoomStatus.COMPLETED
          break
        default:
          break
      }

      // Gọi API trigger workflow
      await rentalServices.triggerWorkflow({
        action,
        ren_room_id: Number(id)
      })

      // Refresh lại dữ liệu
      await handleGetRoomById(Number(id))
      message.success('Cập nhật trạng thái thành công')
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
      message.error('Cập nhật trạng thái thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // TODO: Implement cancel rental request
    message.success('Đã hủy yêu cầu thuê phòng')
    navigate(-1)
  }

  const handleSignContract = async () => {
    try {
      setIsLoading(true)
      await rentalServices.triggerWorkflow({
        action: RentRoomStatus.COMPLETED,
        ren_room_id: Number(id)
      })
      await handleGetRoomById(Number(id))
      message.success('Ký hợp đồng thành công')
    } catch (error) {
      console.log('🚀 ~ handleSignContract ~ error:', error)
      message.error('Ký hợp đồng thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetRoomById = async (id: number) => {
    try {
      setIsLoading(true)
      const res = await rentalServices.getById(id)

      if (res) {
        setRental(res)
        setCurrentStatus(res.status)
        form.setFieldsValue({
          room_id: id,
          max_students: res?.room?.room_type?.max_student,
          current_students: res?.room?.room_students?.length || 0,
          parent_phone: res?.parent_phone,
          contract_duration: res?.contract_duration
        })
      }
    } catch (error) {
      console.log('🚀 ~ handleGetRoomById ~ error:', error)
      message.error('Không thể lấy thông tin phòng')
    } finally {
      setIsLoading(false)
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
            {user?.role === 'admin' && (
              <Button type='primary' onClick={handleSubmit}>
                Phê duyệt
              </Button>
            )}
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
            {user?.role !== 'admin' && (
              <Button type='primary' onClick={handleSignContract}>
                Ký hợp đồng
              </Button>
            )}
            {user?.role !== 'admin' && (
              <Button danger onClick={handleCancel}>
                Hủy thuê phòng
              </Button>
            )}
            {user?.role !== 'admin' && <Button onClick={() => form.resetFields()}>Cập nhật</Button>}
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
                <Input disabled={currentStatus === RentRoomStatus.COMPLETED} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='max_students' label='Số sinh viên tối đa'>
                <Input disabled={currentStatus === RentRoomStatus.COMPLETED} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='current_students' label='Số sinh viên hiện tại'>
                <Input disabled={currentStatus === RentRoomStatus.COMPLETED} />
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
                <Input disabled={currentStatus === RentRoomStatus.COMPLETED} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='student_code'
                label='Mã sinh viên'
                rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
              >
                <Input disabled={currentStatus === RentRoomStatus.COMPLETED} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='class_code' label='Mã lớp' rules={[{ required: true, message: 'Vui lòng nhập mã lớp' }]}>
                <Input disabled={currentStatus === RentRoomStatus.COMPLETED} />
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
                <Input disabled={currentStatus === RentRoomStatus.COMPLETED} />
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
                <Input disabled={currentStatus === RentRoomStatus.COMPLETED} />
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
                <Input disabled={currentStatus === RentRoomStatus.COMPLETED} />
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
                <Input
                  type='number'
                  min={1}
                  disabled={currentStatus === RentRoomStatus.COMPLETED}
                  onChange={(e) => {
                    const months = parseInt(e.target.value)
                    const signedDate = form.getFieldValue('contract_signed_date')
                    if (months && signedDate) {
                      const endDate = dayjs(signedDate).add(months, 'month')
                      form.setFieldsValue({
                        contract_end_date: endDate
                      })
                    }
                  }}
                />
              </Form.Item>
            </Col>
            {(currentStatus === RentRoomStatus.CONFIRMED || currentStatus === RentRoomStatus.COMPLETED) && (
              <Col span={8}>
                <Form.Item
                  name='contract_signed_date'
                  label='Ngày ký hợp đồng'
                  rules={[{ required: true, message: 'Vui lòng chọn ngày ký hợp đồng' }]}
                >
                  <DatePicker
                    className='w-full'
                    disabled={currentStatus === RentRoomStatus.COMPLETED}
                    onChange={(date) => {
                      const duration = form.getFieldValue('contract_duration')
                      if (date && duration) {
                        const endDate = date.add(duration, 'month')
                        form.setFieldsValue({
                          contract_end_date: endDate
                        })
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            )}
            {(currentStatus === RentRoomStatus.CONFIRMED || currentStatus === RentRoomStatus.COMPLETED) && (
              <Col span={8}>
                <Form.Item
                  name='contract_end_date'
                  label='Ngày kết thúc hợp đồng'
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc hợp đồng' }]}
                >
                  <DatePicker className='w-full' disabled />
                </Form.Item>
              </Col>
            )}
          </Row>

          <div className='flex gap-2 justify-end mt-4'>{renderActionButtons()}</div>
        </Form>
      </Card>
    </div>
  )
}

export default RentalDetailPage
