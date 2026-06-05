import { request } from 'umi'

const API_PREFIX = '/sss-task'
const BASE_URL = '/system/dict'

export function listDict(query?: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/list`, { method: 'GET', params: query })
}

export function getDict(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function addDict(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateDict(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteDict(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids: [id] } })
}

export function clearDictCache(code: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/cache/${code}`, { method: 'DELETE' })
}

export function listDictItem(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/item`, { method: 'GET', params: query })
}

export function getDictItem(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/item/${id}`, { method: 'GET' })
}

export function addDictItem(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/item`, { method: 'POST', data })
}

export function updateDictItem(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/item/${id}`, { method: 'PUT', data })
}

export function deleteDictItem(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/item`, { method: 'DELETE', data: { ids: [id] } })
}
