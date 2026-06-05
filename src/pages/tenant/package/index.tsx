import React, { useRef, useState } from 'react'
import { ProTable, ModalForm, ProFormText, ProFormTextArea, ProFormDigit, ProFormSelect, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { listTenantPackage, addTenantPackage, updateTenantPackage, deleteTenantPackage } from '@/services/tenant/package'

export default function TenantPackagePage() {
  const actionRef = useRef<ActionType>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState('')
  const [initialValues, setInitialValues] = useState<any>({})

  const columns: ProColumns[] = [
    { title: '套餐名称', dataIndex: 'name' },
    { title: '排序', dataIndex: 'sort', width: 80, search: false },
    { title: '状态', dataIndex: 'status', width: 80, search: false,
      render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag>,
    },
    { title: '描述', dataIndex: 'description', ellipsis: true, search: false },
    { title: '创建时间', dataIndex: 'createTime', width: 160, search: false },
    {
      title: '操作', valueType: 'option', width: 200,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑套餐'); setEditingId(record.id); setInitialValues(record); setModalOpen(true) }}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async () => { await deleteTenantPackage(record.id); message.success('删除成功'); actionRef.current?.reload() }}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <>
      <ProTable headerTitle="租户套餐" actionRef={actionRef} rowKey="id" columns={columns}
        request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listTenantPackage({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
        pagination={{ defaultPageSize: 10 }} search={false}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setModalTitle('新增套餐'); setEditingId(''); setInitialValues({ sort: 1, status: 1 }); setModalOpen(true) }}>新增</Button>]}
      />
      <ModalForm
        title={modalTitle}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onFinish={async (values: any) => {
          if (editingId) { await updateTenantPackage(values, editingId) } else { await addTenantPackage(values) }
          message.success(editingId ? '修改成功' : '新增成功')
          actionRef.current?.reload()
          return true
        }}
        initialValues={initialValues}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText name="name" label="套餐名称" rules={[{ required: true }]} />
        <ProFormDigit name="sort" label="排序" min={1} initialValue={1} fieldProps={{ style: { width: '100%' } }} />
        <ProFormSelect name="status" label="状态" initialValue={1}
          options={[{ label: '启用', value: 1 }, { label: '禁用', value: 2 }]}
        />
        <ProFormTextArea name="description" label="描述" fieldProps={{ rows: 3 }} />
      </ModalForm>
    </>
  )
}
