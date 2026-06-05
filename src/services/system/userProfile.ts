import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/user/profile'

export function uploadAvatar(data: FormData) {
  return request<any>(`${API_PREFIX}${BASE_URL}/avatar`, { method: 'PATCH', data })
}

export function updateUserBaseInfo(data: { nickname: string, gender: number }) {
  return request<any>(`${API_PREFIX}${BASE_URL}/basic/info`, { method: 'PATCH', data })
}

export function updateUserPassword(data: { oldPassword: string, newPassword: string }) {
  return request<any>(`${API_PREFIX}${BASE_URL}/password`, { method: 'PATCH', data })
}

export function updateUserPhone(data: { phone: string, captcha: string, oldPassword: string }) {
  return request<any>(`${API_PREFIX}${BASE_URL}/phone`, { method: 'PATCH', data })
}

export function updateUserEmail(data: { email: string, captcha: string, oldPassword: string }) {
  return request<any>(`${API_PREFIX}${BASE_URL}/email`, { method: 'PATCH', data })
}

export function listUserSocial() {
  return request<any>(`${API_PREFIX}${BASE_URL}/social`, { method: 'GET' })
}

export function bindSocialAccount(source: string, data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/social/${source}`, { method: 'POST', data })
}

export function unbindSocialAccount(source: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/social/${source}`, { method: 'DELETE' })
}
