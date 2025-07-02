import { Button, Row, Spin, Tag } from 'antd'
import FilterCategory from './components/FilterClaim'
import { useCallback, useEffect, useState } from 'react'
import { IColumnAntD } from 'common/constants/interface'
import { TooltipCustom } from 'common/components/tooltip/ToolTipComponent'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ShowConfirm } from 'common/components/Alert'
import { Styled } from 'styles/stylesComponent'
import ModalComponent from 'common/components/modal/Modal'
import { IPayloadListClaim, IClaim } from './Claim.props'
import { claimServices } from './ClaimApis'
import { openNotification, formatDate } from 'common/utils'
import { AddEditClaim } from './components/AddEditClaim'
import { useAuth } from 'hooks/useAuth'

function ClaimPage() {
  const { user } = useAuth()
  const [payload, setPayload] = useState<IPayloadListClaim>({
    page: 1,
    take: 10,
    q: '',
    status: undefined,
    to_date: '',
    from_date: ''
  })
  const [claims, setClaims] = useState<IClaim[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [count, setCount] = useState<number>(0)
  const [rowSelected, setRowSelected] = useState<IClaim | undefined>()

  const columnsListClaim: IColumnAntD[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 40
    },
    {
      title: 'Mã SV',
      key: 'student_code',
      dataIndex: 'student_code'
    },
    {
      title: 'Tên SV',
      key: 'student_name',
      dataIndex: 'student_name'
    },
    {
      title: 'Phòng',
      key: 'room_number',
      dataIndex: 'room_number'
    },
    {
      title: 'Nội dung',
      key: 'content',
      dataIndex: 'content',
      width: 200
    },
    {
      title: 'Người hỗ trợ',
      key: 'supporter',
      dataIndex: 'supporter'
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (value: string) => {
        if (value === 'resolved') {
          return <Tag color='green'>Đã xử lý</Tag>
        }
        if (value === 'pending') {
          return <Tag color='red'>Chờ xử lý</Tag>
        }
        return value
      }
    },
    {
      title: 'Ngày tạo',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (value: string) => formatDate(value)
    },
    {
      title: 'Ngày cập nhật',
      key: 'updated_at',
      dataIndex: 'updated_at',
      render: (value: string) => formatDate(value)
    },
    {
      width: 80,
      title: 'Thao tác',
      key: 'tt',
      dataIndex: 'tt',
      render: (value: number, record: IClaim) => {
        return (
          <div style={{ display: 'flex' }}>
            {user?.role === 'admin' && (
              <TooltipCustom
                title={'Cập nhật'}
                children={
                  <Button
                    type={'text'}
                    className={'btn-success-text'}
                    icon={<EditOutlined />}
                    onClick={() => handleEditClaim(record)}
                  />
                }
              />
            )}
            {user?.role === 'admin' && (
              <ShowConfirm
                placement='bottomLeft'
                onConfirm={() => handleRemoveClaim(record)}
                confirmText={'Xóa'}
                title={'Bạn có chắc chắn muốn xóa?'}
              >
                <TooltipCustom
                  title='Xóa'
                  children={<Button type='text' className={'btn-delete-text'} icon={<DeleteOutlined />} />}
                />
              </ShowConfirm>
            )}
          </div>
        )
      }
    }
  ]

  const handleGetClaims = async (payload?: any) => {
    setIsLoading(true)
    try {
      const res = await claimServices.get(payload)
      setClaims(res)
      setCount(res?.data?.meta?.item_count || 0)
    } catch (error) {
      openNotification('error', 'Lỗi', 'Không thể tải danh sách yêu cầu')
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    handleGetClaims(payload)
    // eslint-disable-next-line
  }, [payload])

  const handleFilter = useCallback((value: any) => {
    setPayload((prev) => ({ ...prev, ...value, page: 1 }))
  }, [])

  const handleSubmit = async (value: any) => {
    setIsLoading(true)
    let res
    try {
      const cleanValue = { ...rowSelected, ...value }
      delete cleanValue.key
      delete cleanValue.STT
      delete cleanValue.textStatus
      delete cleanValue.createdAt
      delete cleanValue.category
      delete cleanValue.role
      delete cleanValue.s
      if (rowSelected?.id) {
        res = await claimServices.patch({ ...cleanValue, id: rowSelected.id })
      } else {
        res = await claimServices.post(cleanValue)
      }
      if (res.status) {
        openNotification('success', 'Thành công', rowSelected ? 'Cập nhật thành công' : 'Thêm mới thành công')
        setModalVisible(false)
        setRowSelected(undefined)
        handleGetClaims(payload)
      }
    } catch (error) {
      console.log(error)

      openNotification('error', 'Lỗi', 'Không thể lưu yêu cầu')
    }
    setIsLoading(false)
  }

  const handleEditClaim = useCallback((record: IClaim) => {
    setModalVisible(true)
    setTitle('Cập nhật yêu cầu')
    setRowSelected(record)
  }, [])

  const handleRemoveClaim = useCallback(
    async (record: IClaim) => {
      setIsLoading(true)
      try {
        const res = await claimServices.delete(record.id!)
        if (res) {
          openNotification('success', 'Thành công', 'Xóa yêu cầu thành công')
          handleGetClaims(payload)
        }
      } catch (error) {
        console.log(error)
        openNotification('error', 'Lỗi', 'Không thể xóa yêu cầu')
      }
      setIsLoading(false)
    },
    [payload]
  )

  const handleClose = useCallback(() => {
    setModalVisible(false)
    setRowSelected(undefined)
  }, [])

  return (
    <>
      <Row gutter={[15, 6]} className='mb-2'>
        <FilterCategory onChangeValue={handleFilter} />
      </Row>
      <Row className='mb-2 flex justify-end'>
        <Button
          className='bg-baseBackground hover:!bg-hoverBase text-while border-none shadow-none hover:shadow-none hover:border-none hover:!text-while'
          onClick={() => {
            setModalVisible(true)
            setTitle('Thêm mới yêu cầu')
            setRowSelected(undefined)
          }}
        >
          Thêm mới
        </Button>
      </Row>
      <Spin spinning={isLoading}>
        <Styled.TableStyle
          bordered
          columns={columnsListClaim}
          dataSource={claims}
          pagination={{
            onChange: (page) => {
              setPayload((prev) => ({ ...prev, page }))
            },
            total: count,
            current: payload.page,
            pageSize: payload.take
          }}
        />
      </Spin>
      <ModalComponent
        loading={isLoading}
        title={title}
        width={800}
        modalVisible={modalVisible}
        children={<AddEditClaim onFinish={handleSubmit} onClose={handleClose} rowSelected={rowSelected} />}
      />
    </>
  )
}

export default ClaimPage
