/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Row, Spin, Tag } from 'antd'
import { Styled } from 'styles/stylesComponent'
import { useCallback, useEffect, useState } from 'react'
import FilterAccount from './components/FilterAccount'
import { IAccount, IColumnAntD, IPayLoadListUser } from './Manager.props'
import { accountServices } from './ManagerApis'
import { getDataSource, openNotification, openNotificationError } from 'common/utils'
import ModalComponent from 'common/components/modal/Modal'
import { AddEditManager } from './components/AddEditAccount'
import { TooltipCustom } from 'common/components/tooltip/ToolTipComponent'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ShowConfirm } from 'common/components/Alert'

function ManagerPage() {
  const [page, setPage] = useState<number>(1)
  const [payload, setPayload] = useState<IPayLoadListUser>({
    page: 1,
    take: 12,
    q: '',
    status: '',
    to_date: '',
    from_date: ''
  })
  const [accounts, setAccount] = useState<any>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [textButton, setTextButton] = useState<string>('')
  const [count, setCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [rowSelected, setRowSelected] = useState<IAccount>()

  const columnsListAccount: IColumnAntD[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 20
    },
    {
      title: 'Họ và tên',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email'
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      dataIndex: 'phone'
    },
    {
      title: 'Loại tài khoản',
      key: 'role',
      dataIndex: 'role'
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (text: string, record: any) =>
        record.s == 'active' ? <Tag color={'blue'}>{text}</Tag> : <Tag color={'red'}>{text}</Tag>
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
                  onClick={() => handleEditAccount(record)}
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

  const handleGetAccount = async (payload?: IPayLoadListUser) => {
    try {
      const res = await accountServices.get(payload)
      setAccount(getDataSource(res?.data, 1))

      setCount(res?.meta?.item_count)
    } catch (error) {
      console.log('🚀 ~ handleGetAccount ~ error:', error)
    }
  }

  useEffect(() => {
    handleGetAccount(payload)
  }, [payload])

  const handleFilter = useCallback(
    (value: any) => {
      if (value?.status) {
        setPayload({
          ...payload,
          status: value.status,
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

  const handleSetModalVisible = useCallback(() => {
    setModalVisible(false)
    setRowSelected(undefined)
  }, [])

  const handleSubmit = async (value: any) => {
    setIsLoading(true)
    const payLoadAccount = {
      id: rowSelected?.id,
      name: value?.name,
      phone: value?.phone,
      email: value?.email,
      status: value?.status || null,
      avatar: value?.avatar
    }
    let res
    try {
      if (rowSelected?.id) {
        res = await accountServices.put(payLoadAccount)
      } else {
        res = await accountServices.post({ ...payLoadAccount, password: value?.password, status: 'active' })
      }

      if (res.status == 1) {
        if (rowSelected) {
          console.log('1')

          openNotification('success', 'Thành công', 'Cập nhật thành công')
        } else {
          console.log('2')

          openNotification('success', 'Thành công', 'Thêm mới thành công')
        }
        setIsLoading(false)
        setModalVisible(false)
        handleGetAccount()
      }
    } catch (error) {
      openNotificationError(error)
      setIsLoading(false)
    }
  }

  const handleEditAccount = useCallback(async (record: IAccount) => {
    setModalVisible(true)
    setRowSelected(record)
  }, [])

  const handleRemoveAccount = useCallback(
    async (value: any) => {
      try {
        const res = await accountServices.delete(value?.id)
        if (res) {
          openNotification('success', 'Thành công', 'Xóa tài khoản thành công')
          handleGetAccount()
        }
      } catch (error) {
        console.log('🚀 ~ error:', error)
      }
    },
    [payload]
  )

  return (
    <>
      <Row gutter={[15, 6]} className='mb-2'>
        <FilterAccount onChangeValue={handleFilter} />
      </Row>
      <Row className='mb-2 flex justify-end'>
        <Button
          className='bg-baseBackground hover:!bg-hoverBase'
          type='primary'
          onClick={() => {
            setModalVisible(true)
            setTitle('Thêm mới quản trị viên')
            setTextButton('Thêm mới')
          }}
        >
          Thêm mới
        </Button>
        {/* <Button className='ml-2' type='primary'>
          Xuất Excel
        </Button> */}
      </Row>
      <Spin spinning={isLoading}>
        <Styled.TableStyle
          bordered
          columns={columnsListAccount}
          dataSource={accounts}
          pagination={{
            pageSize: payload.take,
            onChange: (page) => {
              setIsLoading(true)
              setTimeout(() => {
                setPayload({ ...payload, page: page })
                setIsLoading(false)
              }, 200)
            },
            total: count,
            current: payload.page
          }}
        />
      </Spin>
      <ModalComponent
        loading={isLoading}
        title='Thêm mới / cập nhật tài khoản'
        width={1000}
        modalVisible={modalVisible}
        children={<AddEditManager rowSelected={rowSelected} onFinish={handleSubmit} onClose={handleSetModalVisible} />}
      />
    </>
  )
}

export default ManagerPage
