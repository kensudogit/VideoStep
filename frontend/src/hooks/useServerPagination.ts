import { useState, useEffect, useCallback } from 'react'

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
  isFirst: boolean
  isLast: boolean
}

interface UseServerPaginationOptions {
  pageSize?: number
  fetchFunction: (page: number, size: number) => Promise<{
    data: any[]
    pagination?: PaginationInfo
  }>
}

/**
 * サーバー側ページネーションフック
 */
export function useServerPagination<T>({ 
  pageSize = 12, 
  fetchFunction 
}: UseServerPaginationOptions) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFunction(page, pageSize)
      setData(result.data)
      if (result.pagination) {
        setPagination(result.pagination)
        setCurrentPage(result.pagination.currentPage)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, pageSize])

  useEffect(() => {
    fetchData(0)
  }, [fetchFunction])

  const goToPage = useCallback((page: number) => {
    if (pagination) {
      if (page >= 0 && page < pagination.totalPages) {
        fetchData(page)
      }
    }
  }, [pagination, fetchData])

  const nextPage = useCallback(() => {
    if (pagination?.hasNext) {
      fetchData(currentPage + 1)
    }
  }, [pagination, currentPage, fetchData])

  const prevPage = useCallback(() => {
    if (pagination?.hasPrevious) {
      fetchData(currentPage - 1)
    }
  }, [pagination, currentPage, fetchData])

  const refresh = useCallback(() => {
    fetchData(currentPage)
  }, [currentPage, fetchData])

  return {
    data,
    loading,
    error,
    currentPage: currentPage + 1, // 1ベースのページ番号
    totalPages: pagination?.totalPages || 0,
    totalElements: pagination?.totalElements || 0,
    pageSize: pagination?.pageSize || pageSize,
    hasNext: pagination?.hasNext || false,
    hasPrevious: pagination?.hasPrevious || false,
    isFirst: pagination?.isFirst || false,
    isLast: pagination?.isLast || false,
    goToPage: (page: number) => goToPage(page - 1), // 1ベースから0ベースに変換
    nextPage,
    prevPage,
    refresh,
  }
}

