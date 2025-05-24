import { useState, useCallback } from 'react'
import { message } from 'antd'
import axios, { AxiosRequestConfig } from 'axios'

interface UseApiState {
  loading: boolean
  error: any
  data: any
}

export function useApi() {
  const [state, setState] = useState<UseApiState>({
    loading: false,
    error: null,
    data: null
  })

  const execute = useCallback(async (config: AxiosRequestConfig) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await axios(config)
      setState((prev) => ({ ...prev, loading: false, data: response.data }))
      return response
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error }))
      message.error('Có lỗi xảy ra')
      throw error
    }
  }, [])

  return {
    ...state,
    execute
  }
}
