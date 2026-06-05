import { useState, useEffect, useCallback } from 'react'
import { listDeptDictTree } from '@/services/system/dept'

export function useDept() {
  const [deptTree, setDeptTree] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadDept = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listDeptDictTree({ description: '' })
      setDeptTree(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDept()
  }, [loadDept])

  return { deptTree, loading, reload: loadDept }
}
