import React, { useState, useRef } from 'react'
import { ProTable, DrawerForm, ProFormText, ProFormTextArea, ProFormDigit, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, Modal, message, Popconfirm, Tree } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons'
import { listRole, addRole, updateRole, deleteRole, listRolePermissionTree, updateRolePermission, listRoleUser, assignToUsers, unassignFromUsers } from '@/services/system/role'

export default function RolePage() {
  const actionRef = useRef<ActionType>()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [permModalOpen, setPermModalOpen] = useState(false)
  const [permTree, setPermTree] = useState<any[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [currentRoleId, setCurrentRoleId] = useState('')

  const columns: ProColumns[] = [
    { title: '角色名称', dataIndex: 'name', width: 150 },
    { title: '角色标识', dataIndex: 'code', width: 150 },
    { title: '排序', dataIndex: 'sort', width: 80, search: false },
    { title: '描述', dataIndex: 'description', ellipsis: true, search: false },
    {
      title: '状态', dataIndex: 'status', width: 80, search: false,
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用' : '禁用'}</Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', width: 160, search: false },
    {
      title: '操作', valueType: 'option', width: 280, fixed: 'right',
      render: (_, record) => [
        <Button key="edit" type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>,
        <Button key="perm" type="link" size="small" icon={<SettingOutlined />} onClick={() => handlePermission(record.id)}>权限</Button>,
        <Button key="user" type="link" size="small" icon={<TeamOutlined />} onClick={() => handleRoleUser(record.id)}>用户</Button>,
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

  const handleDelete = async (id: string) => {
    await deleteRole(id)
    message.success('删除成功')
    actionRef.current?.reload()
  }

  const handlePermission = async (id: string) => {
    setCurrentRoleId(id)
    const res = await listRolePermissionTree()
    setPermTree(res.data || [])
    setPermModalOpen(true)
  }

  const handlePermSubmit = async () => {
    await updateRolePermission(currentRoleId, { menuIds: checkedKeys })
    message.success('权限设置成功')
    setPermModalOpen(false)
  }

  const handleRoleUser = (id: string) => {
    message.info('用户管理功能开发中')
  }

  return (
    <>
      <ProTable
        headerTitle="角色管理"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const res = await listRole({ page: current, size: pageSize, ...rest })
          return { data: res.data?.list || res.data || [], total: res.data?.total || 0, success: true }
        }}
        pagination={{ defaultPageSize: 10 }}
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增角色</Button>,
        ]}
        scroll={{ x: 1000 }}
      />
      <DrawerForm
        title={editingRecord ? '编辑角色' : '新增角色'}
        open={drawerOpen}
        onOpenChange={(open) => { if (!open) setDrawerOpen(false) }}
        width={500}
        drawerProps={{ destroyOnClose: true }}
        request={async () => editingRecord || {}}
        onFinish={async (values) => {
          if (editingRecord?.id) {
            await updateRole(values, editingRecord.id)
            message.success('修改成功')
          } else {
            await addRole(values)
            message.success('新增成功')
          }
          return true
        }}
      >
        <ProFormText name="name" label="角色名称" rules={[{ required: true }]} />
        <ProFormText name="code" label="角色标识" rules={[{ required: true }]} />
        <ProFormDigit name="sort" label="排序" initialValue={1} fieldProps={{ min: 1 }} />
        <ProFormTextArea name="description" label="描述" fieldProps={{ rows: 3 }} />
      </DrawerForm>
      <Modal title="权限设置" open={permModalOpen} onOk={handlePermSubmit} onCancel={() => setPermModalOpen(false)} width={600}>
        <Tree
          checkable
          checkedKeys={checkedKeys}
          onCheck={(keys: any) => setCheckedKeys(keys)}
          treeData={permTree}
          defaultExpandAll
        />
      </Modal>
    </>
  )
}
