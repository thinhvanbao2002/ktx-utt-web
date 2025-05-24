import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface RoomImage {
  uid: string
  name: string
  url: string
}

interface UseRoomImagesProps {
  record?: any
  form: any
}

export const useRoomImages = ({ record, form }: UseRoomImagesProps) => {
  const [images, setImages] = useState<RoomImage[]>([])

  useEffect(() => {
    if (record?.room_photos?.length) {
      const convertedImages = record.room_photos.map((photo: any) => ({
        uid: uuidv4(),
        name: uuidv4(),
        url: photo?.url
      }))

      setImages(convertedImages)
      form.setFieldsValue({ room_photos: convertedImages })
    }
  }, [record, form])

  const handleImagesChange = (newImages: any[]) => {
    const standardizedImages = newImages.map((item: any) => {
      console.log('🚀 ~ standardizedImages ~ item:', item)

      if (item?.response?.url) {
        return {
          uid: item.uid,
          name: item.name,
          url: item.response.fullUrl
        }
      }
      return {
        uid: item.uid,
        name: item.name,
        url: item.url
      }
    })

    setImages(standardizedImages)
    form.setFieldsValue({ room_photos: standardizedImages })
  }

  return {
    images,
    handleImagesChange
  }
}
