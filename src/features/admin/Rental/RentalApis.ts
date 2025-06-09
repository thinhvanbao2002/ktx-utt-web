/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosResponse } from 'axios'
import { IQuery } from '../AdminDashboard/adminDashboardApis'
import { RentRoomStatus } from 'types/rental'
import { AxiosClient } from 'apis/axiosClient'
import { API_URL } from 'common/constants'
import { handleObjectEmpty } from 'common/utils'
import { RECORD_SIZE } from 'common/config'

export const rentalServices = {
  get: (params: IQuery) => {
    const url = '/rent-rooms'
    const handleParams = handleObjectEmpty(params)
    console.log('🚀 ~ handleParams:', handleParams)
    return AxiosClient.get(url, {
      params: { ...handleParams, limit: RECORD_SIZE, order_status: handleParams.status }
    })
  },

  getMyRequest: () => {
    const url = '/rent-rooms/my-requests'
    return AxiosClient.get(url)
  },

  getById: (id: number) => {
    const url = '/rent-rooms'
    return AxiosClient.get(`${url}/${id}`)
  },

  create: (value: any) => {
    console.log('🚀 ~ value:', value)
    const url = '/rent-rooms'
    return AxiosClient.post(url, {
      ...value
    })
  },

  update: (id: number, data: any) => {
    return AxiosClient.patch(`${API_URL}/rentals/${id}`, data)
  },

  delete: (id: number) => {
    return AxiosClient.delete(`${API_URL}/rentals/${id}`)
  },

  triggerWorkflow: (data: { action: RentRoomStatus; ren_room_id: number; room_id: any }) => {
    return AxiosClient.post(`/rent-rooms/trigger-workflow`, data)
  },

  endContract: (data: { ren_room_id: number; room_id: number; end_date: string }) => {
    return AxiosClient.post(`/rent-rooms/end-contract`, data)
  }
}
