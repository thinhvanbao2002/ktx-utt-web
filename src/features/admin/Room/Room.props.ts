export interface IRoom {
  id?: number
  room_number: string
  room_type_id: number
  building_id: number
  quantity: number
  image?: string
  room_photos?: Array<{
    uid: string
    name: string
    url: string
  }>
  floor: number
  devices?: number[]
  price?: number
  max_student?: number
}

export interface IRoomResponse {
  id: number
  room_number: string
  room_type: {
    id: number
    name: string
    price: number
    max_student: number
  }
  building: {
    id: number
    name: string
  }
  quantity: number
  image: string
  room_photos: Array<{
    id: number
    full_url: string
  }>
  floor: number
  room_devices: Array<{
    device: {
      id: number
      name: string
    }
  }>
}

export interface IPayLoadLisCategory {
  page?: number
  limit?: number
  q?: string
  status?: number
  from_date?: string
  to_date?: string
  category_id?: number
  product_type?: number
}
