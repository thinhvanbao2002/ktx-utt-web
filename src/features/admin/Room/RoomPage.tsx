/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react'
import FilterProduct from './components/FilterProduct'
import { isNil, values } from 'lodash'
import { TooltipCustom } from 'common/components/tooltip/ToolTipComponent'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ShowConfirm } from 'common/components/Alert'
import { Button, Row, Spin, Tag } from 'antd'
import { Styled } from 'styles/stylesComponent'
import { IColumnAntD } from 'common/constants/interface'
import { IProduct } from './Room.props'
import { formatPrice, getDataSource, openNotification } from 'common/utils'
import { productServices } from './RoomApis'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PATH } from 'common/constants/paths'

function ProductPage() {
  const [payload, setPayload] = useState<any>({
    page: 1,
    take: 10,
    q: '',
    status: 'available',
    to_date: '',
    from_date: ''
  })
  console.log('🚀 ~ ProductPage ~ payload:', payload)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [products, setProducts] = useState<Array<IProduct>>([])
  const [count, setCount] = useState<number>(12)
  const navigate = useNavigate()

  const columnsListCategory: IColumnAntD[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 20
    },
    {
      title: 'Số phòng',
      key: 'room_number',
      dataIndex: 'room_number'
    },
    {
      title: 'Tòa nhà',
      key: 'building',
      dataIndex: 'building',
      render: (text, record) => record.building?.name ?? null
    },
    {
      title: 'Loại phòng',
      key: 'room_type',
      dataIndex: 'room_type',
      render: (text, record) => record.room_type?.name ?? null
    },
    {
      title: 'Giá tiền (tháng)',
      key: 'price',
      dataIndex: 'price',
      render: (text, record) => formatPrice(record.room_type?.price) ?? null
    },
    {
      title: 'Số sinh viên hiện tại',
      key: 'current_capacity',
      dataIndex: 'current_capacity'
    },
    {
      title: 'Số sinh viên tối đa',
      key: 'room_type.max_student',
      dataIndex: 'room_type.max_student',
      render: (text, record) => record.room_type?.max_student ?? null
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (text, record) => {
        let color = 'default'
        let label = text

        switch (record.s) {
          case 'available':
            color = 'blue'
            label = 'Còn trống'
            break
          case 'full':
            color = 'red'
            label = 'Đầy'
            break
          case 'underMaintenance':
            color = 'orange'
            label = 'Bảo trì'
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
      key: 'createdAt',
      dataIndex: 'createdAt'
    },
    {
      width: 80,
      title: 'Thao tác',
      key: 'tt',
      dataIndex: 'tt',
      render: (value: number, record: any) => {
        return (
          <div style={{ display: 'flex' }}>
            <TooltipCustom
              title={'Cập nhật'}
              children={
                <Button
                  type={'text'}
                  className={'btn-success-text'}
                  icon={<EditOutlined />}
                  onClick={() => handleNavigateEditProduct(record)}
                />
              }
            />
            <ShowConfirm
              placement='bottomLeft'
              onConfirm={() => handleRemoveAccount(record)}
              confirmText={'Xóa'}
              title={'Bạn có chắc chắn muốn xóa?'}
            >
              <TooltipCustom
                title='Xóa'
                children={<Button type='text' className={'btn-delete-text'} icon={<DeleteOutlined />} />}
              />
            </ShowConfirm>
          </div>
        )
      }
    }
  ]

  const handleGetProducts = async (payload?: any) => {
    try {
      const res = await productServices.get(payload)
      setProducts(getDataSource(res?.data, 1))
      setCount(res?.meta?.item_count)
    } catch (error) {
      console.log('🚀 ~ handleGetAccount ~ error:', error)
    }
  }

  const handleRemoveAccount = async (record: any) => {
    try {
      const res = await productServices.delete(record?.id)
      if (res) openNotification('success', 'Thành công', 'Xóa sản phẩm thành công')
      handleGetProducts()
    } catch (error) {
      console.log('🚀 ~ handleRemoveAccount ~ error:', error)
      openNotification('success', 'Thành công', 'Xóa sản phẩm thất bại')
    }
  }

  const handleExportProduct = async (value: any) => {
    try {
      const res = await productServices.export(value)
      if (res) {
        window.open(res?.data)
      }
    } catch (error) {
      console.log('🚀 ~ handleExportProduct ~ error:', error)
    }
  }

  useEffect(() => {
    handleGetProducts(payload)
  }, [payload])

  const handleFilterProduct = useCallback(
    (value: any) => {
      console.log('🚀 ~ ProductPage ~ value:', value)
      if (!isNil(value.status)) {
        setPayload({
          ...payload,
          status: value?.status,
          page: 1
        })
      }
      if (!isNil(value?.date)) {
        setPayload({
          ...payload,
          from_date: value?.date.split(',')[0],
          to_date: value?.date.split(',')[1]
        })
      }
      if (!isNil(value?.search)) {
        setPayload({
          ...payload,
          q: value?.search
        })
      }
      if (!isNil(value?.product_type)) {
        setPayload({
          ...payload,
          product_status: value?.product_type
        })
      }
      if (!isNil(value?.categoryId)) {
        setPayload({
          ...payload,
          building_id: value?.categoryId
        })
      }
      if (!isNil(value.sortBy)) {
        setPayload({
          ...payload,
          order_price: value?.sortBy
        })
      }
    },
    [payload]
  )

  const handleNavigateEditProduct = (record: any) => {
    navigate('ce-room/', { state: { record: { ...record } } })
  }

  const handleNavigateAddProduct = () => {
    navigate(ADMIN_PATH.CREATE_UPDATE_ROOM, { state: {} })
  }
  return (
    <>
      <FilterProduct onChangeValue={handleFilterProduct} />
      <Row className='mb-2 flex justify-end mt-2'>
        <Button
          className='bg-baseBackground 
                    hover:!bg-hoverBase 
                    text-while  
                    border-none 
                    shadow-none 
                    hover:shadow-none
                    hover:border-none 
                    hover:!text-while'
          onClick={handleNavigateAddProduct}
        >
          Thêm mới
        </Button>
        <Button
          className='bg-baseBackground 
                    hover:!bg-hoverBase 
                    text-while  
                    border-none 
                    shadow-none 
                    hover:shadow-none
                    hover:border-none 
                    hover:!text-while ml-2'
          type='primary'
          onClick={() => handleExportProduct(payload)}
        >
          Xuất Excel
        </Button>
      </Row>
      <Spin spinning={isLoading}>
        <Styled.TableStyle
          bordered
          columns={columnsListCategory}
          dataSource={products}
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

export default ProductPage
