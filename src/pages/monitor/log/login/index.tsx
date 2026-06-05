import React, { useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import { listLog, exportLoginLog } from '@/services/monitor/log'
import { useDownload } from '@/hooks/useDownload'

export default function LoginLogPage() {
  const actionRef = useRef<ActionType>()
  const { download } = useDownload()

  const columns: ProColumns[] = [
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: 'IP', dataIndex: 'ip', width: 140 },
    { title: '浏览器', dataIndex: 'browser', width: 100, search: false },
    { title: '操作系统', dataIndex: 'os', width: 120, search: false },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '成功' : '失败'}</Tag>,
      valueEnum: { 1: { text: '成功', status: 'Success' }, 2: { text: '失败', status: 'Error' } },
    },
    { title: '描述', dataIndex: 'description', ellipsis: true, search: false },
    { title: '登录时间', dataIndex: 'createTime', width: 160 },
  ]

  return (
    <ProTable headerTitle="登录日志" actionRef={actionRef} rowKey="id" columns={columns}
      request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listLog({ page: current, size: pageSize, type: 'LOGIN', ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
      pagination={{ defaultPageSize: 10 }} search={{ labelWidth: 'auto' }}
      toolBarRender={() => [<Button key="export" icon={<ExportOutlined />} onClick={() => download(() => exportLoginLog({}), '登录日志.xlsx')}>导出</Button>]}
    />
  )
}
