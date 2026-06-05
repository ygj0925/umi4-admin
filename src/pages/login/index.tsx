import React, { useState, useEffect, useCallback } from 'react'
import { history } from 'umi'
import { Form, Input, Button, Tabs, Checkbox, Space, theme } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined, MobileOutlined, MailOutlined } from '@ant-design/icons'
import { useUserStore } from '@/stores/useUserStore'
import { useAppStore } from '@/stores/useAppStore'
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
  const appTheme = useAppStore((s) => s.theme)
  const isDark = appTheme === 'dark'

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
      history.push('/')
    } catch (err: any) {
      loadCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: isDark ? '#0F0F23' : '#F8F9FC',
      transition: 'background 0.3s',
    }}>
      {/* ─── Left Panel - Brand ──────────────────────────── */}
      <div
        className="hidden md:flex"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(135deg, #1E1B4B 0%, #0F0F23 50%, #1A1A2E 100%)'
            : 'linear-gradient(135deg, #312E81 0%, #4F46E5 40%, #6366F1 100%)',
        }}
      >
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)'} 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />

        {/* Glow accent */}
        <div style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
          top: '30%',
          left: '20%',
          filter: 'blur(60px)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 40 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#fff',
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: '-1px',
          }}>
            S
          </div>
          <h1 style={{
            fontSize: 40,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 12,
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
          }}>
            SSS Admin
          </h1>
          <p style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 320,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            企业级后台管理系统
          </p>
        </div>
      </div>

      {/* ─── Right Panel - Login Form ────────────────────── */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        background: 'var(--bg-card)',
        transition: 'background 0.3s',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          {/* Mobile brand */}
          <div className="md:hidden" style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              color: '#fff',
              fontWeight: 800,
              fontSize: 20,
            }}>
              S
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>SSS Admin</h2>
          </div>

          <h2 style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
            letterSpacing: '-0.3px',
          }}>
            欢迎回来
          </h2>
          <p style={{
            fontSize: 14,
            color: 'var(--text-tertiary)',
            marginBottom: 32,
          }}>
            登录您的账户以继续
          </p>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            items={[
              { key: 'account', label: '账号登录' },
              { key: 'phone', label: '手机登录' },
              { key: 'email', label: '邮箱登录' },
            ]}
            style={{ marginBottom: 8 }}
          />

          <Form form={form} onFinish={handleLogin} size="large" style={{ marginTop: 16 }}>
            {activeTab === 'account' && (
              <>
                <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                  <Input
                    prefix={<UserOutlined style={{ color: 'var(--text-tertiary)' }} />}
                    placeholder="用户名"
                    style={{ height: 44 }}
                  />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                  <Input.Password
                    prefix={<LockOutlined style={{ color: 'var(--text-tertiary)' }} />}
                    placeholder="密码"
                    style={{ height: 44 }}
                  />
                </Form.Item>
                <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
                  <Space style={{ width: '100%' }} size={8}>
                    <Input
                      prefix={<SafetyOutlined style={{ color: 'var(--text-tertiary)' }} />}
                      placeholder="验证码"
                      style={{ flex: 1, height: 44 }}
                    />
                    <div
                      onClick={loadCaptcha}
                      style={{
                        cursor: 'pointer',
                        height: 44,
                        width: 120,
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid var(--border-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--bg-page)',
                      }}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(captchaImg) }}
                    />
                  </Space>
                </Form.Item>
              </>
            )}
            {activeTab === 'phone' && (
              <>
                <Form.Item name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
                  <Input
                    prefix={<MobileOutlined style={{ color: 'var(--text-tertiary)' }} />}
                    placeholder="手机号"
                    style={{ height: 44 }}
                  />
                </Form.Item>
                <Form.Item name="phoneCaptcha" rules={[{ required: true, message: '请输入验证码' }]}>
                  <Space style={{ width: '100%' }} size={8}>
                    <Input
                      prefix={<SafetyOutlined style={{ color: 'var(--text-tertiary)' }} />}
                      placeholder="验证码"
                      style={{ flex: 1, height: 44 }}
                    />
                    <Button style={{ height: 44 }}>获取验证码</Button>
                  </Space>
                </Form.Item>
              </>
            )}
            {activeTab === 'email' && (
              <>
                <Form.Item name="email" rules={[{ required: true, type: 'email', message: '请输入邮箱' }]}>
                  <Input
                    prefix={<MailOutlined style={{ color: 'var(--text-tertiary)' }} />}
                    placeholder="邮箱"
                    style={{ height: 44 }}
                  />
                </Form.Item>
                <Form.Item name="emailCaptcha" rules={[{ required: true, message: '请输入验证码' }]}>
                  <Space style={{ width: '100%' }} size={8}>
                    <Input
                      prefix={<SafetyOutlined style={{ color: 'var(--text-tertiary)' }} />}
                      placeholder="验证码"
                      style={{ flex: 1, height: 44 }}
                    />
                    <Button style={{ height: 44 }}>获取验证码</Button>
                  </Space>
                </Form.Item>
              </>
            )}
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Checkbox>记住我</Checkbox>
                <a style={{ fontSize: 13, color: 'var(--accent)' }}>忘记密码？</a>
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 44,
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(79,70,229,0.25)',
                }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
