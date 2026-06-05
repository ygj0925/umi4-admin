import React, { useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, Popconfirm, message } from 'antd'
import { ExportOutlined, DeleteOutlined } from '@ant-design/icons'
import { listSmsLog, deleteSmsLog, exportSmsLog } from '@/services/system/smsLog'
import { useDownload } from '@/hooks/useDownload'

export default function SmsLogPage() {
  const actionRef = useRef<ActionType>()
  const { download } = useDownload()

  const columns: ProColumns[] = [
    { title: '手机号', dataIndex: 'phone', width: 120 },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '成功' : '失败'}</Tag>,
    },
    { title: '响应消息', dataIndex: 'resMsg', ellipsis: true, search: false },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 100,
      render: (_, record) => [
        <Popconfirm key="del" title="确认删除？" onConfirm={async () => { await deleteSmsLog(record.id); message.success('删除成功'); actionRef.current?.reload() }}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <ProTable headerTitle="短信日志" actionRef={actionRef} rowKey="id" columns={columns}
      request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listSmsLog({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
      pagination={{ defaultPageSize: 10 }} search={{ labelWidth: 'auto' }}
      toolBarRender={() => [<Button key="export" icon={<ExportOutlined />} onClick={() => download(() => exportSmsLog({}), '短信日志.xlsx')}>导出</Button>]}
    />
  )
}
