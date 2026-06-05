import React, { useState, useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Modal, message, Popconfirm, Form, Input, InputNumber } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { listTaskCategories, createTaskCategory, updateTaskCategory, deleteTaskCategory } from '@/services/task'

export default function CategoryPage() {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState('')

  const columns: ProColumns[] = [
    { title: '分类名称', dataIndex: 'name' },
    { title: '排序', dataIndex: 'sort', width: 80 },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 200,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑分类'); setEditingId(record.id); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async () => { await deleteTaskCategory(record.id); message.success('删除成功'); actionRef.current?.reload() }}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <ProTable headerTitle="任务分类" actionRef={actionRef} rowKey="id" columns={columns}
      request={async () => { const res = await listTaskCategories(); return { data: res.data || [], success: true } }}
      pagination={false} search={false}
      toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setModalTitle('新增分类'); setEditingId(''); form.resetFields(); setModalOpen(true) }}>新增分类</Button>]}
    >
      <Modal title={modalTitle} open={modalOpen} onOk={async () => { const v = await form.validateFields(); if (editingId) { await updateTaskCategory(editingId, v) } else { await createTaskCategory(v) } message.success(editingId ? '修改成功' : '新增成功'); setModalOpen(false); actionRef.current?.reload() }} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="分类名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="sort" label="排序" initialValue={1}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="description" label="描述"><Input /></Form.Item>
        </Form>
      </Modal>
    </ProTable>
  )
}
