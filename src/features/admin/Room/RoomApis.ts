import { handleObjectEmpty } from 'common/utils'
import { AxiosClient } from '../../../apis/axiosClient'
import { RECORD_SIZE } from 'common/config'
import { IRoom } from './Room.props'

export interface IQuery {
  page: number
}

export const productServices = {
  get: (params: IQuery) => {
    const url = '/room'
    const handleParams = handleObjectEmpty(params)
    return AxiosClient.get(url, {
      params: { ...handleParams, limit: RECORD_SIZE }
    })
  },
  post: (value: IRoom) => {
    const url = '/room'
    return AxiosClient.post(url, {
      ...value
    })
  },
  patch: (value: IRoom) => {
    const url = `/room/${value?.id}`
    return AxiosClient.patch(url, {
      ...value
    })
  },
  delete: (id: number) => {
    const url = `/room/${id}`
    return AxiosClient.delete(url)
  },
  export: (value: IQuery) => {
    console.log('🚀 ~ value:', value)
    const url = '/room/ export'
    const handleParams = handleObjectEmpty(value)
    return AxiosClient.post(url, {
      ...handleParams,
      limit: RECORD_SIZE
    })
  }
}
