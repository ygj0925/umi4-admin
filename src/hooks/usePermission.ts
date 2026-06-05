import { useCallback } from 'react'
import { useUserStore } from '@/stores/useUserStore'

export function usePermission() {
  const hasPerm = useCallback((permission: string) => {
    const { permissions } = useUserStore.getState()
    if (permissions.includes('*:*:*')) return true
    return permissions.includes(permission)
  }, [])

  const hasPermOr = useCallback((perms: string[]) => {
    return perms.some((p) => hasPerm(p))
  }, [hasPerm])

  const hasPermAnd = useCallback((perms: string[]) => {
    return perms.every((p) => hasPerm(p))
  }, [hasPerm])

  const hasRole = useCallback((role: string) => {
    const { roles } = useUserStore.getState()
    if (roles.includes('role_admin')) return true
    return roles.includes(role)
  }, [])

  const hasRoleOr = useCallback((roles: string[]) => {
    return roles.some((r) => hasRole(r))
  }, [hasRole])

  const hasRoleAnd = useCallback((roles: string[]) => {
    return roles.every((r) => hasRole(r))
  }, [hasRole])

  return { hasPerm, hasPermOr, hasPermAnd, hasRole, hasRoleOr, hasRoleAnd }
}
