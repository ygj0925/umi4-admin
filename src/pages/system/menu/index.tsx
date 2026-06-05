import React, { useState, useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Space, Tag, Modal, message, Popconfirm, Form, Input, InputNumber, Select, Switch, TreeSelect } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons'
import { listMenu, addMenu, updateMenu, deleteMenu, clearMenuCache } from '@/services/system/menu'

export default function MenuPage() {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState<string>('')
  const [menuData, setMenuData] = useState<any[]>([])

  const columns: ProColumns[] = [
    { title: '菜单名称', dataIndex: 'title', width: 200 },
    { title: '图标', dataIndex: 'icon', width: 80, search: false },
    {
      title: '类型', dataIndex: 'type', width: 80, search: false,
      render: (_, record) => {
        const typeMap: Record<number, { text: string; color: string }> = {
          1: { text: '目录', color: 'blue' },
          2: { text: '菜单', color: 'green' },
          3: { text: '按钮', color: 'orange' },
        }
        const t = typeMap[record.type] || { text: '未知', color: 'default' }
        return <Tag color={t.color}>{t.text}</Tag>
      },
    },
    { title: '路由地址', dataIndex: 'path', width: 180, search: false },
    { title: '权限标识', dataIndex: 'permission', width: 150, search: false },
    { title: '排序', dataIndex: 'sort', width: 80, search: false },
    {
      title: '状态', dataIndex: 'status', width: 80, search: false,
      render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag>,
    },
    { title: '创建时间', dataIndex: 'createTime', width: 160, search: false },
    {
      title: '操作', valueType: 'option', width: 200, fixed: 'right',
      render: (_, record) => [
        <Button key="edit" type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  const handleAdd = (parentId?: string) => {
    setModalTitle('新增菜单')
    setEditingId('')
    form.resetFields()
    if (parentId) form.setFieldsValue({ parentId })
    setModalOpen(true)
  }

  const handleEdit = (record: any) => {
    setModalTitle('编辑菜单')
    setEditingId(record.id)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editingId) {
      await updateMenu(values, editingId)
      message.success('修改成功')
    } else {
      await addMenu(values)
      message.success('新增成功')
    }
    setModalOpen(false)
    actionRef.current?.reload()
  }

  const handleDelete = async (id: string) => {
    await deleteMenu(id)
    message.success('删除成功')
    actionRef.current?.reload()
  }

  const handleClearCache = async () => {
    await clearMenuCache()
    message.success('缓存清除成功')
  }

  return (
    <ProTable
      headerTitle="菜单管理"
      actionRef={actionRef}
      rowKey="id"
      columns={columns}
      request={async () => {
        const res = await listMenu()
        setMenuData(res.data || [])
        return { data: res.data || [], success: true }
      }}
      pagination={false}
      search={false}
      toolBarRender={() => [
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>新增菜单</Button>,
        <Button key="cache" icon={<ClearOutlined />} onClick={handleClearCache}>清除缓存</Button>,
      ]}
      scroll={{ x: 1200 }}
    >
      <Modal title={modalTitle} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="parentId" label="上级菜单">
            <TreeSelect treeData={menuData} placeholder="请选择" allowClear fieldNames={{ label: 'title', value: 'id', children: 'children' }} />
          </Form.Item>
          <Form.Item name="type" label="类型" initialValue={1}>
            <Select options={[{ label: '目录', value: 1 }, { label: '菜单', value: 2 }, { label: '按钮', value: 3 }]} />
          </Form.Item>
          <Form.Item name="title" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="path" label="路由地址">
            <Input />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input />
          </Form.Item>
          <Form.Item name="permission" label="权限标识">
            <Input />
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 2 }]} />
          </Form.Item>
        </Form>
      </Modal>
    </ProTable>
  )
}
