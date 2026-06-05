import { request } from 'umi'

const API_PREFIX = '/sss-task'
const BASE_URL = '/tenant/management'

export function listTenant(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function getTenant(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function addTenant(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateTenant(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteTenant(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'DELETE' })
}

export function updateTenantAdminUserPwd(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/admin/pwd`, { method: 'PUT', data })
}
