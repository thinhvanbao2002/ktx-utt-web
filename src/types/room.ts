export interface IRoom {
  id: string
  roomNumber: string
  roomType: string
  status: string
  images?: RoomImage[]
}

export interface RoomImage {
  id: string
  url: string
  roomId: string
}
