import React, { useState, useEffect } from 'react'
import { Card, Form, Switch, Button, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { listOption, updateOption } from '@/services/system/option'

export default function LoginConfigPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    listOption({ category: 'login' }).then((res) => {
      const data = res.data || []
      const values: any = {}
      data.forEach((item: any) => { values[item.code] = item.value === 'true' })
      form.setFieldsValue(values)
    })
  }, [])

  const handleSave = async () => {
    const values = await form.validateFields()
    setLoading(true)
    try {
      const data = Object.entries(values).map(([code, value]) => ({ code, value: String(value) }))
      await updateOption(data)
      message.success('保存成功')
    } finally { setLoading(false) }
  }

  return (
    <Card title="登录配置" extra={<Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave}>保存</Button>}>
      <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
        <Form.Item name="LOGIN_CAPTCHA_ENABLED" label="启用验证码" valuePropName="checked"><Switch /></Form.Item>
      </Form>
    </Card>
  )
}
