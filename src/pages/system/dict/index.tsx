import React, { useState, useRef, useEffect } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Space, Tag, Modal, message, Popconfirm, Form, Input, InputNumber, Select, Card, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { listDict, addDict, updateDict, deleteDict, listDictItem, addDictItem, updateDictItem, deleteDictItem } from '@/services/system/dict'

export default function DictPage() {
  const dictActionRef = useRef<ActionType>()
  const itemActionRef = useRef<ActionType>()
  const [dictForm] = Form.useForm()
  const [itemForm] = Form.useForm()
  const [dictModalOpen, setDictModalOpen] = useState(false)
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [dictModalTitle, setDictModalTitle] = useState('')
  const [itemModalTitle, setItemModalTitle] = useState('')
  const [editingDictId, setEditingDictId] = useState('')
  const [editingItemId, setEditingItemId] = useState('')
  const [selectedDict, setSelectedDict] = useState<any>(null)

  const dictColumns: ProColumns[] = [
    { title: '字典名称', dataIndex: 'name', ellipsis: true },
    { title: '字典编码', dataIndex: 'code', ellipsis: true },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '操作', valueType: 'option', width: 150,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" onClick={() => handleEditDict(record)}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={() => handleDeleteDict(record.id)}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  const itemColumns: ProColumns[] = [
    { title: '标签', dataIndex: 'label' },
    { title: '值', dataIndex: 'value' },
    { title: '颜色', dataIndex: 'color', width: 80,
      render: (_, record) => record.color ? <Tag color={record.color}>{record.color}</Tag> : '-',
    },
    { title: '排序', dataIndex: 'sort', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag>,
    },
    {
      title: '操作', valueType: 'option', width: 150,
      render: (_, record) => [
        <Button key="edit" type="link" size="small" onClick={() => handleEditItem(record)}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={() => handleDeleteItem(record.id)}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  const handleAddDict = () => {
    setDictModalTitle('新增字典')
    setEditingDictId('')
    dictForm.resetFields()
    setDictModalOpen(true)
  }

  const handleEditDict = (record: any) => {
    setDictModalTitle('编辑字典')
    setEditingDictId(record.id)
    dictForm.setFieldsValue(record)
    setDictModalOpen(true)
  }

  const handleDictSubmit = async () => {
    const values = await dictForm.validateFields()
    if (editingDictId) {
      await updateDict(values, editingDictId)
      message.success('修改成功')
    } else {
      await addDict(values)
      message.success('新增成功')
    }
    setDictModalOpen(false)
    dictActionRef.current?.reload()
  }

  const handleDeleteDict = async (id: string) => {
    await deleteDict(id)
    message.success('删除成功')
    if (selectedDict?.id === id) setSelectedDict(null)
    dictActionRef.current?.reload()
  }

  const handleAddItem = () => {
    if (!selectedDict) { message.warning('请先选择字典'); return }
    setItemModalTitle('新增字典项')
    setEditingItemId('')
    itemForm.resetFields()
    setItemModalOpen(true)
  }

  const handleEditItem = (record: any) => {
    setItemModalTitle('编辑字典项')
    setEditingItemId(record.id)
    itemForm.setFieldsValue(record)
    setItemModalOpen(true)
  }

  const handleItemSubmit = async () => {
    const values = await itemForm.validateFields()
    if (editingItemId) {
      await updateDictItem(values, editingItemId)
      message.success('修改成功')
    } else {
      await addDictItem({ ...values, dictId: selectedDict.id })
      message.success('新增成功')
    }
    setItemModalOpen(false)
    itemActionRef.current?.reload()
  }

  const handleDeleteItem = async (id: string) => {
    await deleteDictItem(id)
    message.success('删除成功')
    itemActionRef.current?.reload()
  }

  return (
    <Row gutter={16}>
      <Col span={10}>
        <Card title="字典列表" extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAddDict}>新增</Button>}>
          <ProTable
            actionRef={dictActionRef}
            rowKey="id"
            columns={dictColumns}
            request={async () => {
              const res = await listDict()
              return { data: res.data || [], success: true }
            }}
            pagination={false}
            search={false}
            options={false}
            onRow={(record) => ({
              onClick: () => { setSelectedDict(record); itemActionRef.current?.reload() },
              style: { cursor: 'pointer', background: selectedDict?.id === record.id ? '#e6f7ff' : undefined },
            })}
          />
        </Card>
      </Col>
      <Col span={14}>
        <Card title={selectedDict ? `字典项 - ${selectedDict.name}` : '字典项'} extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAddItem}>新增</Button>}>
          <ProTable
            actionRef={itemActionRef}
            rowKey="id"
            columns={itemColumns}
            request={async (params) => {
              if (!selectedDict) return { data: [], success: true }
              const { current, pageSize, ...rest } = params
              const res = await listDictItem({ page: current, size: pageSize, dictId: selectedDict.id, ...rest })
              return { data: res.data?.list || [], total: res.data?.total || 0, success: true }
            }}
            pagination={{ defaultPageSize: 10 }}
            search={false}
            options={false}
          />
        </Card>
      </Col>
      <Modal title={dictModalTitle} open={dictModalOpen} onOk={handleDictSubmit} onCancel={() => setDictModalOpen(false)}>
        <Form form={dictForm} layout="vertical">
          <Form.Item name="name" label="字典名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="code" label="字典编码" rules={[{ required: true }]}><Input disabled={!!editingDictId} /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
      <Modal title={itemModalTitle} open={itemModalOpen} onOk={handleItemSubmit} onCancel={() => setItemModalOpen(false)}>
        <Form form={itemForm} layout="vertical">
          <Form.Item name="label" label="标签" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="value" label="值" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="color" label="颜色"><Input placeholder="如: blue, red, green" /></Form.Item>
          <Form.Item name="sort" label="排序" initialValue={1}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}><Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 2 }]} /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>
    </Row>
  )
}
