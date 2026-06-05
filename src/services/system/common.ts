import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/system/common'

export function listCommonDict(code: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/dict/${code}`, { method: 'GET' })
}

export function listSiteOptionDict() {
  return request<any>(`${API_PREFIX}${BASE_URL}/dict/option/site`, { method: 'GET' })
}

export function upload(data: FormData) {
  return request<any>(`${API_PREFIX}${BASE_URL}/file`, { method: 'POST', data })
}

export function getTenantStatus() {
  return request<any>(`${API_PREFIX}${BASE_URL}/dict/option/tenant`, { method: 'GET' })
}
