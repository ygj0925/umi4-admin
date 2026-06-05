import React, { useState, useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, Modal, message, Popconfirm, Form, Input, InputNumber, TreeSelect, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons'
import { listDept, addDept, updateDept, deleteDept, exportDept } from '@/services/system/dept'
import { useDownload } from '@/hooks/useDownload'

export default function DeptPage() {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState<string>('')
  const [deptData, setDeptData] = useState<any[]>([])
  const { download } = useDownload()

  const columns: ProColumns[] = [
    { title: '部门名称', dataIndex: 'name', width: 200 },
    { title: '排序', dataIndex: 'sort', width: 80 },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag>,
    },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 200,
      render: (_, record) => [
        <Button key="add" type="link" size="small" icon={<PlusOutlined />} onClick={() => handleAdd(record.id)}>新增</Button>,
        <Button key="edit" type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  const handleAdd = (parentId?: string) => {
    setModalTitle('新增部门')
    setEditingId('')
    form.resetFields()
    if (parentId) form.setFieldsValue({ parentId })
    setModalOpen(true)
  }

  const handleEdit = (record: any) => {
    setModalTitle('编辑部门')
    setEditingId(record.id)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editingId) {
      await updateDept(values, editingId)
      message.success('修改成功')
    } else {
      await addDept(values)
      message.success('新增成功')
    }
    setModalOpen(false)
    actionRef.current?.reload()
  }

  const handleDelete = async (id: string) => {
    await deleteDept(id)
    message.success('删除成功')
    actionRef.current?.reload()
  }

  return (
    <ProTable
      headerTitle="部门管理"
      actionRef={actionRef}
      rowKey="id"
      columns={columns}
      request={async () => {
        const res = await listDept({})
        setDeptData(res.data || [])
        return { data: res.data || [], success: true }
      }}
      pagination={false}
      search={false}
      toolBarRender={() => [
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>新增部门</Button>,
        <Button key="export" icon={<ExportOutlined />} onClick={() => download(() => exportDept({}), '部门列表.xlsx')}>导出</Button>,
      ]}
    >
      <Modal title={modalTitle} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={500}>
        <Form form={form} layout="vertical">
          <Form.Item name="parentId" label="上级部门">
            <TreeSelect treeData={deptData} placeholder="请选择" allowClear fieldNames={{ label: 'name', value: 'id', children: 'children' }} />
          </Form.Item>
          <Form.Item name="name" label="部门名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 2 }]} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </ProTable>
  )
}
