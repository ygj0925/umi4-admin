import React, { useState, useRef, useEffect } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Space, Tag, Modal, message, Popconfirm, Drawer, Form, Input, Select, TreeSelect, InputNumber, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined, ExportOutlined } from '@ant-design/icons'
import { listUser, addUser, updateUser, deleteUser, resetUserPwd, updateUserRole, exportUser } from '@/services/system/user'
import { listRoleDict } from '@/services/system/role'
import { listDeptDictTree } from '@/services/system/dept'
import { useDownload } from '@/hooks/useDownload'

export default function UserPage() {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const [roleForm] = Form.useForm()
  const [pwdForm] = Form.useForm()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState('')
  const [editingId, setEditingId] = useState<string>('')
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [pwdModalOpen, setPwdModalOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState('')
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
    setDrawerTitle('新增用户')
    setEditingId('')
    form.resetFields()
    setDrawerOpen(true)
  }

  const handleEdit = (record: any) => {
    setDrawerTitle('编辑用户')
    setEditingId(record.id)
    form.setFieldsValue(record)
    setDrawerOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editingId) {
      await updateUser(values, editingId)
      message.success('修改成功')
    } else {
      await addUser(values)
      message.success('新增成功')
    }
    setDrawerOpen(false)
    actionRef.current?.reload()
  }

  const handleDelete = async (id: string) => {
    await deleteUser(id)
    message.success('删除成功')
    actionRef.current?.reload()
  }

  const handleResetPwd = (id: string) => {
    setCurrentUserId(id)
    pwdForm.resetFields()
    setPwdModalOpen(true)
  }

  const handleResetPwdSubmit = async () => {
    const values = await pwdForm.validateFields()
    await resetUserPwd(values, currentUserId)
    message.success('密码重置成功')
    setPwdModalOpen(false)
  }

  const handleAssignRole = (id: string, roleIds: number[]) => {
    setCurrentUserId(id)
    roleForm.setFieldsValue({ roleIds })
    setRoleModalOpen(true)
  }

  const handleAssignRoleSubmit = async () => {
    const values = await roleForm.validateFields()
    await updateUserRole({ roleIds: values.roleIds }, currentUserId)
    message.success('角色分配成功')
    setRoleModalOpen(false)
    actionRef.current?.reload()
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
        <Drawer title={drawerTitle} open={drawerOpen} onClose={() => setDrawerOpen(false)} width={600} extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>确定</Button>
          </Space>
        }>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="手机号">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="email" label="邮箱">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="gender" label="性别">
                  <Select options={[{ label: '男', value: 1 }, { label: '女', value: 2 }, { label: '未知', value: 0 }]} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="status" label="状态" initialValue={1}>
                  <Select options={[{ label: '启用', value: 1 }, { label: '禁用', value: 2 }]} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="deptId" label="部门">
                  <TreeSelect treeData={deptTree} placeholder="请选择部门" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="roleIds" label="角色">
                  <Select mode="multiple" options={roleOptions} placeholder="请选择角色" />
                </Form.Item>
              </Col>
              {!editingId && (
                <Col span={12}>
                  <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                    <Input.Password />
                  </Form.Item>
                </Col>
              )}
              <Col span={24}>
                <Form.Item name="description" label="描述">
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
        <Modal title="重置密码" open={pwdModalOpen} onOk={handleResetPwdSubmit} onCancel={() => setPwdModalOpen(false)}>
          <Form form={pwdForm} layout="vertical">
            <Form.Item name="password" label="新密码" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
        <Modal title="分配角色" open={roleModalOpen} onOk={handleAssignRoleSubmit} onCancel={() => setRoleModalOpen(false)}>
          <Form form={roleForm} layout="vertical">
            <Form.Item name="roleIds" label="角色" rules={[{ required: true }]}>
              <Select mode="multiple" options={roleOptions} placeholder="请选择角色" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}
