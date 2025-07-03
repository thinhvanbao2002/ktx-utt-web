import { Button, Row, Spin } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { IColumnAntD } from 'common/constants/interface'
import { TooltipCustom } from 'common/components/tooltip/ToolTipComponent'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ShowConfirm } from 'common/components/Alert'
import { Styled } from 'styles/stylesComponent'
import ModalComponent from 'common/components/modal/Modal'
import { IPayLoadLisCategory } from './RoomType.props'
import { roomTypeServices } from './RoomTypeApis'
import { getDataSource, openNotification } from 'common/utils'
import { AddEditCategory } from './components/AddEditRoomType'

function RoomTypePage() {
  const [payload, setPayload] = useState<IPayLoadLisCategory>({
    page: 1,
    take: 10,
    q: '',
    status: 1,
    to_date: '',
    from_date: ''
  })
  const [categories, setCategory] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [count, setCount] = useState<number>(12)
  const [rowSelected, setRowSelected] = useState<any>()

  const columnsListCategory: IColumnAntD[] = [
    {
      title: 'STT',
      key: 'STT',
      dataIndex: 'STT',
      width: 20
    },
    {
      title: 'Tên loại phòng',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'Số sinh viên tối đa',
      key: 'max_student',
      dataIndex: 'max_student',
      width: 280
    },

    {
      title: 'Giá tiền',
      key: 'price',
      dataIndex: 'price'
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

  const handleGetCategories = async (payload?: any) => {
    try {
      const res = await roomTypeServices.get(payload)
      console.log('🚀 ~ handleGetCategories ~ res:', res)
      setCategory(getDataSource(res?.data, 1))
      setCount(res?.meta?.item_count)
    } catch (error) {
      console.log('🚀 ~ handleGetAccount ~ error:', error)
    }
  }

  useEffect(() => {
    handleGetCategories(payload)
  }, [payload])

  // const handleFilter = useCallback(
  //   (value: any) => {
  //     if (value?.status !== null || value?.status !== undefined) {
  //       setPayload({
  //         ...payload,
  //         status: value.status,
  //         page: 1
  //       })
  //     }
  //     if (value?.date) {
  //       setPayload({
  //         ...payload,
  //         from_date: value?.date.split(',')[0],
  //         to_date: value?.date.split(',')[1]
  //       })
  //     }
  //     if (value?.search) {
  //       setPayload({
  //         ...payload,
  //         q: value?.search
  //       })
  //     }
  //   },
  //   [payload]
  // )

  const handleSubmit = async (value: any) => {
    setIsLoading(true)
    const payLoadAccount = {
      id: rowSelected?.id,
      name: value?.name,
      price: value?.price,
      max_student: value?.max_student,
      gender: value?.gender
    }
    console.log('🚀 ~ handleSubmit ~ payLoadAccount:', payLoadAccount)
    let res
    try {
      if (rowSelected?.id) {
        res = await roomTypeServices.patch(payLoadAccount)
      } else {
        res = await roomTypeServices.post({ ...payLoadAccount })
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
        handleGetCategories()
      }
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
    }
  }

  const handleEditAccount = useCallback(async (record: any) => {
    setModalVisible(true)
    setRowSelected(record)
  }, [])

  const handleRemoveAccount = useCallback(async (record: any) => {
    try {
      const res = await roomTypeServices.delete(record?.id)
      if (res) {
        openNotification('success', 'Thành công', 'Xóa danh mục thành công')
        setIsLoading(true)
        handleGetCategories()
        setIsLoading(false)
      }
    } catch (error) {
      console.log('🚀 ~ handleRemoveAccount ~ error:', error)
    }
  }, [])

  const handleClose = useCallback(() => {
    setModalVisible(false)
    setRowSelected(undefined)
  }, [])

  return (
    <>
      <Row gutter={[15, 6]} className='mb-2'>
        {/* <FilterCategory onChangeValue={handleFilter} /> */}
      </Row>
      <Row className='mb-2 flex justify-end'>
        <Button
          className='bg-baseBackground 
                    hover:!bg-hoverBase 
                    text-while  
                    border-none 
                    shadow-none 
                    hover:shadow-none
                    hover:border-none 
                    hover:!text-while'
          onClick={() => {
            setModalVisible(true)
            setTitle('Thêm mới tòa nhà')
            // setTextButton('Thêm mới')
          }}
        >
          Thêm mới
        </Button>
        {/* <Button
          className='ml-2 bg-baseBackground 
                    hover:!bg-hoverBase 
                    text-while  
                    border-none 
                    shadow-none 
                    hover:shadow-none
                    hover:border-none 
                    hover:!text-while'
          type='primary'
        >
          Xuất Excel
        </Button> */}
      </Row>
      <Spin spinning={isLoading}>
        <Styled.TableStyle
          bordered
          columns={columnsListCategory}
          dataSource={categories}
          pagination={{
            onChange: (page) => {
              setIsLoading(true)
              setTimeout(() => {
                setPayload({ ...payload, page: page })
                setIsLoading(false)
              }, 200)
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
        width={1000}
        modalVisible={modalVisible}
        children={<AddEditCategory onFinish={handleSubmit} onClose={handleClose} rowSelected={rowSelected} />}
      />
    </>
  )
}

export default RoomTypePage
