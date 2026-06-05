import { request } from 'umi'

const API_PREFIX = '/sss-task'

export function getAreaList(params: { type: 'province' | 'city' | 'area', code?: string }) {
  return request<any>(`${API_PREFIX}/area/list`, { method: 'GET', params })
}
