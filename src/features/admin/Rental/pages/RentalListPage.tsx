/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react'
import { Button, Row, Spin, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Styled } from 'styles/stylesComponent'
import { IColumnAntD } from 'common/constants/interface'
import { TooltipCustom } from 'common/components/tooltip/ToolTipComponent'
import { EditOutlined } from '@ant-design/icons'
import { ADMIN_PATH } from 'common/constants/paths'
import { RentRoomStatus } from 'types/rental'
import { getDataSource } from 'common/utils'
import FilterRental from '../components/FilterRental'
import { rentalServices } from '../RentalApis'
import { useAuth } from 'hooks/useAuth'

function RentalListPage() {
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
      title: 'Sinh viên',
      key: 'student',
      dataIndex: 'student',
      render: (text, record) => record.user?.student_code
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      dataIndex: 'phone',
      render: (text, record) => record.user?.phone
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
      key: 's',
      dataIndex: 's',
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
              title='Cập nhật'
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
      // if (user?.role === 'admin') {
      //   console.log('admin');

      const res = await rentalServices.get(payload)
      console.log('🚀 ~ handleGetRentals ~ res:', res)
      setRentals(getDataSource(res.data, 1))
      setCount(res.data?.meta?.item_count)
      // }else{
      //   res = await rentalServices.getMyRequest()
      //   console.log("🚀 ~ handleGetRentals ~ res:", res)
      //   setRentals(getDataSource(res, 1))
      //   setCount(res?.meta?.item_count)
      // }
    } catch (error) {
      console.log('🚀 ~ handleGetRentals ~ error:', error)
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
    navigate(`${ADMIN_PATH.RENTAL_DETAIL}/${record.id}`)
  }

  useEffect(() => {
    handleGetRentals(payload)
  }, [payload])

  return (
    <>
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

export default RentalListPage
