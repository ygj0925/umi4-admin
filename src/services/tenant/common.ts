import { request } from 'umi'

const API_PREFIX = '/sss-task'

export function getTenantByDomain(domain: string) {
  return request<any>(`${API_PREFIX}/tenant/common/domain`, { method: 'GET', params: { domain } })
}
