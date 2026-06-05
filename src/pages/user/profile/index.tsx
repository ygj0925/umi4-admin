import React, { useState } from 'react'
import { Card, Row, Col, Avatar, Descriptions, Button, message, Tabs } from 'antd'
import { UserOutlined, EditOutlined } from '@ant-design/icons'
import { ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components'
import { useUserStore } from '@/stores/useUserStore'
import { updateUserBaseInfo, uploadAvatar, updateUserPassword } from '@/services/system/userProfile'

export default function UserProfilePage() {
  const { userInfo, getInfo } = useUserStore()
  const [editMode, setEditMode] = useState(false)

  const handleSaveBasic = async (values: any) => {
    await updateUserBaseInfo(values)
    message.success('修改成功')
    setEditMode(false)
    getInfo()
  }

  const handleChangePwd = async (values: any) => {
    await updateUserPassword(values)
    message.success('密码修改成功')
    return true
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar
            size={88}
            icon={<UserOutlined />}
            src={userInfo?.avatar}
            style={{
              background: 'var(--accent-light, #EEF2FF)',
              color: 'var(--accent, #4F46E5)',
              border: '3px solid var(--border-secondary)',
            }}
          />
          <h2 style={{
            marginTop: 14,
            marginBottom: 4,
            color: 'var(--text-primary)',
            fontWeight: 600,
            letterSpacing: '-0.3px',
          }}>
            {userInfo?.nickname || userInfo?.username}
          </h2>
          <p style={{ color: 'var(--text-tertiary)', margin: 0, fontSize: 14 }}>{userInfo?.deptName}</p>
        </div>
        <Tabs items={[
          { key: 'basic', label: '基本信息', children: (
            editMode ? (
              <ProForm
                layout="vertical"
                initialValues={userInfo}
                onFinish={handleSaveBasic}
                style={{ maxWidth: 400, margin: '0 auto' }}
                submitter={{
                  render: (props) => (
                    <>
                      <Button type="primary" onClick={() => props.form?.submit?.()} style={{ marginRight: 8 }}>保存</Button>
                      <Button onClick={() => setEditMode(false)}>取消</Button>
                    </>
                  ),
                }}
              >
                <ProFormText name="nickname" label="昵称" rules={[{ required: true }]} />
                <ProFormSelect name="gender" label="性别"
                  options={[{ label: '男', value: 1 }, { label: '女', value: 2 }, { label: '未知', value: 0 }]}
                />
              </ProForm>
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
                <Button icon={<EditOutlined />} onClick={() => setEditMode(true)}>编辑</Button>
              </div>
            )
          )},
          { key: 'password', label: '修改密码', children: (
            <ProForm
              layout="vertical"
              onFinish={handleChangePwd}
              style={{ maxWidth: 400, margin: '0 auto' }}
              submitter={{ searchConfig: { submitText: '修改密码' } }}
            >
              <ProFormText.Password name="oldPassword" label="原密码" rules={[{ required: true }]} />
              <ProFormText.Password name="newPassword" label="新密码" rules={[{ required: true }]} />
            </ProForm>
          )},
        ]} />
      </Card>
    </div>
  )
}
