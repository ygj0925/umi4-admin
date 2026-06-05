import React, { useState, useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, Modal, message, Popconfirm, Form, Input, Select, InputNumber } from 'antd'
import { PlusOutlined, KeyOutlined } from '@ant-design/icons'
import { listTenant, addTenant, updateTenant, deleteTenant, updateTenantAdminUserPwd } from '@/services/tenant/management'
import { listTenantPackageDict } from '@/services/tenant/package'

export default function TenantManagementPage() {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const [pwdForm] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState('')
  const [pwdModal, setPwdModal] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [packageOptions, setPackageOptions] = useState<any[]>([])

  const loadPackages = async () => {
    const res = await listTenantPackageDict().catch(() => ({ data: [] }))
    setPackageOptions(res.data || [])
  }

  const columns: ProColumns[] = [
    { title: '租户名称', dataIndex: 'name' },
    { title: '租户编码', dataIndex: 'code', width: 120 },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag>,
    },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 250,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑租户'); setEditingId(record.id); form.setFieldsValue(record); setModalOpen(true) }}>编辑</Button>,
        <Button key="pwd" type="link" size="small" icon={<KeyOutlined />} onClick={() => { setCurrentId(record.id); pwdForm.resetFields(); setPwdModal(true) }}>修改密码</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async () => { await deleteTenant(record.id); message.success('删除成功'); actionRef.current?.reload() }}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <>
      <ProTable headerTitle="租户管理" actionRef={actionRef} rowKey="id" columns={columns}
        request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listTenant({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
        pagination={{ defaultPageSize: 10 }} search={false}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setModalTitle('新增租户'); setEditingId(''); form.resetFields(); loadPackages(); setModalOpen(true) }}>新增</Button>]}
      >
        <Modal title={modalTitle} open={modalOpen} onOk={async () => { const v = await form.validateFields(); if (editingId) { await updateTenant(v, editingId) } else { await addTenant(v) } message.success(editingId ? '修改成功' : '新增成功'); setModalOpen(false); actionRef.current?.reload() }} onCancel={() => setModalOpen(false)} width={600}>
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="租户名称" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="code" label="租户编码" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="packageId" label="租户套餐" rules={[{ required: true }]}><Select options={packageOptions} /></Form.Item>
            <Form.Item name="status" label="状态" initialValue={1}><Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 2 }]} /></Form.Item>
            <Form.Item name="description" label="描述"><Input.TextArea rows={3} /></Form.Item>
          </Form>
        </Modal>
      </ProTable>
      <Modal title="修改管理员密码" open={pwdModal} onOk={async () => { const v = await pwdForm.validateFields(); await updateTenantAdminUserPwd(v, currentId); message.success('修改成功'); setPwdModal(false) }} onCancel={() => setPwdModal(false)}>
        <Form form={pwdForm} layout="vertical">
          <Form.Item name="password" label="新密码" rules={[{ required: true }]}><Input.Password /></Form.Item>
        </Form>
      </Modal>
    </>
  )
}
