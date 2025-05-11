import { handleObjectEmpty } from 'common/utils'
import { AxiosClient } from '../../../apis/axiosClient'
import { RECORD_SIZE } from 'common/config'
import { ICategory, IPayLoadLisCategory } from './Building.props'

export const categoryServices = {
  get: (params: IPayLoadLisCategory) => {
    const url = '/building'
    const handleParams = handleObjectEmpty(params)
    return AxiosClient.get(url, {
      params: { ...handleParams, limit: RECORD_SIZE }
    })
  },
  post: (payload: ICategory) => {
    const url = '/building'
    return AxiosClient.post(url, {
      ...payload
    })
  },
  patch: (value: any) => {
    const url = `/building/${value?.id}`
    return AxiosClient.patch(url, {
      ...value
    })
  },
  delete: (id: number) => {
    const url = `/building/${id}`
    return AxiosClient.delete(url)
  }
}
