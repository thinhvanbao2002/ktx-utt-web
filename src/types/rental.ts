export enum RentRoomStatus {
  DRAFT = 'draft',
  WAITING_FOR_CONFIRMATION = 'waitingForConfirmation',
  CONFIRMED = 'confirmed',
  CONTRACT_SIGNED = 'contractSigned',
  COMPLETED = 'completed'
}

export interface IRentalRequest {
  id: string
  room_id: string
  user_id: string
  parent_phone: string
  contract_duration: number // in months
  contract_signed_date?: Date
  contract_end_date?: Date
  status: RentRoomStatus
  created_at: Date
  updated_at: Date
}

export interface IRentalRequestForm {
  room_id: string
  user_id: string
  parent_phone: string
  contract_duration: number
  contract_signed_date?: Date
  contract_end_date?: Date
}
