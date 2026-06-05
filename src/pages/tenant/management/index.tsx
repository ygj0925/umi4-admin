import React, { useRef, useState } from 'react'
import { ProTable, ModalForm, ProFormText, ProFormTextArea, ProFormSelect, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, KeyOutlined } from '@ant-design/icons'
import { listTenant, addTenant, updateTenant, deleteTenant, updateTenantAdminUserPwd } from '@/services/tenant/management'
import { listTenantPackageDict } from '@/services/tenant/package'

export default function TenantManagementPage() {
  const actionRef = useRef<ActionType>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState('')
  const [initialValues, setInitialValues] = useState<any>({})
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
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑租户'); setEditingId(record.id); setInitialValues(record); loadPackages(); setModalOpen(true) }}>编辑</Button>,
        <Button key="pwd" type="link" size="small" icon={<KeyOutlined />} onClick={() => { setCurrentId(record.id); setPwdModal(true) }}>修改密码</Button>,
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
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setModalTitle('新增租户'); setEditingId(''); setInitialValues({ status: 1 }); loadPackages(); setModalOpen(true) }}>新增</Button>]}
      />
      <ModalForm
        title={modalTitle}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onFinish={async (values: any) => {
          if (editingId) { await updateTenant(values, editingId) } else { await addTenant(values) }
          message.success(editingId ? '修改成功' : '新增成功')
          actionRef.current?.reload()
          return true
        }}
        width={600}
        initialValues={initialValues}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText name="name" label="租户名称" rules={[{ required: true }]} />
        <ProFormText name="code" label="租户编码" rules={[{ required: true }]} />
        <ProFormSelect name="packageId" label="租户套餐" rules={[{ required: true }]}
          options={packageOptions}
        />
        <ProFormSelect name="status" label="状态" initialValue={1}
          options={[{ label: '启用', value: 1 }, { label: '禁用', value: 2 }]}
        />
        <ProFormTextArea name="description" label="描述" fieldProps={{ rows: 3 }} />
      </ModalForm>
      <ModalForm
        title="修改管理员密码"
        open={pwdModal}
        onOpenChange={setPwdModal}
        onFinish={async (values: any) => {
          await updateTenantAdminUserPwd(values, currentId)
          message.success('修改成功')
          return true
        }}
      >
        <ProFormText.Password name="password" label="新密码" rules={[{ required: true }]} />
      </ModalForm>
    </>
  )
}
