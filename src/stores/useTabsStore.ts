import { create } from 'zustand'

interface TabItem {
  path: string
  title: string
  closable: boolean
}

interface TabsState {
  tabList: TabItem[]
  cacheList: string[]
  reloadFlag: boolean
  addTabItem: (tab: TabItem) => void
  deleteTabItem: (path: string) => void
  clearTabList: () => void
  closeCurrent: (path: string) => void
  closeOther: (path: string) => void
  closeLeft: (path: string) => void
  closeRight: (path: string) => void
  closeAll: () => void
  reloadPage: () => void
}

export const useTabsStore = create<TabsState>()((set, get) => ({
  tabList: [],
  cacheList: [],
  reloadFlag: false,
  addTabItem: (tab) =>
    set((state) => {
      if (state.tabList.some((t) => t.path === tab.path)) return state
      return { tabList: [...state.tabList, tab] }
    }),
  deleteTabItem: (path) =>
    set((state) => ({
      tabList: state.tabList.filter((t) => t.path !== path),
    })),
  clearTabList: () => set({ tabList: [] }),
  closeCurrent: (path) => {
    const { tabList } = get()
    const idx = tabList.findIndex((t) => t.path === path)
    if (idx > -1 && tabList[idx].closable) {
      set({ tabList: tabList.filter((t) => t.path !== path) })
    }
  },
  closeOther: (path) => {
    set((state) => ({
      tabList: state.tabList.filter((t) => t.path === path || !t.closable),
    }))
  },
  closeLeft: (path) => {
    const { tabList } = get()
    const idx = tabList.findIndex((t) => t.path === path)
    set({ tabList: tabList.filter((t, i) => i >= idx || !t.closable) })
  },
  closeRight: (path) => {
    const { tabList } = get()
    const idx = tabList.findIndex((t) => t.path === path)
    set({ tabList: tabList.filter((t, i) => i <= idx || !t.closable) })
  },
  closeAll: () => {
    set((state) => ({
      tabList: state.tabList.filter((t) => !t.closable),
    }))
  },
  reloadPage: () => {
    set({ reloadFlag: true })
    setTimeout(() => set({ reloadFlag: false }), 300)
  },
}))
