import { handleObjectEmpty } from 'common/utils'
import { AxiosClient } from '../../../apis/axiosClient'
import { RECORD_SIZE } from 'common/config'
import { IDevice, IPayLoadLisCategory } from './Device.props'

export const deviceServices = {
  get: (params: IPayLoadLisCategory) => {
    const url = '/device'
    const handleParams = handleObjectEmpty(params)
    return AxiosClient.get(url, {
      params: { ...handleParams, limit: RECORD_SIZE }
    })
  },
  post: (payload: IDevice) => {
    const url = '/device'
    return AxiosClient.post(url, {
      ...payload
    })
  },
  patch: (value: any) => {
    const url = `/device/${value?.id}`
    return AxiosClient.patch(url, {
      ...value
    })
  },
  delete: (id: number) => {
    const url = `/device/${id}`
    return AxiosClient.delete(url)
  }
}
