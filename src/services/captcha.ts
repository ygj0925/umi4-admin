import { request } from 'umi'

const API_PREFIX = '/sss-task'

export function getImageCaptcha() {
  return request<any>(`${API_PREFIX}/captcha/image`, { method: 'GET' })
}

export function getSmsCaptcha(phone: string, captchaVerification?: string) {
  return request<any>(`${API_PREFIX}/captcha/sms?phone=${phone}&captchaVerification=${encodeURIComponent(captchaVerification || '')}`, { method: 'GET' })
}

export function getEmailCaptcha(email: string, captchaVerification?: string) {
  return request<any>(`${API_PREFIX}/captcha/mail?email=${email}&captchaVerification=${encodeURIComponent(captchaVerification || '')}`, { method: 'GET' })
}

export function getBehaviorCaptcha(params: any) {
  return request<any>(`${API_PREFIX}/captcha/behavior`, { method: 'GET', params })
}

export function checkBehaviorCaptcha(data: any) {
  return request<any>(`${API_PREFIX}/captcha/behavior`, { method: 'POST', data })
}
