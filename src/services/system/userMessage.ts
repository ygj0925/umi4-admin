import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/user/message'

export function getUnreadMessageCount() {
  return request<any>(`${API_PREFIX}${BASE_URL}/unread`, { method: 'GET' })
}

export function listMessage(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'GET', params: query })
}

export function getUserMessage(id: number) {
  return request<any>(`${API_PREFIX}${BASE_URL}/${id}`, { method: 'GET' })
}

export function deleteMessage(ids: string[]) {
  return request<any>(`${API_PREFIX}${BASE_URL}`, { method: 'DELETE', data: { ids } })
}

export function readMessage(ids: string[]) {
  return request<any>(`${API_PREFIX}${BASE_URL}/read`, { method: 'PATCH', data: { ids } })
}

export function readAllMessage() {
  return request<any>(`${API_PREFIX}${BASE_URL}/readAll`, { method: 'PATCH' })
}

export function getUnreadNoticeCount() {
  return request<any>(`${API_PREFIX}${BASE_URL}/notice/unread`, { method: 'GET' })
}

export function getUnreadNoticeIds(method: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/notice/unread/${method}`, { method: 'GET' })
}

export function listUserNotice(query: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/notice`, { method: 'GET', params: query })
}

export function getUserNotice(id: number) {
  return request<any>(`${API_PREFIX}${BASE_URL}/notice/${id}`, { method: 'GET' })
}
