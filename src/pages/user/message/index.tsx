import React, { useState, useRef } from 'react'
import { Card } from 'antd'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, message, Popconfirm, Badge, Tabs } from 'antd'
import { DeleteOutlined, CheckOutlined, BellOutlined, MailOutlined } from '@ant-design/icons'
import { listMessage, deleteMessage, readMessage, readAllMessage, listUserNotice } from '@/services/system/userMessage'

export default function UserMessagePage() {
  const msgActionRef = useRef<ActionType>()
  const noticeActionRef = useRef<ActionType>()

  const msgColumns: ProColumns[] = [
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '类型', dataIndex: 'type', width: 100, valueEnum: { 1: '系统消息', 2: '个人消息' } },
    { title: '状态', dataIndex: 'isRead', width: 80,
      render: (_, record) => record.isRead ? <Tag>已读</Tag> : <Badge status="processing" text="未读" />,
    },
    { title: '时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 200,
      render: (_, record) => [
        !record.isRead && <Button key="read" type="link" size="small" icon={<CheckOutlined />} onClick={async () => { await readMessage([record.id]); msgActionRef.current?.reload() }}>标记已读</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async () => { await deleteMessage([record.id]); message.success('删除成功'); msgActionRef.current?.reload() }}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  const noticeColumns: ProColumns[] = [
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '类型', dataIndex: 'type', width: 100, valueEnum: { '1': '通知', '2': '公告' } },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (_, record) => <Tag color={record.status === 2 ? 'green' : 'default'}>{record.status === 2 ? '已发布' : '草稿'}</Tag>,
    },
    { title: '时间', dataIndex: 'createTime', width: 160 },
  ]

  return (
    <Card title="消息中心" extra={<Button icon={<CheckOutlined />} onClick={async () => { await readAllMessage(); message.success('全部已读'); msgActionRef.current?.reload() }}>全部已读</Button>}>
      <Tabs items={[
        { key: 'message', label: <span><MailOutlined /> 我的消息</span>,
          children: <ProTable actionRef={msgActionRef} rowKey="id" columns={msgColumns}
            request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listMessage({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
            pagination={{ defaultPageSize: 10 }} search={false} options={false} />
        },
        { key: 'notice', label: <span><BellOutlined /> 公告通知</span>,
          children: <ProTable actionRef={noticeActionRef} rowKey="id" columns={noticeColumns}
            request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listUserNotice({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
            pagination={{ defaultPageSize: 10 }} search={false} options={false} />
        },
      ]} />
    </Card>
  )
}
