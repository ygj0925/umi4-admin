import { request } from 'umi'

const API_PREFIX = '/sss-task'
const BASE_URL = '/monitor/online'

export function listOnlineUser(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function kickout(token: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${token}`, { method: 'DELETE' })
}
