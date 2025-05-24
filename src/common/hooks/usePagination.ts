import { useState, useCallback } from 'react'

interface PaginationParams {
  page: number
  limit: number
  total?: number
}

interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialLimit = 10, onPageChange, onLimitChange } = options

  const [pagination, setPagination] = useState<PaginationParams>({
    page: initialPage,
    limit: initialLimit
  })

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }))
      onPageChange?.(page)
    },
    [onPageChange]
  )

  const handleLimitChange = useCallback(
    (limit: number) => {
      setPagination((prev) => ({ ...prev, limit, page: 1 }))
      onLimitChange?.(limit)
    },
    [onLimitChange]
  )

  const setTotal = useCallback((total: number) => {
    setPagination((prev) => ({ ...prev, total }))
  }, [])

  return {
    pagination,
    handlePageChange,
    handleLimitChange,
    setTotal
  }
}
