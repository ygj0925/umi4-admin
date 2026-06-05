import { request } from 'umi'

const API_PREFIX = '/sss-task'
const BASE_URL = '/open/app'

export function listApp(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function getApp(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function addApp(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateApp(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteApp(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids: [id] } })
}

export function exportApp(query: any) {
  return request(`${API_PREFIX}${BASE_URL}/export`, { method: 'GET', params: query, responseType: 'blob' })
}

export function getAppSecret(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/secret`, { method: 'GET' })
}

export function resetAppSecret(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/secret`, { method: 'PATCH' })
}
