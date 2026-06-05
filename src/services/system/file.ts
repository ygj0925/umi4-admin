import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/system/file'

export function uploadFile(data: FormData) {
  return request<any>(`${API_PREFIX}${BASE_URL}/upload`, { method: 'POST', data })
}

export function listFile(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function updateFile(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteFile(ids: string[]) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids } })
}

export function getFileStatistics() {
  return request<any>(`${API_PREFIX}${BASE_URL}/statistics`, { method: 'GET' })
}

export function checkFile(sha256: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/check`, { method: 'GET', params: { fileHash: sha256 } })
}

export function createDir(parentPath: string, name: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/dir`, { method: 'POST', data: { parentPath, originalName: name } })
}

export function calcDirSize(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/dir/${id}/size`, { method: 'GET' })
}

export function listRecycleFiles(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/recycle`, { method: 'GET', params: query })
}

export function restoreRecycleFile(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/recycle/restore/${id}`, { method: 'PUT' })
}

export function deleteRecycleFile(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/recycle/${id}`, { method: 'DELETE' })
}

export function cleanRecycleBin() {
  return request<any>(`${API_PREFIX}${BASE_URL}/recycle/clean`, { method: 'DELETE' })
}
