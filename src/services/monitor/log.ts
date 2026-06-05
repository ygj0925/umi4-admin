import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/system/log'

export function listLog(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function getLog(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function exportLoginLog(query: any) {
  return request(`${API_PREFIX}${BASE_URL}/export/login`, { method: 'GET', params: query, responseType: 'blob' })
}

export function exportOperationLog(query: any) {
  return request(`${API_PREFIX}${BASE_URL}/export/operation`, { method: 'GET', params: query, responseType: 'blob' })
}
