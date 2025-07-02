import { handleObjectEmpty } from 'common/utils'
import { AxiosClient } from '../../../apis/axiosClient'
import { RECORD_SIZE } from 'common/config'
import { IAccount } from './Student.props'

export interface IQuery {
  page: number
  take?: number
  q?: string
  status?: string
  from_date?: string
  to_date?: string
  role?: string
}

export const accountServices = {
  get: (params: IQuery) => {
    const url = '/user'
    const handleParams = handleObjectEmpty(params)
    return AxiosClient.get(url, {
      params: { ...handleParams, limit: RECORD_SIZE }
    })
  },
  post: (value: IAccount) => {
    const url = '/user'
    return AxiosClient.post(url, {
      ...value,
      role: 'student'
    })
  },
  put: (value: IAccount) => {
    const url = `/user/${value?.id}`
    return AxiosClient.put(url, {
      ...value
    })
  },
  delete: (id: number) => {
    const url = `/user/${id}`
    return AxiosClient.delete(url)
  }
}
