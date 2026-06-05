import React, { useRef, useState } from 'react'
import { ProTable, ModalForm, ProFormText, ProFormSelect, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { listStorage, addStorage, updateStorage, deleteStorage, setDefaultStorage } from '@/services/system/storage'

export default function StorageConfigPage() {
  const actionRef = useRef<ActionType>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState('')
  const [initialValues, setInitialValues] = useState<any>({})

  const columns: ProColumns[] = [
    { title: '名称', dataIndex: 'name' },
    { title: '编码', dataIndex: 'code' },
    { title: '类型', dataIndex: 'type', width: 100, valueEnum: { 1: '本地', 2: 'OSS', 3: 'S3' } },
    { title: '默认', dataIndex: 'isDefault', width: 80, render: (_, record) => record.isDefault ? <Tag color="green">是</Tag> : '-' },
    { title: '状态', dataIndex: 'status', width: 80, render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag> },
    {
      title: '操作', valueType: 'option', width: 250,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑存储'); setEditingId(record.id); setInitialValues(record); setModalOpen(true) }}>编辑</Button>,
        !record.isDefault && <Button key="default" type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleSetDefault(record.id)}>设为默认</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  const handleAdd = () => { setModalTitle('新增存储'); setEditingId(''); setInitialValues({}); setModalOpen(true) }

  const handleSubmit = async (values: any) => {
    if (editingId) { await updateStorage(values, editingId); message.success('修改成功') }
    else { await addStorage(values); message.success('新增成功') }
    setModalOpen(false); actionRef.current?.reload()
  }

  const handleDelete = async (id: string) => { await deleteStorage(id); message.success('删除成功'); actionRef.current?.reload() }
  const handleSetDefault = async (id: string) => { await setDefaultStorage(id); message.success('设置成功'); actionRef.current?.reload() }

  return (
    <>
      <ProTable headerTitle="存储配置" actionRef={actionRef} rowKey="id" columns={columns}
        request={async () => { const res = await listStorage({}); return { data: res.data || [], success: true } }}
        pagination={false} search={false}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增存储</Button>]}
      />
      <ModalForm
        title={modalTitle}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onFinish={handleSubmit}
        width={600}
        initialValues={initialValues}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText name="name" label="名称" rules={[{ required: true }]} />
        <ProFormText name="code" label="编码" rules={[{ required: true }]} />
        <ProFormSelect name="type" label="类型" rules={[{ required: true }]}
          options={[{ label: '本地', value: 1 }, { label: 'OSS', value: 2 }, { label: 'S3', value: 3 }]}
        />
        <ProFormText name="endpoint" label="端点" />
        <ProFormText name="bucketName" label="桶名" />
        <ProFormText name="accessKey" label="AccessKey" />
        <ProFormText.Password name="secretKey" label="SecretKey" />
        <ProFormText name="domain" label="域名" />
      </ModalForm>
    </>
  )
}
