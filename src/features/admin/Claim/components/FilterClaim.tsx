/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Col } from 'antd'
import RJSearch from 'common/components/search/RJSearch'
import RadiusSelection from 'common/components/select/RadiusSelection'
import RangerPicker from 'common/components/rangePicker/RangePicker'

interface IFilter {
  onChangeValue?: any
}

function FilterCategory({ onChangeValue }: IFilter) {
  return (
    <>
      <Col md={7}>
        <RJSearch
          placeholder='Nhập tên loại phòng'
          onInputSearch={(value: string) => {
            onChangeValue({ search: value })
          }}
        />
      </Col>
      <Col md={7}>
        <RadiusSelection
          placeholder={'Trạng thái'}
          onChange={(value: string) => {
            const tmpValue = value === undefined ? undefined : value
            onChangeValue({ status: tmpValue })
          }}
          options={[
            { value: 'pending', text: 'Chờ xử lý' },
            { value: 'resolved', text: 'Đã xử lý' }
          ]}
        />
      </Col>
      <Col md={10}>
        <RangerPicker
          onChange={(name: string, value: any) => onChangeValue({ date: value ? value : '' })}
          name='createDate'
        />
      </Col>
    </>
  )
}

export default FilterCategory
