import { request } from 'umi'

const API_PREFIX = '/sss-task'
const BASE_URL = '/system/dept'

export function listDept(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/tree`, { method: 'GET', params: query })
}

export function getDept(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function addDept(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateDept(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteDept(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids: [id] } })
}

export function exportDept(query: any) {
  return request(`${API_PREFIX}${BASE_URL}/export`, { method: 'GET', params: query, responseType: 'blob' })
}

export function listDeptDictTree(query: { description: string }) {
  return request<any>(`${API_PREFIX}${BASE_URL}/dict/tree`, { method: 'GET', params: query })
}
