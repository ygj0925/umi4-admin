import React, { useState, useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, Modal, message, Popconfirm, Form, Input, InputNumber, Select, Switch } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { listStorage, addStorage, updateStorage, deleteStorage, setDefaultStorage } from '@/services/system/storage'

export default function StorageConfigPage() {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState('')

  const columns: ProColumns[] = [
    { title: '名称', dataIndex: 'name' },
    { title: '编码', dataIndex: 'code' },
    { title: '类型', dataIndex: 'type', width: 100, valueEnum: { 1: '本地', 2: 'OSS', 3: 'S3' } },
    { title: '默认', dataIndex: 'isDefault', width: 80, render: (_, record) => record.isDefault ? <Tag color="green">是</Tag> : '-' },
    { title: '状态', dataIndex: 'status', width: 80, render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag> },
    {
      title: '操作', valueType: 'option', width: 250,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>,
        !record.isDefault && <Button key="default" type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleSetDefault(record.id)}>设为默认</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  const handleAdd = () => { setModalTitle('新增存储'); setEditingId(''); form.resetFields(); setModalOpen(true) }
  const handleEdit = (record: any) => { setModalTitle('编辑存储'); setEditingId(record.id); form.setFieldsValue(record); setModalOpen(true) }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editingId) { await updateStorage(values, editingId); message.success('修改成功') }
    else { await addStorage(values); message.success('新增成功') }
    setModalOpen(false); actionRef.current?.reload()
  }

  const handleDelete = async (id: string) => { await deleteStorage(id); message.success('删除成功'); actionRef.current?.reload() }
  const handleSetDefault = async (id: string) => { await setDefaultStorage(id); message.success('设置成功'); actionRef.current?.reload() }

  return (
    <ProTable headerTitle="存储配置" actionRef={actionRef} rowKey="id" columns={columns}
      request={async () => { const res = await listStorage({}); return { data: res.data || [], success: true } }}
      pagination={false} search={false}
      toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增存储</Button>]}
    >
      <Modal title={modalTitle} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="code" label="编码" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select options={[{ label: '本地', value: 1 }, { label: 'OSS', value: 2 }, { label: 'S3', value: 3 }]} />
          </Form.Item>
          <Form.Item name="endpoint" label="端点"><Input /></Form.Item>
          <Form.Item name="bucketName" label="桶名"><Input /></Form.Item>
          <Form.Item name="accessKey" label="AccessKey"><Input /></Form.Item>
          <Form.Item name="secretKey" label="SecretKey"><Input.Password /></Form.Item>
          <Form.Item name="domain" label="域名"><Input /></Form.Item>
        </Form>
      </Modal>
    </ProTable>
  )
}
