import { Form } from 'antd'
import { useCallback } from 'react'
import { useApi } from './useApi'

interface UseFormOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  successMessage?: string
  errorMessage?: string
}

export function useForm<T = any>() {
  const [form] = Form.useForm()
  const { loading, error, execute } = useApi<T>()

  const handleSubmit = useCallback(
    async (apiCall: (values: any) => Promise<T>, options: UseFormOptions<T> = {}) => {
      try {
        const values = await form.validateFields()
        return await execute(() => apiCall(values), options)
      } catch (err) {
        if (err.errorFields) {
          // Form validation failed
          return
        }
        throw err
      }
    },
    [form, execute]
  )

  const resetForm = useCallback(() => {
    form.resetFields()
  }, [form])

  return {
    form,
    loading,
    error,
    handleSubmit,
    resetForm
  }
}
