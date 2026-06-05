import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '@/services/auth'
import type { RouteItem } from '@/services/auth'

interface RouteState {
  routes: RouteItem[]
  asyncRoutes: RouteItem[]
  firstRoutePath: string
  generateRoutes: () => Promise<RouteItem[]>
}

function findFirstRoutePath(routes: RouteItem[]): string | null {
  for (const route of routes) {
    if (route.path && route.type === 2 && !route.isHidden) {
      return route.path
    }
    if (route.children?.length) {
      const path = findFirstRoutePath(route.children)
      if (path) return path
    }
  }
  return null
}

export const useRouteStore = create<RouteState>()(
  persist(
    (set) => ({
      routes: [],
      asyncRoutes: [],
      firstRoutePath: '/dashboard/workplace',
      generateRoutes: async () => {
        const res = await authApi.getUserRoute()
        const asyncRoutes = res.data || []
        const firstRoutePath = findFirstRoutePath(asyncRoutes) || '/dashboard/workplace'
        set({ asyncRoutes, firstRoutePath })
        return asyncRoutes
      },
    }),
    { name: 'route-store' },
  ),
)
