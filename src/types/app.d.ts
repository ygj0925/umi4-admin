import type { RouteItem } from '@/services/auth'

export interface AppSettings {
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
}

export interface DictItem {
  label: string
  value: string | number
  color?: string
  tag?: string
}

export interface SiteConfig {
  favicon: string
  logo: string
  title: string
  copyright: string
  description: string
}
