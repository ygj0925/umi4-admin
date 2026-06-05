import { useUserStore } from '@/stores/useUserStore'

function authPermission(permission: string) {
  const all_permission = '*:*:*'
  const permissions = useUserStore.getState().permissions
  if (permission && permission.length > 0) {
    return permissions.some((v) => {
      return all_permission === v || v === permission
    })
  } else {
    return false
  }
}

function authRole(role: string) {
  const super_admin = 'role_admin'
  const roles = useUserStore.getState().roles
  if (role && role.length > 0) {
    return roles.some((v) => {
      return super_admin === v || v === role
    })
  } else {
    return false
  }
}

export default {
  hasPerm(permission: string) {
    return authPermission(permission)
  },
  hasPermOr(permissions: string[]) {
    return permissions.some((item) => authPermission(item))
  },
  hasPermAnd(permissions: string[]) {
    return permissions.every((item) => authPermission(item))
  },
  hasRole(role: string) {
    return authRole(role)
  },
  hasRoleOr(roles: string[]) {
    return roles.some((item) => authRole(item))
  },
  hasRoleAnd(roles: string[]) {
    return roles.every((item) => authRole(item))
  },
}
