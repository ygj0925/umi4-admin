import React, { useState, useRef } from 'react'
import { ProTable, ModalForm, ProFormText, ProFormSelect, ProFormDatePicker, ProFormTextArea, ProFormDigit, ProFormRadio, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, message, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { listTaskCategories, createTaskCategory, updateTaskCategory, deleteTaskCategory } from '@/services/task'

export default function CategoryPage() {
  const actionRef = useRef<ActionType>()
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
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑分类'); setEditingId(record.id); setModalOpen(true) }}>编辑</Button>,
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
      toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setModalTitle('新增分类'); setEditingId(''); setModalOpen(true) }}>新增分类</Button>]}
    >
      <ModalForm
        title={modalTitle}
        open={modalOpen}
        onOpenChange={(v) => { if (!v) setModalOpen(false) }}
        request={async () => {
          if (editingId) {
            const res = await listTaskCategories()
            const item = (res.data || []).find((c: any) => c.id === editingId)
            return item || {}
          }
          return { sort: 1 }
        }}
        onFinish={async (values) => {
          if (editingId) {
            await updateTaskCategory(editingId, values)
            message.success('修改成功')
          } else {
            await createTaskCategory(values)
            message.success('新增成功')
          }
          actionRef.current?.reload()
          return true
        }}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText name="name" label="分类名称" rules={[{ required: true }]} />
        <ProFormDigit name="sort" label="排序" min={1} initialValue={1} />
        <ProFormText name="description" label="描述" />
      </ModalForm>
    </ProTable>
  )
}
