import React, { useState, useEffect } from 'react'
import { Card, Form, Input, Button, message, Space } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { listOption, updateOption } from '@/services/system/option'

export default function SiteConfigPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    const res = await listOption({ category: 'site' })
    const data = res.data || []
    const values: any = {}
    data.forEach((item: any) => { values[item.code] = item.value })
    form.setFieldsValue(values)
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    setLoading(true)
    try {
      const data = Object.entries(values).map(([code, value]) => ({ code, value }))
      await updateOption(data)
      message.success('保存成功')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="站点配置" extra={<Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave}>保存</Button>}>
      <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
        <Form.Item name="SITE_TITLE" label="站点标题"><Input /></Form.Item>
        <Form.Item name="SITE_DESCRIPTION" label="站点描述"><Input.TextArea rows={3} /></Form.Item>
        <Form.Item name="SITE_COPYRIGHT" label="版权信息"><Input /></Form.Item>
        <Form.Item name="SITE_BEIAN" label="备案号"><Input /></Form.Item>
      </Form>
    </Card>
  )
}
