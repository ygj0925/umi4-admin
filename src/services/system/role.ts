import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/system/role'

export function listRole(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/list`, { method: 'GET', params: query })
}

export function getRole(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function addRole(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateRole(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteRole(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids: [id] } })
}

export function listRolePermissionTree() {
  return request<any>(`${API_PREFIX}${BASE_URL}/permission/tree`, { method: 'GET' })
}

export function updateRolePermission(id: string, data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/permission`, { method: 'PUT', data })
}

export function listRoleUser(id: string, query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/user`, { method: 'GET', params: query })
}

export function assignToUsers(id: string, userIds: string[]) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/user`, { method: 'POST', data: userIds })
}

export function unassignFromUsers(userRoleIds: (string | number)[]) {
  return request<any>(`${API_PREFIX}${BASE_URL}/user`, { method: 'DELETE', data: userRoleIds })
}

export function listRoleUserId(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/user/id`, { method: 'GET' })
}

export function listRoleDict(query?: { name: string, status: number }) {
  return request<any>(`${API_PREFIX}${BASE_URL}/dict`, { method: 'GET', params: query })
}
