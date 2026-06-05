import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/task'

export function listTaskItems(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/items`, { method: 'GET', params: query })
}

export function getTaskItem(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/items/${id}`, { method: 'GET' })
}

export function createTaskItem(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/items`, { method: 'POST', data })
}

export function updateTaskItem(id: string, data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/items/${id}`, { method: 'PUT', data })
}

export function deleteTaskItem(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/items/${id}`, { method: 'DELETE' })
}

export function updateTaskProgress(id: string, data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/items/${id}/progress`, { method: 'PATCH', data })
}

export function authorizeTask(id: string, data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/items/${id}/authorize`, { method: 'POST', data })
}

export function getTaskStats() {
  return request<any>(`${API_PREFIX}${BASE_URL}/items/stats`, { method: 'GET' })
}

export function urgeTaskItem(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/items/${id}/urge`, { method: 'POST' })
}

export function listTaskOwners() {
  return request<any>(`${API_PREFIX}${BASE_URL}/items/owners`, { method: 'GET' })
}

export function uploadProgressAttachments(id: string, data: FormData) {
  return request<any>(`${API_PREFIX}${BASE_URL}/items/${id}/attachments`, { method: 'POST', data })
}

export function listTaskCategories(query?: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/categories`, { method: 'GET', params: query })
}

export function createTaskCategory(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/categories`, { method: 'POST', data })
}

export function updateTaskCategory(id: string, data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/categories/${id}`, { method: 'PUT', data })
}

export function deleteTaskCategory(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/categories/${id}`, { method: 'DELETE' })
}
