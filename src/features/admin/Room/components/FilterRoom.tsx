/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Col, Row } from 'antd'
import RJSearch from 'common/components/search/RJSearch'
import RadiusSelection from 'common/components/select/RadiusSelection'
import RangerPicker from 'common/components/rangePicker/RangePicker'
import { useEffect, useState } from 'react'
import { categoryServices } from 'features/admin/Building/BuildingApis'

interface IFilter {
  onChangeValue?: any
}
function FilterProduct({ onChangeValue }: IFilter) {
  const [payload, setPayload] = useState<any>({
    q: '',
    limit: 5
  })
  const [categoryListOptions, setCategoryListOptions] = useState<any>([])

  const onChangeSearchCategory = async (value: any) => {
    setPayload({
      q: value
    })
  }

  const handleGetCategoryListOptions = async (payload: any) => {
    try {
      const res = await categoryServices.get(payload)
      setCategoryListOptions(
        res.data.map((item: any) => {
          return {
            text: item?.name,
            value: item?.id
          }
        })
      )
    } catch (error) {
      console.log('🚀 ~ handleGetCategoryListOptions ~ error:', error)
    }
  }

  useEffect(() => {
    handleGetCategoryListOptions(payload)
  }, [payload])

  return (
    <>
      <Row gutter={24}>
        <Col md={8}>
          <RJSearch
            placeholder='Nhập mã phòng'
            onInputSearch={(value: string) => {
              onChangeValue({ search: value })
            }}
          />
        </Col>
        {/* <Col md={8}>
          <RadiusSelection
            placeholder={'Trạng thái phòng'}
            onChange={(value: number) => {
              let tmpValue
              value === undefined ? (tmpValue = null) : (tmpValue = value)
              onChangeValue({ product_type: tmpValue })
            }}
            options={[
              { value: '1', text: 'Còn phòng' },
              { value: '2', text: 'Hết phòng' },
              { value: '3', text: 'Đang bảo trì' }
            ]}
          />
        </Col> */}
        <Col md={8}>
          <RadiusSelection
            showSearch={true}
            onSearch={(e) => onChangeSearchCategory(e)}
            placeholder={'Tòa nhà'}
            onChange={(value: number) => {
              let tmpValue
              value === undefined ? (tmpValue = null) : (tmpValue = value)
              onChangeValue({ categoryId: tmpValue })
            }}
            options={categoryListOptions}
          />
        </Col>
        <Col md={8}>
          <RangerPicker
            onChange={(name: string, value: any) => onChangeValue({ date: value ? value : '' })}
            name='createDate'
          />
        </Col>
      </Row>
      {/* <Row gutter={24} className='mt-4'>
        <Col md={8}>
          <RadiusSelection
            allowClear
            placeholder={'Sắp xếp theo'}
            onChange={(value: number) => {
              let tmpValue
              value === undefined ? (tmpValue = null) : (tmpValue = value)
              onChangeValue({ sortBy: tmpValue })
            }}
            options={[
              { value: SortBy.ASC, text: 'Giá tăng dần' },
              { value: SortBy.DESC, text: 'Giá giảm dần' }
            ]}
          />
        </Col>
        <Col md={8}>
          <RadiusSelection
            showSearch={true}
            onSearch={(e) => onChangeSearchCategory(e)}
            placeholder={'Tòa nhà'}
            onChange={(value: number) => {
              let tmpValue
              value === undefined ? (tmpValue = null) : (tmpValue = value)
              onChangeValue({ categoryId: tmpValue })
            }}
            options={categoryListOptions}
          />
        </Col>
      </Row> */}
    </>
  )
}

export default FilterProduct
