import { request } from 'umi'

const API_PREFIX = '/sss-task'

export function listDashboardNotice() {
  return request<any>(`${API_PREFIX}/dashboard/notice`, { method: 'GET' })
}

export function getDashboardOverviewPv() {
  return request<any>(`${API_PREFIX}/dashboard/analysis/overview/pv`, { method: 'GET' })
}

export function getDashboardOverviewIp() {
  return request<any>(`${API_PREFIX}/dashboard/analysis/overview/ip`, { method: 'GET' })
}

export function getAnalysisGeo() {
  return request<any>(`${API_PREFIX}/dashboard/analysis/geo`, { method: 'GET' })
}

export function getDashboardAccessTrend(days: number) {
  return request<any>(`${API_PREFIX}/dashboard/access/trend/${days}`, { method: 'GET' })
}

export function getAnalysisTimeslot() {
  return request<any>(`${API_PREFIX}/dashboard/analysis/timeslot`, { method: 'GET' })
}

export function getAnalysisModule() {
  return request<any>(`${API_PREFIX}/dashboard/analysis/module`, { method: 'GET' })
}

export function getAnalysisOs() {
  return request<any>(`${API_PREFIX}/dashboard/analysis/os`, { method: 'GET' })
}

export function getAnalysisBrowser() {
  return request<any>(`${API_PREFIX}/dashboard/analysis/browser`, { method: 'GET' })
}
