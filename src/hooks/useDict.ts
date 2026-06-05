import { useState, useEffect, useCallback } from 'react'
import { useDictStore } from '@/stores/useDictStore'
import { listCommonDict } from '@/services/system/common'

export function useDict(code: string) {
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { getDict, setDict } = useDictStore()

  const loadDict = useCallback(async () => {
    const cached = getDict(code)
    if (cached) {
      setOptions(cached)
      return
    }
    setLoading(true)
    try {
      const res = await listCommonDict(code)
      const data = res.data || []
      setDict(code, data)
      setOptions(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    loadDict()
  }, [loadDict])

  return { options, loading, reload: loadDict }
}
