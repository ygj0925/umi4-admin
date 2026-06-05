import { useState, useCallback } from 'react'

export function usePagination(defaultPageSize = 10) {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [total, setTotal] = useState(0)

  const onChange = useCallback((page: number, size: number) => {
    setCurrent(page)
    setPageSize(size)
  }, [])

  return { current, pageSize, total, setCurrent, setPageSize, setTotal, onChange }
}
