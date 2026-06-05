import React, { useState, useEffect, useCallback } from 'react'
import { history } from 'umi'
import { Form, Input, Button, Tabs, Checkbox, message, Space } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined, MobileOutlined, MailOutlined } from '@ant-design/icons'
import { useUserStore } from '@/stores/useUserStore'
import { getImageCaptcha } from '@/services/captcha'
import { encryptByRsa } from '@/utils/encrypt'
import { sanitizeHtml } from '@/utils/sanitize'

export default function LoginPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [captchaImg, setCaptchaImg] = useState('')
  const [captchaUuid, setCaptchaUuid] = useState('')
  const [activeTab, setActiveTab] = useState('account')
  const { login } = useUserStore()

  const loadCaptcha = useCallback(async () => {
    try {
      const res = await getImageCaptcha()
      if (res.data) {
        setCaptchaImg(res.data.img)
        setCaptchaUuid(res.data.uuid)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    loadCaptcha()
  }, [loadCaptcha])

  const handleLogin = async (values: any) => {
    setLoading(true)
    try {
      const data: any = {
        clientId: process.env.VITE_CLIENT_ID,
      }
      if (activeTab === 'account') {
        data.username = values.username
        data.password = encryptByRsa(values.password)
        data.captcha = values.captcha
        data.uuid = captchaUuid
      } else if (activeTab === 'phone') {
        data.phone = values.phone
        data.captcha = values.phoneCaptcha
        data.authType = 'PHONE'
      } else if (activeTab === 'email') {
        data.email = values.email
        data.captcha = values.emailCaptcha
        data.authType = 'EMAIL'
      }
      await login(data)
      message.success('登录成功')
      history.push('/')
    } catch (err: any) {
      message.error(err?.message || '登录失败')
      loadCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #165DFF 0%, #36a3f7 100%)',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        padding: 40,
      }} className="hidden md:flex">
        <h1 style={{ fontSize: 42, fontWeight: 'bold', marginBottom: 16 }}>SSS Admin</h1>
        <p style={{ fontSize: 18, opacity: 0.85 }}>企业级后台管理系统</p>
      </div>
      <div style={{
        width: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        borderRadius: 8,
        margin: 'auto',
      }}>
        <div style={{ width: 360, padding: '40px 0' }}>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' }}>
            登录
          </h2>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            items={[
              { key: 'account', label: '账号登录' },
              { key: 'phone', label: '手机号登录' },
              { key: 'email', label: '邮箱登录' },
            ]}
          />
          <Form form={form} onFinish={handleLogin} size="large">
            {activeTab === 'account' && (
              <>
                <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                  <Input prefix={<UserOutlined />} placeholder="用户名" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                </Form.Item>
                <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
                  <Space style={{ width: '100%' }}>
                    <Input prefix={<SafetyOutlined />} placeholder="验证码" style={{ flex: 1 }} />
                    <div
                      onClick={loadCaptcha}
                      style={{ cursor: 'pointer', height: 40, width: 120 }}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(captchaImg) }}
                    />
                  </Space>
                </Form.Item>
              </>
            )}
            {activeTab === 'phone' && (
              <>
                <Form.Item name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
                  <Input prefix={<MobileOutlined />} placeholder="手机号" />
                </Form.Item>
                <Form.Item name="phoneCaptcha" rules={[{ required: true, message: '请输入验证码' }]}>
                  <Space style={{ width: '100%' }}>
                    <Input prefix={<SafetyOutlined />} placeholder="验证码" style={{ flex: 1 }} />
                    <Button>获取验证码</Button>
                  </Space>
                </Form.Item>
              </>
            )}
            {activeTab === 'email' && (
              <>
                <Form.Item name="email" rules={[{ required: true, type: 'email', message: '请输入邮箱' }]}>
                  <Input prefix={<MailOutlined />} placeholder="邮箱" />
                </Form.Item>
                <Form.Item name="emailCaptcha" rules={[{ required: true, message: '请输入验证码' }]}>
                  <Space style={{ width: '100%' }}>
                    <Input prefix={<SafetyOutlined />} placeholder="验证码" style={{ flex: 1 }} />
                    <Button>获取验证码</Button>
                  </Space>
                </Form.Item>
              </>
            )}
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Checkbox>记住我</Checkbox>
                <a>忘记密码？</a>
              </div>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
