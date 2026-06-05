export interface ApiRes<T = any> {
  code: number | string
  data: T
  msg: string
  success: boolean
  timestamp: string
}

export interface PageRes<T = any> {
  list: T[]
  total: number
}

export interface PageQuery {
  page: number
  size: number
}

export interface LabelValueState {
  label: string
  value: string | number
}
