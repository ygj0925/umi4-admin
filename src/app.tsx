import './tailwind.css'
import { history, RequestConfig } from 'umi'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/stores/useUserStore'
import { useTenantStore } from '@/stores/useTenantStore'
import { message, Modal } from 'antd'

export const request: RequestConfig = {
  timeout: 30000,
  requestInterceptors: [
    (config: any) => {
      const token = getToken()
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      }
      const tenantStore = useTenantStore.getState()
      if (tenantStore.tenantEnabled && tenantStore.tenantId) {
        config.headers = {
          ...config.headers,
          'X-Tenant-Id': tenantStore.tenantId,
        }
      }
      return config
    },
  ],
  responseInterceptors: [
    (response: any) => {
      return response
    },
  ],
  errorConfig: {
    errorHandler: (error: any) => {
      const { response } = error
      if (!response) {
        message.error('网络连接失败，请检查您的网络')
        return
      }
      const status = response.status
      const statusMessages: Record<number, string> = {
        400: '请求错误(400)',
        401: '未授权，请重新登录(401)',
        403: '拒绝访问(403)',
        404: '请求出错(404)',
        408: '请求超时(408)',
        500: '服务器错误(500)',
        502: '网络错误(502)',
        503: '服务不可用(503)',
        504: '网络超时(504)',
      }
      message.error(statusMessages[status] || '服务器暂时未响应')
    },
  },
}

export async function getInitialState() {
  const token = getToken()
  if (token) {
    try {
      const userInfo = await useUserStore.getState().getInfo()
      return { userInfo }
    } catch {
      return { userInfo: null }
    }
  }
  return { userInfo: null }
}

export function onRouteChange({ location }: { location: any }) {
  const token = getToken()
  const whiteList = ['/login', '/social/callback', '/pwdExpired', '/corp-select']
  if (!token && !whiteList.includes(location.pathname)) {
    history.push('/login')
  }
}
