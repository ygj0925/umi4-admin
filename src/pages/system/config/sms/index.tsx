import React, { useRef, useState } from 'react'
import { ProTable, ModalForm, ProFormText, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { listSmsConfig, addSmsConfig, updateSmsConfig, deleteSmsConfig, setDefaultSmsConfig } from '@/services/system/smsConfig'

export default function SmsConfigPage() {
  const actionRef = useRef<ActionType>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState('')
  const [initialValues, setInitialValues] = useState<any>({})

  const columns: ProColumns[] = [
    { title: '名称', dataIndex: 'name' },
    { title: '供应商', dataIndex: 'supplier', width: 100 },
    { title: '默认', dataIndex: 'isDefault', width: 80, render: (_, record) => record.isDefault ? <Tag color="green">是</Tag> : '-' },
    { title: '状态', dataIndex: 'status', width: 80, render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag> },
    {
      title: '操作', valueType: 'option', width: 250,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑短信配置'); setEditingId(record.id); setInitialValues(record); setModalOpen(true) }}>编辑</Button>,
        !record.isDefault && <Button key="default" type="link" size="small" icon={<CheckCircleOutlined />} onClick={async () => { await setDefaultSmsConfig(record.id); message.success('设置成功'); actionRef.current?.reload() }}>设为默认</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async () => { await deleteSmsConfig(record.id); message.success('删除成功'); actionRef.current?.reload() }}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <>
      <ProTable headerTitle="短信配置" actionRef={actionRef} rowKey="id" columns={columns}
        request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listSmsConfig({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
        pagination={{ defaultPageSize: 10 }} search={false}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setModalTitle('新增短信配置'); setEditingId(''); setInitialValues({}); setModalOpen(true) }}>新增</Button>]}
      />
      <ModalForm
        title={modalTitle}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onFinish={async (values: any) => {
          if (editingId) { await updateSmsConfig(values, editingId) } else { await addSmsConfig(values) }
          message.success(editingId ? '修改成功' : '新增成功')
          actionRef.current?.reload()
          return true
        }}
        width={600}
        initialValues={initialValues}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText name="name" label="名称" rules={[{ required: true }]} />
        <ProFormText name="supplier" label="供应商" rules={[{ required: true }]} />
        <ProFormText name="accessKey" label="AccessKey" />
        <ProFormText.Password name="secretKey" label="SecretKey" />
        <ProFormText name="signature" label="签名" />
        <ProFormText name="templateId" label="模板ID" />
      </ModalForm>
    </>
  )
}
