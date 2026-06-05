import { request } from 'umi'

const API_PREFIX = '/sss-task'

export interface UserInfo {
  id: string
  username: string
  nickname: string
  gender: 0 | 1 | 2
  email: string
  phone: string
  avatar: string
  pwdResetTime: string
  pwdExpired: boolean
  registrationDate: string
  deptName: string
  roles: string[]
  roleNames: string[]
  permissions: string[]
}

export interface RouteItem {
  id: string
  title: string
  parentId: string
  type: 1 | 2 | 3
  path: string
  name: string
  component: string
  redirect: string
  icon: string
  isExternal: boolean
  isHidden: boolean
  isCache: boolean
  permission: string
  roles: string[]
  sort: number
  status: 0 | 1
  children: RouteItem[]
  activeMenu: string
  alwaysShow: boolean
  breadcrumb: boolean
  showInTabs: boolean
  affix: boolean
}

export interface AccountLoginReq {
  username: string
  password: string
  captcha: string
  uuid: string
  clientId?: string
  authType?: string
}

export interface PhoneLoginReq {
  phone: string
  captcha: string
  clientId?: string
  authType?: string
}

export interface EmailLoginReq {
  email: string
  captcha: string
  clientId?: string
  authType?: string
}

export interface LoginResp {
  token: string
  tenantId: string
}

export function accountLogin(data: AccountLoginReq, tenantCode?: string) {
  return request<any>(`${API_PREFIX}/auth/login`, {
    method: 'POST',
    data,
    headers: tenantCode ? { 'X-Tenant-Code': tenantCode } : {},
  })
}

export function emailLogin(data: EmailLoginReq, tenantCode?: string) {
  return request<any>(`${API_PREFIX}/auth/login`, {
    method: 'POST',
    data: { ...data, authType: 'EMAIL' },
    headers: tenantCode ? { 'X-Tenant-Code': tenantCode } : {},
  })
}

export function phoneLogin(data: PhoneLoginReq, tenantCode?: string) {
  return request<any>(`${API_PREFIX}/auth/login`, {
    method: 'POST',
    data: { ...data, authType: 'PHONE' },
    headers: tenantCode ? { 'X-Tenant-Code': tenantCode } : {},
  })
}

export function socialLogin(data: any) {
  return request<any>(`${API_PREFIX}/auth/login`, { method: 'POST', data })
}

export function socialAuth(source: string) {
  return request<any>(`${API_PREFIX}/auth/${source}`, { method: 'GET' })
}

export function logout() {
  return request<any>(`${API_PREFIX}/auth/logout`, { method: 'POST' })
}

export function getUserInfo() {
  return request<any>(`${API_PREFIX}/auth/user/info`, { method: 'GET' })
}

export function getUserRoute() {
  return request<any>(`${API_PREFIX}/auth/user/route`, { method: 'GET' })
}
