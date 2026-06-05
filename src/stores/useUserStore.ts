import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setToken, clearToken } from '@/utils/auth'
import * as authApi from '@/services/auth'
import type { UserInfo } from '@/services/auth'

interface UserState {
  token: string
  userInfo: UserInfo | null
  roles: string[]
  permissions: string[]
  pwdExpiredShow: boolean
  login: (params: any) => Promise<void>
  getInfo: () => Promise<UserInfo>
  logout: () => Promise<void>
  logoutCallBack: () => void
  resetToken: () => void
  setPwdExpiredShow: (show: boolean) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: '',
      userInfo: null,
      roles: [],
      permissions: [],
      pwdExpiredShow: false,
      login: async (params) => {
        const res = await authApi.accountLogin(params)
        setToken(res.data.token)
        set({ token: res.data.token })
      },
      getInfo: async () => {
        const res = await authApi.getUserInfo()
        const userInfo = res.data
        set({
          userInfo,
          roles: userInfo.roles,
          permissions: userInfo.permissions,
          pwdExpiredShow: userInfo.pwdExpired,
        })
        return userInfo
      },
      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          clearToken()
          set({ token: '', userInfo: null, roles: [], permissions: [] })
        }
      },
      logoutCallBack: () => {
        clearToken()
        set({ token: '', userInfo: null, roles: [], permissions: [] })
      },
      resetToken: () => {
        clearToken()
        set({ token: '', userInfo: null, roles: [], permissions: [] })
      },
      setPwdExpiredShow: (show) => set({ pwdExpiredShow: show }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        token: state.token,
        roles: state.roles,
        permissions: state.permissions,
        pwdExpiredShow: state.pwdExpiredShow,
      }),
    },
  ),
)
