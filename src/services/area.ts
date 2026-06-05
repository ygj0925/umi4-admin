import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'

export function getAreaList(params: { type: 'province' | 'city' | 'area', code?: string }) {
  return request<any>(`${API_PREFIX}/area/list`, { method: 'GET', params })
}
