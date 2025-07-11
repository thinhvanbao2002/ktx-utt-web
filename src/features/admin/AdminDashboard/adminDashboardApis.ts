import { AxiosClient } from '../../../apis/axiosClient'

export interface IQuery {
  page: number
}

export const adminDashboardServices = {
  post: () => {
    const url = '/admin-dashboard'
    return AxiosClient.post(url)
  },
  getRevenueByYear: (year: number) => {
    const url = `/overview/revenue/${year}`
    return AxiosClient.get(url)
  },
  getStudentRegisterStatistics: (year: number) => {
    const url = `/admin-dashboard/student-register-statistics?year=${year}`
    return AxiosClient.get(url)
  }
}
