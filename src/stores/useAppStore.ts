import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  theme: 'light' | 'dark'
  themeColor: string
  menuCollapse: boolean
  layout: 'default' | 'mix' | 'top' | 'columns'
  menuAccordion: boolean
  menuDark: boolean
  tab: boolean
  tabMode: string
  animate: boolean
  animateMode: string
  copyrightDisplay: boolean
  siteConfig: Record<string, string>
  toggleTheme: () => void
  setThemeColor: (color: string) => void
  setMenuCollapse: (collapse: boolean) => void
  setLayout: (layout: AppState['layout']) => void
  setSiteConfig: (config: Record<string, string>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      themeColor: '#165DFF',
      menuCollapse: false,
      layout: 'mix',
      menuAccordion: true,
      menuDark: false,
      tab: true,
      tabMode: 'card-gutter',
      animate: false,
      animateMode: 'zoom-fade',
      copyrightDisplay: true,
      siteConfig: {},
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          document.documentElement.setAttribute('data-theme', newTheme)
          return { theme: newTheme }
        }),
      setThemeColor: (color) => set({ themeColor: color }),
      setMenuCollapse: (collapse) => set({ menuCollapse: collapse }),
      setLayout: (layout) => set({ layout }),
      setSiteConfig: (config) => set({ siteConfig: config }),
    }),
    { name: 'app-store' },
  ),
)
