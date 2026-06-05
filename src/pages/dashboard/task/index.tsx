import React, { useState, useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Space, Tag, Modal, message, Popconfirm, Form, Input, Select, DatePicker, InputNumber } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { listTaskItems, createTaskItem, updateTaskItem, deleteTaskItem } from '@/services/task'
import { STATUS_MAP, STATUS_COLOR_MAP, PRIORITY_COLOR_MAP } from '@/constants/task'

export default function TaskPage() {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState('')

  const columns: ProColumns[] = [
    { title: '任务名称', dataIndex: 'title', ellipsis: true },
    { title: '状态', dataIndex: 'status', width: 100,
      render: (_, record) => <Tag color={STATUS_COLOR_MAP[record.status as keyof typeof STATUS_COLOR_MAP] || 'default'}>{STATUS_MAP[record.status as keyof typeof STATUS_MAP] || record.status}</Tag>,
      valueEnum: Object.fromEntries(Object.entries(STATUS_MAP).map(([k, v]) => [k, { text: v }])),
    },
    { title: '优先级', dataIndex: 'priority', width: 80,
      render: (_, record) => <Tag color={PRIORITY_COLOR_MAP[record.priority as keyof typeof PRIORITY_COLOR_MAP] || 'default'}>{record.priority}</Tag>,
    },
    { title: '负责人', dataIndex: 'ownerName', width: 100 },
    { title: '截止日期', dataIndex: 'deadline', width: 120 },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 200,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑任务'); setEditingId(record.id); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async () => { await deleteTaskItem(record.id); message.success('删除成功'); actionRef.current?.reload() }}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <ProTable headerTitle="任务管理" actionRef={actionRef} rowKey="id" columns={columns}
      request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listTaskItems({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
      pagination={{ defaultPageSize: 10 }} search={{ labelWidth: 'auto' }}
      toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setModalTitle('新增任务'); setEditingId(''); form.resetFields(); setModalOpen(true) }}>新增任务</Button>]}
    >
      <Modal title={modalTitle} open={modalOpen} onOk={async () => { const v = await form.validateFields(); if (editingId) { await updateTaskItem(editingId, v) } else { await createTaskItem(v) } message.success(editingId ? '修改成功' : '新增成功'); setModalOpen(false); actionRef.current?.reload() }} onCancel={() => setModalOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="任务名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="status" label="状态" initialValue="pending">
            <Select options={Object.entries(STATUS_MAP).map(([k, v]) => ({ label: v, value: k }))} />
          </Form.Item>
          <Form.Item name="priority" label="优先级" initialValue="P2">
            <Select options={[{ label: 'P0', value: 'P0' }, { label: 'P1', value: 'P1' }, { label: 'P2', value: 'P2' }, { label: 'P3', value: 'P3' }]} />
          </Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </ProTable>
  )
}
