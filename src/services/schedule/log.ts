import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/schedule/log'

export function listJobLog(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function getJobLogDetail(id: number) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function stopJob(id: number) {
  return request<any>(`${API_PREFIX}${BASE_URL}/stop/${id}`, { method: 'POST' })
}

export function retryJob(id: number) {
  return request<any>(`${API_PREFIX}${BASE_URL}/retry/${id}`, { method: 'POST' })
}
