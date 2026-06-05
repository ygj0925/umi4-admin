import { create } from 'zustand'
import type { DictItem } from '@/types/app'

interface DictState {
  dictData: Record<string, DictItem[]>
  setDict: (code: string, data: DictItem[]) => void
  getDict: (code: string) => DictItem[] | undefined
  deleteDict: (code: string) => void
  cleanDict: () => void
}

export const useDictStore = create<DictState>()((set, get) => ({
  dictData: {},
  setDict: (code, data) =>
    set((state) => ({ dictData: { ...state.dictData, [code]: data } })),
  getDict: (code) => get().dictData[code],
  deleteDict: (code) =>
    set((state) => {
      const { [code]: _, ...rest } = state.dictData
      return { dictData: rest }
    }),
  cleanDict: () => set({ dictData: {} }),
}))
