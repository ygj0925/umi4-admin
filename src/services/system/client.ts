import { request } from 'umi'

const API_PREFIX = '/sss-task'
const BASE_URL = '/system/client'

export function listClient(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function getClient(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function addClient(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateClient(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteClient(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids: [id] } })
}
