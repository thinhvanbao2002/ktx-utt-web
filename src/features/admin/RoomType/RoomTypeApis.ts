import { handleObjectEmpty } from 'common/utils'
import { AxiosClient } from '../../../apis/axiosClient'
import { RECORD_SIZE } from 'common/config'
import { IRoomType, IPayLoadLisCategory } from './RoomType.props'

export const roomTypeServices = {
  get: (params: IPayLoadLisCategory) => {
    const url = '/room_type'
    const handleParams = handleObjectEmpty(params)
    return AxiosClient.get(url, {
      params: { ...handleParams, limit: RECORD_SIZE }
    })
  },
  post: (payload: IRoomType) => {
    const url = '/room_type'
    return AxiosClient.post(url, {
      ...payload
    })
  },
  patch: (value: any) => {
    console.log('🚀 ~ value:', value)
    const url = `/room_type/${value?.id}`
    return AxiosClient.patch(url, {
      ...value
    })
  },
  delete: (id: number) => {
    const url = `/room_type/${id}`
    return AxiosClient.delete(url)
  }
}
