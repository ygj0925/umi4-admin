import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/system/option'

export function listOption(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function updateOption(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'PUT', data })
}

export function resetOptionValue(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/value`, { method: 'PATCH', params: query })
}
