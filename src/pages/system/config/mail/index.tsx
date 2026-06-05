import React, { useState, useEffect } from 'react'
import { Card, Form, Input, InputNumber, Switch, Button, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { listOption, updateOption } from '@/services/system/option'

export default function MailConfigPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    listOption({ category: 'mail' }).then((res) => {
      const data = res.data || []
      const values: any = {}
      data.forEach((item: any) => { values[item.code] = item.value })
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
    <Card title="邮件配置" extra={<Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave}>保存</Button>}>
      <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
        <Form.Item name="MAIL_PROTOCOL" label="协议"><Input /></Form.Item>
        <Form.Item name="MAIL_HOST" label="主机"><Input /></Form.Item>
        <Form.Item name="MAIL_PORT" label="端口"><Input /></Form.Item>
        <Form.Item name="MAIL_USERNAME" label="用户名"><Input /></Form.Item>
        <Form.Item name="MAIL_PASSWORD" label="密码"><Input.Password /></Form.Item>
      </Form>
    </Card>
  )
}
