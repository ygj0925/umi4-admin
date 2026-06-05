import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/code/generator'

export function listGenConfig(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/config`, { method: 'GET', params: query })
}

export function getGenConfig(tableName: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/config/${tableName}`, { method: 'GET' })
}

export function listFieldConfig(tableName: string, requireSync: boolean) {
  return request<any>(`${API_PREFIX}${BASE_URL}/field/${tableName}?requireSync=${requireSync}`, { method: 'GET' })
}

export function saveGenConfig(tableName: string, data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/config/${tableName}`, { method: 'POST', data })
}

export function genPreview(tableNames: string[]) {
  return request<any>(`${API_PREFIX}${BASE_URL}/preview/${tableNames}`, { method: 'GET' })
}

export function downloadCode(tableNames: string[]) {
  return request(`${API_PREFIX}${BASE_URL}/${tableNames}/download`, { method: 'POST', responseType: 'blob' })
}

export function generateCode(tableNames: string[]) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${tableNames}`, { method: 'POST' })
}

export function listFieldConfigDict() {
  return request<any>(`${API_PREFIX}${BASE_URL}/dict`, { method: 'GET' })
}
