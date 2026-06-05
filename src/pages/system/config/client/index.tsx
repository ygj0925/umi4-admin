import React, { useRef, useState } from 'react'
import { ProTable, ModalForm, ProFormText, ProFormSelect, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { listClient, addClient, updateClient, deleteClient } from '@/services/system/client'

export default function ClientConfigPage() {
  const actionRef = useRef<ActionType>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState('')
  const [initialValues, setInitialValues] = useState<any>({})

  const columns: ProColumns[] = [
    { title: '客户端ID', dataIndex: 'clientId' },
    { title: '类型', dataIndex: 'clientType', width: 100 },
    { title: '认证方式', dataIndex: 'authType', width: 120 },
    { title: '状态', dataIndex: 'status', width: 80, render: (_, record) => <Tag color={record.status === '1' || record.status === 1 ? 'green' : 'red'}>{record.status === '1' || record.status === 1 ? '启用' : '禁用'}</Tag> },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 200,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑客户端'); setEditingId(record.id); setInitialValues(record); setModalOpen(true) }}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async () => { await deleteClient(record.id); message.success('删除成功'); actionRef.current?.reload() }}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <>
      <ProTable headerTitle="客户端配置" actionRef={actionRef} rowKey="id" columns={columns}
        request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listClient({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
        pagination={{ defaultPageSize: 10 }} search={false}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setModalTitle('新增客户端'); setEditingId(''); setInitialValues({}); setModalOpen(true) }}>新增</Button>]}
      />
      <ModalForm
        title={modalTitle}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onFinish={async (values: any) => {
          if (editingId) { await updateClient(values, editingId) } else { await addClient(values) }
          message.success(editingId ? '修改成功' : '新增成功')
          actionRef.current?.reload()
          return true
        }}
        width={600}
        initialValues={initialValues}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText name="clientId" label="客户端ID" rules={[{ required: true }]} />
        <ProFormSelect name="clientType" label="类型" rules={[{ required: true }]}
          options={[{ label: 'PC', value: 'pc' }, { label: 'Mobile', value: 'mobile' }]}
        />
        <ProFormSelect name="authType" label="认证方式" rules={[{ required: true }]}
          mode="multiple"
          options={[{ label: '账号密码', value: 'ACCOUNT' }, { label: '手机号', value: 'PHONE' }, { label: '邮箱', value: 'EMAIL' }]}
        />
        <ProFormText name="timeout" label="超时时间" />
        <ProFormText name="activeTimeout" label="活跃超时" />
      </ModalForm>
    </>
  )
}
