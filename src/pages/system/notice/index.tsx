import React, { useState, useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Space, Tag, Modal, message, Popconfirm, Form, Input, Select, Switch, Drawer } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { listNotice, addNotice, updateNotice, deleteNotice, getNotice } from '@/services/system/notice'

export default function NoticePage() {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState('')
  const [editingId, setEditingId] = useState<string>('')
  const [detailDrawer, setDetailDrawer] = useState(false)
  const [detail, setDetail] = useState<any>(null)

  const columns: ProColumns[] = [
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '类型', dataIndex: 'type', width: 100, valueEnum: { '1': '通知', '2': '公告' } },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (_, record) => {
        const statusMap: Record<number, { text: string; color: string }> = {
          1: { text: '草稿', color: 'default' },
          2: { text: '已发布', color: 'green' },
          3: { text: '已撤回', color: 'red' },
        }
        const s = statusMap[record.status || 1] || { text: '未知', color: 'default' }
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
    { title: '置顶', dataIndex: 'isTop', width: 80, render: (_, record) => record.isTop ? <Tag color="red">是</Tag> : '-' },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 200,
      render: (_, record) => [
        <Button key="view" type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record.id)}>查看</Button>,
        <Button key="edit" type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  const handleAdd = () => {
    setDrawerTitle('新增公告')
    setEditingId('')
    form.resetFields()
    setDrawerOpen(true)
  }

  const handleEdit = (record: any) => {
    setDrawerTitle('编辑公告')
    setEditingId(record.id)
    form.setFieldsValue(record)
    setDrawerOpen(true)
  }

  const handleView = async (id: string) => {
    const res = await getNotice(id)
    setDetail(res.data)
    setDetailDrawer(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editingId) {
      await updateNotice(values, editingId)
      message.success('修改成功')
    } else {
      await addNotice(values)
      message.success('新增成功')
    }
    setDrawerOpen(false)
    actionRef.current?.reload()
  }

  const handleDelete = async (id: string) => {
    await deleteNotice(id)
    message.success('删除成功')
    actionRef.current?.reload()
  }

  return (
    <>
      <ProTable
        headerTitle="公告管理"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const res = await listNotice({ page: current, size: pageSize, ...rest })
          return { data: res.data?.list || [], total: res.data?.total || 0, success: true }
        }}
        pagination={{ defaultPageSize: 10 }}
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增公告</Button>,
        ]}
      />
      <Drawer title={drawerTitle} open={drawerOpen} onClose={() => setDrawerOpen(false)} width={600} extra={
        <Space>
          <Button onClick={() => setDrawerOpen(false)}>取消</Button>
          <Button type="primary" onClick={handleSubmit}>确定</Button>
        </Space>
      }>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select options={[{ label: '通知', value: '1' }, { label: '公告', value: '2' }]} />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}><Input.TextArea rows={8} /></Form.Item>
          <Form.Item name="isTop" label="置顶" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Drawer>
      <Drawer title="公告详情" open={detailDrawer} onClose={() => setDetailDrawer(false)} width={600}>
        {detail && (
          <div>
            <h3>{detail.title}</h3>
            <p style={{ color: '#999', marginBottom: 16 }}>{detail.createTime}</p>
            <div dangerouslySetInnerHTML={{ __html: detail.content }} />
          </div>
        )}
      </Drawer>
    </>
  )
}
