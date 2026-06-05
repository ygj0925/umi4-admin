import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/tenant/package'

export function listTenantPackage(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function getTenantPackage(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function addTenantPackage(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'POST', data })
}

export function updateTenantPackage(data: any, id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'PUT', data })
}

export function deleteTenantPackage(id: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'DELETE' })
}

export function listTenantPackageDict(query?: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/dict`, { method: 'GET', params: query })
}

export function listTenantPackageMenu() {
  return request<any>(`${API_PREFIX}${BASE_URL}/menu/tree`, { method: 'GET' })
}
