import React, { useState, useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, Modal, message, Popconfirm, Form, Input, InputNumber, Select } from 'antd'
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { listSmsConfig, addSmsConfig, updateSmsConfig, deleteSmsConfig, setDefaultSmsConfig } from '@/services/system/smsConfig'

export default function SmsConfigPage() {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState('')

  const columns: ProColumns[] = [
    { title: '名称', dataIndex: 'name' },
    { title: '供应商', dataIndex: 'supplier', width: 100 },
    { title: '默认', dataIndex: 'isDefault', width: 80, render: (_, record) => record.isDefault ? <Tag color="green">是</Tag> : '-' },
    { title: '状态', dataIndex: 'status', width: 80, render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag> },
    {
      title: '操作', valueType: 'option', width: 250,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑短信配置'); setEditingId(record.id); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>,
        !record.isDefault && <Button key="default" type="link" size="small" icon={<CheckCircleOutlined />} onClick={async () => { await setDefaultSmsConfig(record.id); message.success('设置成功'); actionRef.current?.reload() }}>设为默认</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async () => { await deleteSmsConfig(record.id); message.success('删除成功'); actionRef.current?.reload() }}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <ProTable headerTitle="短信配置" actionRef={actionRef} rowKey="id" columns={columns}
      request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listSmsConfig({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
      pagination={{ defaultPageSize: 10 }} search={false}
      toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setModalTitle('新增短信配置'); setEditingId(''); form.resetFields(); setModalOpen(true) }}>新增</Button>]}
    >
      <Modal title={modalTitle} open={modalOpen} onOk={async () => { const v = await form.validateFields(); if (editingId) { await updateSmsConfig(v, editingId) } else { await addSmsConfig(v) } message.success(editingId ? '修改成功' : '新增成功'); setModalOpen(false); actionRef.current?.reload() }} onCancel={() => setModalOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="supplier" label="供应商" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="accessKey" label="AccessKey"><Input /></Form.Item>
          <Form.Item name="secretKey" label="SecretKey"><Input.Password /></Form.Item>
          <Form.Item name="signature" label="签名"><Input /></Form.Item>
          <Form.Item name="templateId" label="模板ID"><Input /></Form.Item>
        </Form>
      </Modal>
    </ProTable>
  )
}
