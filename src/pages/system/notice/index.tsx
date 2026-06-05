import React, { useState, useRef } from 'react'
import { ProTable, DrawerForm, ProFormText, ProFormSelect, ProFormTextArea, ProFormSwitch, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, message, Popconfirm, Drawer } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { listNotice, addNotice, updateNotice, deleteNotice, getNotice } from '@/services/system/notice'
import { sanitizeHtml } from '@/utils/sanitize'

export default function NoticePage() {
  const actionRef = useRef<ActionType>()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
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
    setEditingRecord(null)
    setDrawerOpen(true)
  }

  const handleEdit = (record: any) => {
    setEditingRecord(record)
    setDrawerOpen(true)
  }

  const handleView = async (id: string) => {
    const res = await getNotice(id)
    setDetail(res.data)
    setDetailDrawer(true)
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
      <DrawerForm
        title={editingRecord ? '编辑公告' : '新增公告'}
        open={drawerOpen}
        onOpenChange={(open) => { if (!open) setDrawerOpen(false) }}
        width={600}
        drawerProps={{ destroyOnClose: true }}
        request={async () => editingRecord || {}}
        onFinish={async (values) => {
          if (editingRecord?.id) {
            await updateNotice(values, editingRecord.id)
            message.success('修改成功')
          } else {
            await addNotice(values)
            message.success('新增成功')
          }
          return true
        }}
      >
        <ProFormText name="title" label="标题" rules={[{ required: true }]} />
        <ProFormSelect name="type" label="类型" rules={[{ required: true }]} options={[{ label: '通知', value: '1' }, { label: '公告', value: '2' }]} />
        <ProFormTextArea name="content" label="内容" rules={[{ required: true }]} fieldProps={{ rows: 8 }} />
        <ProFormSwitch name="isTop" label="置顶" />
      </DrawerForm>
      <Drawer title="公告详情" open={detailDrawer} onClose={() => setDetailDrawer(false)} width={600}>
        {detail && (
          <div>
            <h3>{detail.title}</h3>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: 16 }}>{detail.createTime}</p>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(detail.content) }} />
          </div>
        )}
      </Drawer>
    </>
  )
}
