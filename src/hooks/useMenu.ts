import { useState, useEffect, useCallback } from 'react'
import { listMenuDictTree } from '@/services/system/menu'

export function useMenu() {
  const [menuTree, setMenuTree] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadMenu = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listMenuDictTree({ description: '' })
      setMenuTree(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMenu()
  }, [loadMenu])

  return { menuTree, loading, reload: loadMenu }
}
