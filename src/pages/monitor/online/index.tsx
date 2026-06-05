import React, { useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Popconfirm, message } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { listOnlineUser, kickout } from '@/services/monitor/online'

export default function OnlineUserPage() {
  const actionRef = useRef<ActionType>()

  const columns: ProColumns[] = [
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: '昵称', dataIndex: 'nickname', width: 120 },
    { title: 'IP', dataIndex: 'ip', width: 140 },
    { title: '浏览器', dataIndex: 'browser', width: 100, search: false },
    { title: '操作系统', dataIndex: 'os', width: 120, search: false },
    { title: '登录时间', dataIndex: 'loginTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 100,
      render: (_, record) => [
        <Popconfirm key="kick" title="确认强退？" onConfirm={async () => { await kickout(record.token); message.success('强退成功'); actionRef.current?.reload() }}>
          <Button type="link" size="small" danger icon={<LogoutOutlined />}>强退</Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <ProTable headerTitle="在线用户" actionRef={actionRef} rowKey="token" columns={columns}
      request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listOnlineUser({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
      pagination={{ defaultPageSize: 10 }} search={{ labelWidth: 'auto' }}
    />
  )
}
