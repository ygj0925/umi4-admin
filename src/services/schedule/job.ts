import { request } from 'umi'

const API_PREFIX = '/sss-task'
const BASE_URL = '/schedule/job'

export function listGroup() {
  return request<any>(`${API_PREFIX}${BASE_URL}/group`, { method: 'GET' })
}

export function listJob(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function addJob(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateJob(data: any, id: number) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function updateJobStatus(data: any, id: number) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}/status`, { method: 'PATCH', data })
}

export function deleteJob(id: number) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'DELETE' })
}

export function triggerJob(id: number) {
  return request<any>(`${API_PREFIX}${BASE_URL}/trigger/${id}`, { method: 'POST' })
}
