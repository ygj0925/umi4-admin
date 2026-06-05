import React, { useState, useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, Modal, message, Popconfirm, Form, Input, Select } from 'antd'
import { PlusOutlined, KeyOutlined, ReloadOutlined } from '@ant-design/icons'
import { listApp, addApp, updateApp, deleteApp, getAppSecret, resetAppSecret } from '@/services/open/app'

export default function AppPage() {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState('')
  const [secret, setSecret] = useState('')
  const [secretModal, setSecretModal] = useState(false)

  const columns: ProColumns[] = [
    { title: '应用名称', dataIndex: 'name' },
    { title: 'AppKey', dataIndex: 'appKey', width: 200 },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag>,
    },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 250,
      render: (_, record) => [
        <Button key="secret" type="link" size="small" icon={<KeyOutlined />} onClick={async () => { const res = await getAppSecret(record.id); setSecret(res.data); setSecretModal(true) }}>密钥</Button>,
        <Button key="reset" type="link" size="small" icon={<ReloadOutlined />} onClick={async () => { await resetAppSecret(record.id); message.success('重置成功') }}>重置密钥</Button>,
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑应用'); setEditingId(record.id); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async () => { await deleteApp(record.id); message.success('删除成功'); actionRef.current?.reload() }}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <>
      <ProTable headerTitle="开放接口" actionRef={actionRef} rowKey="id" columns={columns}
        request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listApp({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
        pagination={{ defaultPageSize: 10 }} search={false}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setModalTitle('新增应用'); setEditingId(''); form.resetFields(); setModalOpen(true) }}>新增</Button>]}
      >
        <Modal title={modalTitle} open={modalOpen} onOk={async () => { const v = await form.validateFields(); if (editingId) { await updateApp(v, editingId) } else { await addApp(v) } message.success(editingId ? '修改成功' : '新增成功'); setModalOpen(false); actionRef.current?.reload() }} onCancel={() => setModalOpen(false)}>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="应用名称" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="description" label="描述"><Input.TextArea rows={3} /></Form.Item>
          </Form>
        </Modal>
      </ProTable>
      <Modal title="应用密钥" open={secretModal} onCancel={() => setSecretModal(false)} footer={<Button onClick={() => setSecretModal(false)}>关闭</Button>}>
        <p>AppSecret: <strong>{secret}</strong></p>
      </Modal>
    </>
  )
}
