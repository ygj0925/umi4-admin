import { useState, useEffect, useCallback } from 'react'
import { listRoleDict } from '@/services/system/role'

export function useRole() {
  const [roleOptions, setRoleOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadRoles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listRoleDict()
      setRoleOptions(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRoles()
  }, [loadRoles])

  return { roleOptions, loading, reload: loadRoles }
}
