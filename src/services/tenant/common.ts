import { request } from 'umi'

import { API_PREFIX } from '@/constants/api'

export function getTenantByDomain(domain: string) {
  return request<any>(`${API_PREFIX}/tenant/common/domain`, { method: 'GET', params: { domain } })
}
