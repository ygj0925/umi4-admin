import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/system/user'

export function listUser(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function listAllUser(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/list`, { method: 'GET', params: query })
}

export function getUser(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function addUser(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateUser(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteUser(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids: [id] } })
}

export function exportUser(query: any) {
  return request(`${API_PREFIX}${BASE_URL}/export`, { method: 'GET', params: query, responseType: 'blob' })
}

export function downloadUserImportTemplate() {
  return request(`${API_PREFIX}${BASE_URL}/import/template`, { method: 'GET', responseType: 'blob' })
}

export function parseImportUser(data: FormData) {
  return request<any>(`${API_PREFIX}${BASE_URL}/import/parse`, { method: 'POST', data })
}

export function importUser(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/import`, { method: 'POST', data })
}

export function resetUserPwd(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/password`, { method: 'PATCH', data })
}

export function updateUserRole(data: { roleIds: string[] }, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/role`, { method: 'PATCH', data })
}

export function listUserDict(query?: { status: number }) {
  return request<any>(`${API_PREFIX}${BASE_URL}/dict`, { method: 'GET', params: query })
}
