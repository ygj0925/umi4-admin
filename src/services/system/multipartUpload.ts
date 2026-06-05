import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'
const BASE_URL = '/system/file/multipart'

export function initMultipartUpload(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/init`, { method: 'POST', data })
}

export function uploadPart(uploadId: string, partNumber: number, file: Blob, path: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('uploadId', uploadId)
  formData.append('partNumber', String(partNumber))
  formData.append('path', path)
  return request<any>(`${API_PREFIX}${BASE_URL}/part`, { method: 'POST', data: formData })
}

export function completeMultipartUpload(data: any) {
  return request<any>(`${API_PREFIX}${BASE_URL}/complete`, { method: 'POST', data })
}

export function cancelMultipartUpload(uploadId: string) {
  return request<any>(`${API_PREFIX}${BASE_URL}/cancel`, { method: 'POST', data: { uploadId } })
}
