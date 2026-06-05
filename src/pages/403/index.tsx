import React from 'react'
import { Button, Result } from 'antd'
import { history } from 'umi'

export default function ForbiddenPage() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您无权访问该页面"
      extra={<Button type="primary" onClick={() => history.push('/')}>返回首页</Button>}
    />
  )
}
