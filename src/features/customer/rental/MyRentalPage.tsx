/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react'
import { Button, Card, Descriptions, Row, Spin, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Styled } from 'styles/stylesComponent'
import { IColumnAntD } from 'common/constants/interface'
import { TooltipCustom } from 'common/components/tooltip/ToolTipComponent'
import { EditOutlined } from '@ant-design/icons'
import { ADMIN_PATH } from 'common/constants/paths'
import { RentRoomStatus } from 'types/rental'
import { getDataSource } from 'common/utils'
import FilterRental from '../../admin/Rental/components/FilterRental'
import { rentalServices } from '../../admin/Rental/RentalApis'
import { useAuth } from 'hooks/useAuth'

function MyRentalPage() {
  const [payload, setPayload] = useState<any>({
    page: 1,
    take: 10,
    q: '',
    status: '',
    to_date: '',
    from_date: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [rentals, setRentals] = useState<any[]>([])
  const [count, setCount] = useState<number>(0)
  const [currentRental, setCurrentRental] = useState<any>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  const columnsListCategory: IColumnAntD[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 20
    },
    {
      title: 'Mã phòng',
      key: 'room_number',
      dataIndex: 'room_number',
      render: (text, record) => record.room?.room_number
    },
    {
      title: 'Số điện thoại phụ huynh',
      key: 'parent_phone',
      dataIndex: 'parent_phone'
    },
    {
      title: 'Thời hạn hợp đồng',
      key: 'contract_duration',
      dataIndex: 'contract_duration',
      render: (text) => `${text} tháng`
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (text) => {
        let color = 'default'
        let label = text

        switch (text) {
          case RentRoomStatus.DRAFT:
            color = 'default'
            label = 'Dự thảo'
            break
          case RentRoomStatus.WAITING_FOR_CONFIRMATION:
            color = 'processing'
            label = 'Chờ phê duyệt'
            break
          case RentRoomStatus.CONFIRMED:
            color = 'success'
            label = 'Đã phê duyệt'
            break
          case RentRoomStatus.CONTRACT_SIGNED:
            color = 'warning'
            label = 'Đã ký hợp đồng'
            break
          case RentRoomStatus.COMPLETED:
            color = 'success'
            label = 'Hoàn thành'
            break
          default:
            color = 'default'
            label = text
        }

        return <Tag color={color}>{label}</Tag>
      }
    },
    {
      title: 'Ngày tạo',
      key: 'created_at',
      dataIndex: 'created_at'
    },
    {
      width: 80,
      title: 'Thao tác',
      key: 'action',
      dataIndex: 'action',
      render: (value: number, record: any) => {
        return (
          <div style={{ display: 'flex' }}>
            <TooltipCustom
              title='Xem chi tiết'
              children={
                <Button
                  type='text'
                  className='btn-success-text'
                  icon={<EditOutlined />}
                  onClick={() => handleNavigateEdit(record)}
                />
              }
            />
          </div>
        )
      }
    }
  ]

  const handleGetRentals = async (payload?: any) => {
    try {
      setIsLoading(true)
      const res = await rentalServices.get({ ...payload, user_id: user?.id })
      if (res?.data) {
        setRentals(getDataSource(res.data, 1))
        setCount(res.data?.meta?.item_count || 0)

        // Tìm phòng đang thuê hiện tại
        const currentRental = res.data.find(
          (rental: any) =>
            rental.status === RentRoomStatus.CONTRACT_SIGNED || rental.status === RentRoomStatus.COMPLETED
        )
        setCurrentRental(currentRental)
      } else {
        setRentals([])
        setCount(0)
        setCurrentRental(null)
      }
    } catch (error) {
      console.log('🚀 ~ handleGetRentals ~ error:', error)
      setRentals([])
      setCount(0)
      setCurrentRental(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterRental = useCallback(
    (value: any) => {
      if (value?.status) {
        setPayload({
          ...payload,
          status: value?.status,
          page: 1
        })
      }
      if (value?.date) {
        setPayload({
          ...payload,
          from_date: value?.date.split(',')[0],
          to_date: value?.date.split(',')[1]
        })
      }
      if (value?.search) {
        setPayload({
          ...payload,
          q: value?.search
        })
      }
    },
    [payload]
  )

  const handleNavigateEdit = (record: any) => {
    navigate(`${ADMIN_PATH.REN_ROOM}/${record.id}`)
  }

  useEffect(() => {
    if (user?.id) {
      handleGetRentals(payload)
    }
  }, [payload, user])

  return (
    <>
      {currentRental && (
        <Card title='Thông tin phòng đang thuê' style={{ marginBottom: 24 }}>
          <Descriptions bordered>
            <Descriptions.Item label='Mã phòng' span={3}>
              {currentRental.room?.room_number}
            </Descriptions.Item>
            <Descriptions.Item label='Tòa nhà' span={3}>
              {currentRental.room?.building?.name}
            </Descriptions.Item>
            <Descriptions.Item label='Loại phòng' span={3}>
              {currentRental.room?.room_type?.name}
            </Descriptions.Item>
            <Descriptions.Item label='Số điện thoại phụ huynh' span={3}>
              {currentRental.parent_phone}
            </Descriptions.Item>
            <Descriptions.Item label='Thời hạn hợp đồng' span={3}>
              {currentRental.contract_duration} tháng
            </Descriptions.Item>
            <Descriptions.Item label='Trạng thái' span={3}>
              <Tag color={currentRental.status === RentRoomStatus.CONTRACT_SIGNED ? 'warning' : 'success'}>
                {currentRental.status === RentRoomStatus.CONTRACT_SIGNED ? 'Đã ký hợp đồng' : 'Hoàn thành'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Ngày bắt đầu' span={3}>
              {currentRental.start_date}
            </Descriptions.Item>
            <Descriptions.Item label='Ngày kết thúc' span={3}>
              {currentRental.end_date}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <h2>Lịch sử yêu cầu thuê phòng</h2>
      <FilterRental onChangeValue={handleFilterRental} />
      <Spin spinning={isLoading}>
        <Styled.TableStyle
          bordered
          columns={columnsListCategory}
          dataSource={rentals}
          pagination={{
            onChange: (page) => {
              setIsLoading(true)
              setTimeout(() => {
                setPayload({ ...payload, page: page })
                setIsLoading(false)
              }, 200)
            },
            pageSize: payload.take,
            total: count,
            current: payload.page
          }}
        />
      </Spin>
    </>
  )
}

export default MyRentalPage
