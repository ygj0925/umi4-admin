import React, { useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag } from 'antd'
import { listJobLog } from '@/services/schedule/log'

export default function JobLogPage() {
  const actionRef = useRef<ActionType>()

  const columns: ProColumns[] = [
    { title: '任务名称', dataIndex: 'jobName', ellipsis: true },
    { title: '任务分组', dataIndex: 'jobGroup', width: 100 },
    { title: '调用目标', dataIndex: 'invokeTarget', ellipsis: true, search: false },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '成功' : '失败'}</Tag>,
    },
    { title: '执行时间', dataIndex: 'createTime', width: 160 },
  ]

  return (
    <ProTable headerTitle="任务日志" actionRef={actionRef} rowKey="id" columns={columns}
      request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listJobLog({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
      pagination={{ defaultPageSize: 10 }} search={false}
    />
  )
}
