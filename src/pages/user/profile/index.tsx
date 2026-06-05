import React, { useState } from 'react'
import { Card, Row, Col, Avatar, Descriptions, Button, Form, Input, Select, message, Upload, Tabs } from 'antd'
import { UserOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import { useUserStore } from '@/stores/useUserStore'
import { updateUserBaseInfo, uploadAvatar, updateUserPassword } from '@/services/system/userProfile'

export default function UserProfilePage() {
  const { userInfo, getInfo } = useUserStore()
  const [editMode, setEditMode] = useState(false)
  const [form] = Form.useForm()
  const [pwdForm] = Form.useForm()

  const handleSaveBasic = async () => {
    const values = await form.validateFields()
    await updateUserBaseInfo(values)
    message.success('修改成功')
    setEditMode(false)
    getInfo()
  }

  const handleChangePwd = async () => {
    const values = await pwdForm.validateFields()
    await updateUserPassword(values)
    message.success('密码修改成功')
    pwdForm.resetFields()
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={96} icon={<UserOutlined />} src={userInfo?.avatar} />
          <h2 style={{ marginTop: 12 }}>{userInfo?.nickname || userInfo?.username}</h2>
          <p style={{ color: '#999' }}>{userInfo?.deptName}</p>
        </div>
        <Tabs items={[
          { key: 'basic', label: '基本信息', children: (
            editMode ? (
              <Form form={form} layout="vertical" initialValues={userInfo} style={{ maxWidth: 400, margin: '0 auto' }}>
                <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item name="gender" label="性别"><Select options={[{ label: '男', value: 1 }, { label: '女', value: 2 }, { label: '未知', value: 0 }]} /></Form.Item>
                <Button type="primary" onClick={handleSaveBasic} style={{ marginRight: 8 }}>保存</Button>
                <Button onClick={() => setEditMode(false)}>取消</Button>
              </Form>
            ) : (
              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <Descriptions column={1}>
                  <Descriptions.Item label="用户名">{userInfo?.username}</Descriptions.Item>
                  <Descriptions.Item label="昵称">{userInfo?.nickname}</Descriptions.Item>
                  <Descriptions.Item label="性别">{userInfo?.gender === 1 ? '男' : userInfo?.gender === 2 ? '女' : '未知'}</Descriptions.Item>
                  <Descriptions.Item label="邮箱">{userInfo?.email}</Descriptions.Item>
                  <Descriptions.Item label="手机">{userInfo?.phone}</Descriptions.Item>
                  <Descriptions.Item label="部门">{userInfo?.deptName}</Descriptions.Item>
                </Descriptions>
                <Button icon={<EditOutlined />} onClick={() => { setEditMode(true); form.setFieldsValue(userInfo) }}>编辑</Button>
              </div>
            )
          )},
          { key: 'password', label: '修改密码', children: (
            <Form form={pwdForm} layout="vertical" style={{ maxWidth: 400, margin: '0 auto' }}>
              <Form.Item name="oldPassword" label="原密码" rules={[{ required: true }]}><Input.Password /></Form.Item>
              <Form.Item name="newPassword" label="新密码" rules={[{ required: true }]}><Input.Password /></Form.Item>
              <Button type="primary" onClick={handleChangePwd}>修改密码</Button>
            </Form>
          )},
        ]} />
      </Card>
    </div>
  )
}
