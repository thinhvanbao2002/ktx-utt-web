export interface IDevice {
  id?: number
  device_code: string
  name: string
}

export interface IPayLoadLisCategory {
  page?: number
  take?: number
  q?: string
  status?: number
  from_date?: string
  to_date?: string
}
