export interface ICategory {
  id?: number
  name: string
  address: string
  note: string
  status: string
}

export interface IPayLoadLisCategory {
  page?: number
  take?: number
  q?: string
  status?: number
  from_date?: string
  to_date?: string
}
