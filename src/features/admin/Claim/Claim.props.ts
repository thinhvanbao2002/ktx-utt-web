export interface IClaim {
  id?: number
  student_code: string
  student_name: string
  room_number: string
  content: string
  supporter?: string
  status: 'pending' | 'resolved'
  created_at?: string
  updated_at?: string
}

export interface IPayloadListClaim {
  page?: number
  take?: number
  q?: string
  status?: 'pending' | 'resolved'
  from_date?: string
  to_date?: string
}
