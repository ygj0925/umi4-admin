import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TenantState {
  tenantEnabled: boolean
  tenantId: string
  needInputTenantCode: boolean
  setTenantEnable: (enabled: boolean) => void
  setTenantId: (id: string) => void
  resetTenantId: () => void
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenantEnabled: false,
      tenantId: '',
      needInputTenantCode: true,
      setTenantEnable: (enabled) => set({ tenantEnabled: enabled }),
      setTenantId: (id) => set({ tenantId: id }),
      resetTenantId: () => set({ tenantId: '' }),
    }),
    {
      name: 'tenant-store',
      partialize: (state) => ({
        tenantEnabled: state.tenantEnabled,
        tenantId: state.tenantId,
      }),
    },
  ),
)
