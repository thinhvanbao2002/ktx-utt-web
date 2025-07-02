/* eslint-disable @typescript-eslint/no-unused-vars */
import { IColumnAntD } from 'common/constants/interface'
import OrderStep from './OrderSteps'
import { Styled } from 'styles/stylesComponent'
import { Button, Col, Image, Row } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { orderServices } from '../IncidentReportApis'
import { formatPrice, getDataSource, openNotificationError } from 'common/utils'
import { OrderStatus } from '../constants/order.constant'

function OrderDetail() {
  const { id } = useParams()
  const [textButton, setTextButton] = useState<number>(0)
  const [order, setOrder] = useState<any>({})
  const [products, setProducts] = useState<Array<any>>([])

  const { total_price, address, name, phone, order_status } = order

  const columnsListAccount: IColumnAntD[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 20
    },
    {
      title: 'Tên sản phẩm',
      key: 'product',
      dataIndex: 'product',
      render: (value: any) => {
        return <div>{value?.name}</div>
      }
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      dataIndex: 'quantity',
      render: (value: any) => {
        return <div>{value}</div>
      }
    },
    {
      title: 'Đơn giá',
      key: 'price',
      dataIndex: 'price'
    },
    {
      title: 'Ảnh sản phẩm',
      key: 'product',
      dataIndex: 'product',
      width: 150,
      render: (value: any) => {
        return <Image width={150} src={value?.image} />
      }
    }
  ]
  // Hàm lấy text button dựa vào order_status
  const getButtonText = (status: number) => {
    switch (status) {
      case 1:
        return 'Xác nhận đơn hàng'
      case 2:
        return 'Vận chuyển'
      case 3:
        return 'Hoàn thành'
      default:
        return 'Đang xử lý'
    }
  }

  const handleNextStep = async () => {
    try {
      await orderServices.nextStep(id)
      handleGetOrder()
    } catch (error) {
      openNotificationError(error)
    }
  }
  const handleGetOrder = async () => {
    try {
      const res = await orderServices.getById(id)
      if (res) {
        setOrder(res?.data)
        setProducts(getDataSource(res?.data?.order_details, 1))
      }
    } catch (error) {
      console.log('🚀 ~ handleGetOrder ~ error:', error)
    }
  }
  useEffect(() => {
    handleGetOrder()
  }, [])

  return (
    <>
      <OrderStep step={Number(order_status)} />
      <Row gutter={24} className='mt-10'>
        <Col span={16}>
          <Styled.TableStyle bordered columns={columnsListAccount} dataSource={products} pagination={false} />
        </Col>
        <Col span={8} className='text-lg'>
          <div className='flex justify-between mb-8'>
            <h3>Tên khách hàng: </h3>
            <span className='font-semibold'>{name}</span>
          </div>
          <div className='flex justify-between mb-8'>
            <h3>Số điện thoại: </h3>
            <span className='font-semibold'>{phone}</span>
          </div>
          <div className='flex justify-between mb-8'>
            <h3>Địa chỉ: </h3>
            <span className='font-semibold'>{address}</span>
          </div>
          <div className='flex justify-between mb-8'>
            <h3>Tổng thanh toán: </h3>
            <span className='font-semibold'>{formatPrice(total_price)}</span>
          </div>
          <div className='flex justify-end'>
            {order_status !== OrderStatus.PAID ? (
              <Button type='primary' onClick={handleNextStep}>
                {getButtonText(Number(order_status))}
              </Button>
            ) : (
              <Fragment />
            )}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default OrderDetail
