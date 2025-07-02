export interface IDataAccount {
  phone?: string
  name?: string
  email?: string
  password?: string
  avatar?: string
}

export interface IAccount {
  id?: string | null
  name: string
  phone: string
  email: string
  password?: string
  avatar?: string
  status: string
  s?: string
  role?: string
  cccd_code?: string
  class_code?: string
  student_code?: string
  hometown?: string
}
export interface IPayLoadListUser {
  page?: number
  take?: number
  q?: string
  status?: string
  from_date?: string
  to_date?: string
  role?: string
}
