import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/system/storage'

export function listStorage(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/list`, { method: 'GET', params: query })
}

export function getStorage(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function addStorage(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateStorage(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteStorage(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids: [id] } })
}

export function updateStorageStatus(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/status`, { method: 'PUT', data })
}

export function setDefaultStorage(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/default`, { method: 'PUT' })
}
