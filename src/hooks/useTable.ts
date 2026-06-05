import { useState, useCallback, useRef } from 'react'
import { message, Modal } from 'antd'
import { usePagination } from './usePagination'

interface UseTableOptions {
  api: (params: any) => Promise<any>
  deleteApi?: (ids: string[]) => Promise<any>
  defaultPageSize?: number
  immediate?: boolean
}

export function useTable<T = any>(options: UseTableOptions) {
  const { api, deleteApi, defaultPageSize = 10, immediate = true } = options
  const [dataSource, setDataSource] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const pagination = usePagination(defaultPageSize)
  const queryParams = useRef<any>({})

  const fetchData = useCallback(
    async (params?: any) => {
      if (params) queryParams.current = params
      setLoading(true)
      try {
        const res = await api({
          page: pagination.current,
          size: pagination.pageSize,
          ...queryParams.current,
        })
        setDataSource(res.data?.list || [])
        pagination.setTotal(res.data?.total || 0)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    },
    [pagination.current, pagination.pageSize],
  )

  const handleDelete = useCallback(
    (id: string) => {
      if (!deleteApi) return
      Modal.confirm({
        title: '确认删除？',
        content: '删除后将无法恢复',
        onOk: async () => {
          await deleteApi([id])
          message.success('删除成功')
          fetchData()
        },
      })
    },
    [deleteApi, fetchData],
  )

  const handleBatchDelete = useCallback(() => {
    if (!deleteApi || !selectedRowKeys.length) return
    Modal.confirm({
      title: `确认删除选中的 ${selectedRowKeys.length} 条数据？`,
      onOk: async () => {
        await deleteApi(selectedRowKeys)
        message.success('删除成功')
        setSelectedRowKeys([])
        fetchData()
      },
    })
  }, [deleteApi, selectedRowKeys, fetchData])

  const handleSearch = useCallback(
    (params: any) => {
      queryParams.current = params
      pagination.setCurrent(1)
      fetchData(params)
    },
    [fetchData],
  )

  const handleReset = useCallback(() => {
    queryParams.current = {}
    pagination.setCurrent(1)
    fetchData({})
  }, [fetchData])

  return {
    dataSource,
    loading,
    pagination,
    selectedRowKeys,
    setSelectedRowKeys,
    fetchData,
    handleDelete,
    handleBatchDelete,
    handleSearch,
    handleReset,
  }
}
