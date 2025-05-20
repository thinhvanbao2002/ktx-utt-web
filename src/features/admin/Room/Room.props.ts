export interface IRoom {
  id?: string
  room_number: string
  room_type_id: number
  price: number
  building_id: number
  availability?: number
  status?: number
  number_of_review?: number
  quantity?: number
  sold?: number
  description: string
  image: string
  floor: number
  images: string
  room_photos: []
  introduce: string
  product_code?: string
  device_ids?: []
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
