import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/system/menu'

export function listMenu(query?: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/tree`, { method: 'GET', params: query })
}

export function getMenu(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function addMenu(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateMenu(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteMenu(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids: [id] } })
}

export function clearMenuCache() {
  return request<any>(`${API_PREFIX}${BASE_URL}/cache`, { method: 'DELETE' })
}

export function listMenuDictTree(query: { description: string }) {
  return request<any>(`${API_PREFIX}${BASE_URL}/dict/tree`, { method: 'GET', params: query })
}
