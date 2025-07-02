export interface IRoomType {
  id?: number
  name: string
  price: number
  max_student: number
  gender?: 'male' | 'female'
}

export interface IPayLoadLisCategory {
  page?: number
  take?: number
  q?: string
  status?: number
  from_date?: string
  to_date?: string
}
