import React, { useState, useRef, useEffect } from 'react'
import { ProTable, DrawerForm, ModalForm, ProFormText, ProFormSelect, ProFormTextArea, ProFormTreeSelect, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined, ExportOutlined } from '@ant-design/icons'
import { listUser, addUser, updateUser, deleteUser, resetUserPwd, updateUserRole, exportUser } from '@/services/system/user'
import { listRoleDict } from '@/services/system/role'
import { listDeptDictTree } from '@/services/system/dept'
import { useDownload } from '@/hooks/useDownload'

export default function UserPage() {
  const actionRef = useRef<ActionType>()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [pwdModalOpen, setPwdModalOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState('')
  const [currentRoleIds, setCurrentRoleIds] = useState<number[]>([])
  const [deptTree, setDeptTree] = useState<any[]>([])
  const [roleOptions, setRoleOptions] = useState<any[]>([])
  const { download } = useDownload()

  useEffect(() => {
    listDeptDictTree({ description: '' }).then((res) => setDeptTree(res.data || []))
    listRoleDict().then((res) => setRoleOptions(res.data || []))
  }, [])

  const columns: ProColumns[] = [
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: '昵称', dataIndex: 'nickname', width: 120 },
    { title: '部门', dataIndex: 'deptName', width: 120, search: false },
    { title: '手机号', dataIndex: 'phone', width: 120 },
    { title: '邮箱', dataIndex: 'email', width: 180, search: false },
    {
      title: '状态', dataIndex: 'status', width: 80, valueType: 'select',
      valueEnum: { 1: { text: '启用', status: 'Success' }, 2: { text: '禁用', status: 'Error' } },
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>
          {record.status === 1 ? '启用' : '禁用'}
        </Tag>
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
        <Button key="pwd" type="link" size="small" icon={<KeyOutlined />} onClick={() => handleResetPwd(record.id)}>重置密码</Button>,
        <Button key="role" type="link" size="small" onClick={() => handleAssignRole(record.id, record.roleIds)}>分配角色</Button>,
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
    await deleteUser(id)
    message.success('删除成功')
    actionRef.current?.reload()
  }

  const handleResetPwd = (id: string) => {
    setCurrentUserId(id)
    setPwdModalOpen(true)
  }

  const handleAssignRole = (id: string, roleIds: number[]) => {
    setCurrentUserId(id)
    setCurrentRoleIds(roleIds || [])
    setRoleModalOpen(true)
  }

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ width: 240, background: '#fff', borderRadius: 8, padding: 16 }}>
        <h4 style={{ marginBottom: 12 }}>部门列表</h4>
        <div>
          {deptTree.map((node: any) => (
            <div key={node.value} style={{ padding: '4px 0', cursor: 'pointer' }} onClick={() => actionRef.current?.reload()}>
              {node.label}
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <ProTable
          headerTitle="用户管理"
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          request={async (params) => {
            const { current, pageSize, ...rest } = params
            const res = await listUser({ page: current, size: pageSize, ...rest })
            return { data: res.data?.list || [], total: res.data?.total || 0, success: true }
          }}
          pagination={{ defaultPageSize: 10 }}
          search={{ labelWidth: 'auto' }}
          toolBarRender={() => [
            <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增用户</Button>,
            <Button key="export" icon={<ExportOutlined />} onClick={() => download(() => exportUser({}), '用户列表.xlsx')}>导出</Button>,
          ]}
          scroll={{ x: 1200 }}
        />
        <DrawerForm
          title={editingRecord ? '编辑用户' : '新增用户'}
          open={drawerOpen}
          onOpenChange={(open) => { if (!open) setDrawerOpen(false) }}
          width={600}
          grid
          rowProps={{ gutter: 16 }}
          drawerProps={{ destroyOnClose: true }}
          request={async () => editingRecord || {}}
          onFinish={async (values) => {
            if (editingRecord?.id) {
              await updateUser(values, editingRecord.id)
              message.success('修改成功')
            } else {
              await addUser(values)
              message.success('新增成功')
            }
            return true
          }}
        >
          <ProFormText colProps={{ span: 12 }} name="username" label="用户名" rules={[{ required: true }]} />
          <ProFormText colProps={{ span: 12 }} name="nickname" label="昵称" rules={[{ required: true }]} />
          <ProFormText colProps={{ span: 12 }} name="phone" label="手机号" />
          <ProFormText colProps={{ span: 12 }} name="email" label="邮箱" />
          <ProFormSelect colProps={{ span: 12 }} name="gender" label="性别" options={[{ label: '男', value: 1 }, { label: '女', value: 2 }, { label: '未知', value: 0 }]} />
          <ProFormSelect colProps={{ span: 12 }} name="status" label="状态" initialValue={1} options={[{ label: '启用', value: 1 }, { label: '禁用', value: 2 }]} />
          <ProFormTreeSelect colProps={{ span: 12 }} name="deptId" label="部门" fieldProps={{ treeData: deptTree, placeholder: '请选择部门', allowClear: true }} />
          <ProFormSelect colProps={{ span: 12 }} name="roleIds" label="角色" mode="multiple" options={roleOptions} placeholder="请选择角色" />
          {!editingRecord && (
            <ProFormText.Password colProps={{ span: 12 }} name="password" label="密码" rules={[{ required: true }]} />
          )}
          <ProFormTextArea colProps={{ span: 24 }} name="description" label="描述" fieldProps={{ rows: 3 }} />
        </DrawerForm>
        <ModalForm
          title="重置密码"
          open={pwdModalOpen}
          onOpenChange={setPwdModalOpen}
          modalProps={{ destroyOnClose: true }}
          onFinish={async (values) => {
            await resetUserPwd(values, currentUserId)
            message.success('密码重置成功')
            return true
          }}
        >
          <ProFormText.Password name="password" label="新密码" rules={[{ required: true }]} />
        </ModalForm>
        <ModalForm
          title="分配角色"
          open={roleModalOpen}
          onOpenChange={setRoleModalOpen}
          modalProps={{ destroyOnClose: true }}
          request={async () => ({ roleIds: currentRoleIds })}
          onFinish={async (values) => {
            await updateUserRole({ roleIds: values.roleIds }, currentUserId)
            message.success('角色分配成功')
            actionRef.current?.reload()
            return true
          }}
        >
          <ProFormSelect name="roleIds" label="角色" mode="multiple" options={roleOptions} rules={[{ required: true }]} placeholder="请选择角色" />
        </ModalForm>
      </div>
    </div>
  )
}
