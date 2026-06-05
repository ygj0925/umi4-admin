import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/system/sms/config'

export function listSmsConfig(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function getSmsConfig(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function addSmsConfig(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateSmsConfig(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteSmsConfig(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids: [id] } })
}

export function setDefaultSmsConfig(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/default`, { method: 'PUT' })
}
