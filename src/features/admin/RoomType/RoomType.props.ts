export interface IRoomType {
  id?: number
  name: string
  price: string
  max_student: string
}

export interface IPayLoadLisCategory {
  page?: number
  take?: number
  q?: string
  status?: number
  from_date?: string
  to_date?: string
}
