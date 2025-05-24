import { useState, useEffect } from 'react'
import { categoryServices } from 'features/admin/Building/BuildingApis'
import { roomTypeServices } from 'features/admin/RoomType/RoomTypeApis'
import { deviceServices } from 'features/admin/Device/DeviceApis'

interface Option {
  text: string
  value: number | string
}

interface UseRoomOptionsReturn {
  categoryListOptions: Option[]
  roomTypeListOptions: Option[]
  deviceListOptions: Option[]
  handleSearch: (value: string) => void
}

export const useRoomOptions = (): UseRoomOptionsReturn => {
  const [payload, setPayload] = useState({
    q: '',
    limit: 5
  })
  const [categoryListOptions, setCategoryListOptions] = useState<Option[]>([])
  const [roomTypeListOptions, setRoomTypeListOptions] = useState<Option[]>([])
  const [deviceListOptions, setDeviceListOptions] = useState<Option[]>([])

  const handleSearch = (value: string) => {
    setPayload((prev) => ({
      ...prev,
      q: value
    }))
  }

  const fetchCategoryOptions = async () => {
    try {
      const res = await categoryServices.get(payload)
      setCategoryListOptions(
        res.data.map((item: any) => ({
          text: item?.name,
          value: item?.id
        }))
      )
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchRoomTypeOptions = async () => {
    try {
      const res = await roomTypeServices.get(payload)
      setRoomTypeListOptions(
        res.data.map((item: any) => ({
          text: item?.name,
          value: item?.id
        }))
      )
    } catch (error) {
      console.error('Error fetching room types:', error)
    }
  }

  const fetchDeviceOptions = async () => {
    try {
      const res = await deviceServices.get(payload)
      setDeviceListOptions(
        res.data.map((item: any) => ({
          text: item?.name,
          value: item?.id
        }))
      )
    } catch (error) {
      console.error('Error fetching devices:', error)
    }
  }

  useEffect(() => {
    fetchCategoryOptions()
    fetchRoomTypeOptions()
    fetchDeviceOptions()
  }, [payload])

  return {
    categoryListOptions,
    roomTypeListOptions,
    deviceListOptions,
    handleSearch
  }
}
