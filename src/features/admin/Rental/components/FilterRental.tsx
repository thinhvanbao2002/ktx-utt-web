import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import { RentRoomStatus } from 'types/rental'

const { RangePicker } = DatePicker

interface FilterRentalProps {
  onChangeValue: (value: any) => void
}

const FilterRental = ({ onChangeValue }: FilterRentalProps) => {
  const [form] = Form.useForm()

  const handleSearch = (values: any) => {
    onChangeValue(values)
  }

  const handleReset = () => {
    form.resetFields()
    onChangeValue({})
  }

  return (
    <Card className='mb-4'>
      <Form form={form} onFinish={handleSearch}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name='search'>
              <Input placeholder='Nhập mã phòng, mã sinh viên...' />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='status'>
              <Select
                placeholder='Chọn trạng thái'
                options={[
                  { value: RentRoomStatus.DRAFT, label: 'Dự thảo' },
                  { value: RentRoomStatus.WAITING_FOR_CONFIRMATION, label: 'Chờ phê duyệt' },
                  { value: RentRoomStatus.CONFIRMED, label: 'Đã phê duyệt' },
                  { value: RentRoomStatus.CONTRACT_SIGNED, label: 'Đã ký hợp đồng' },
                  { value: RentRoomStatus.COMPLETED, label: 'Hoàn thành' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='date'>
              <RangePicker className='w-full' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}></Col>
          <Col span={8}></Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type='primary' htmlType='submit' className='mr-2'>
              Tìm kiếm
            </Button>
            <Button onClick={handleReset}>Reset</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default FilterRental
