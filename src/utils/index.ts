import dayjs from 'dayjs'
import { camelCase, upperFirst } from 'lodash-es'

export function filterTree<T extends { children?: T[] }>(
  array: T[],
  fn: (item: T, index?: number, items?: T[]) => boolean,
): T[] {
  const arr = array.filter(fn)
  return arr.map((item) => {
    if (item.children && item.children.length) {
      return { ...item, children: filterTree(item.children, fn) }
    }
    return item
  })
}

export function sortTree<T extends { sort?: number; children?: T[] }>(array: T[]): T[] {
  const sorted = [...array].sort((a, b) => (a?.sort ?? 0) - (b?.sort ?? 0))
  return sorted.map((item) => {
    if (item.children && item.children.length) {
      return { ...item, children: sortTree(item.children) }
    }
    return item
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / 1024 ** index
  return `${size.toFixed(2)} ${unitArr[index]}`
}

export function copyText(text: string) {
  navigator.clipboard.writeText(text)
}

export function dateFormat(date: string | Date = new Date(), format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format)
}

export function transformPathToName(path: string): string {
  if (!path) return ''
  return upperFirst(camelCase(path))
}

export function isEmpty(data: unknown): boolean {
  if (data === '' || data === 'undefined' || data === undefined || data == null || data === 'null') {
    return true
  }
  return JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]' || JSON.stringify(data) === '[{}]'
}

export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function goodTimeText(): string {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour <= 18 ? '下午好' : '晚上好'
}

export function hidePhone(phone: string): string {
  return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

export function formatPhone(mobile: string, formatStr = '-'): string {
  return mobile.replace(/(?=(\d{4})+$)/g, formatStr)
}
