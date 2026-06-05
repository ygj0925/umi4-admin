export type AnyObject = Record<string, any>

export interface Options {
  label: string
  value: string | number
}

export type Status = 1 | 2
export type Gender = 0 | 1 | 2

declare global {
  type ApiRes<T = any> = import('./api').ApiRes<T>
  type PageRes<T = any> = import('./api').PageRes<T>
  type PageQuery = import('./api').PageQuery
  type LabelValueState = import('./api').LabelValueState
}
