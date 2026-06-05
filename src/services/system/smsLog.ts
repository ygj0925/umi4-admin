import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/system/sms/log'

export function listSmsLog(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function getSmsLog(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function deleteSmsLog(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids: [id] } })
}

export function exportSmsLog(query: any) {
  return request(`${API_PREFIX}${BASE_URL}/export`, { method: 'GET', params: query, responseType: 'blob' })
}
