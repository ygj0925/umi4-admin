import { useCallback } from 'react'
import { message } from 'antd'

export function useDownload() {
  const download = useCallback(async (apiFn: () => Promise<any>, fileName: string) => {
    try {
      const res = await apiFn()
      const blob = new Blob([res.data || res])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      message.error('下载失败')
    }
  }, [])

  return { download }
}
