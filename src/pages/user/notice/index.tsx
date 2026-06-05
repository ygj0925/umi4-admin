import React, { useState, useEffect } from 'react'
import { Card, List, Tag, Button } from 'antd'
import { history, useSearchParams } from 'umi'
import { getUserNotice } from '@/services/system/userMessage'
import { sanitizeHtml } from '@/utils/sanitize'

export default function UserNoticePage() {
  const [searchParams] = useSearchParams()
  const noticeId = searchParams.get('id')

  if (noticeId) {
    return <NoticeDetail id={noticeId} />
  }

  return <div>请从消息中心查看公告</div>
}

function NoticeDetail({ id }: { id: string }) {
  const [detail, setDetail] = useState<any>(null)

  useEffect(() => {
    getUserNotice(Number(id)).then((res) => setDetail(res.data)).catch(() => {})
  }, [id])

  if (!detail) return <Card loading />

  return (
    <Card title={detail.title} extra={<Button onClick={() => history.back()}>返回</Button>}>
      <p style={{ color: 'var(--text-tertiary)', marginBottom: 16 }}>{detail.createTime}</p>
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(detail.content) }} />
    </Card>
  )
}
