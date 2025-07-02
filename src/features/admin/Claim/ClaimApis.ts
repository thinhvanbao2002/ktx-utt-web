import { handleObjectEmpty } from 'common/utils'
import { AxiosClient } from '../../../apis/axiosClient'
import { RECORD_SIZE } from 'common/config'
import { IClaim, IPayloadListClaim } from './Claim.props'

export const claimServices = {
  get: (params: IPayloadListClaim) => {
    const url = '/claim'
    const handleParams = handleObjectEmpty(params)
    return AxiosClient.get(url, {
      params: { ...handleParams, limit: RECORD_SIZE }
    })
  },
  post: (payload: IClaim) => {
    const url = '/claim'
    return AxiosClient.post(url, {
      ...payload
    })
  },
  patch: (value: Partial<IClaim>) => {
    const url = `/claim/${value?.id}`
    return AxiosClient.patch(url, {
      ...value
    })
  },
  delete: (id: number) => {
    const url = `/claim/${id}`
    return AxiosClient.delete(url)
  }
}
