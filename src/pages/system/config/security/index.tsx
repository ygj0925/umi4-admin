import React, { useState, useEffect } from 'react'
import { Card, Form, InputNumber, Switch, Button, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { listOption, updateOption } from '@/services/system/option'

export default function SecurityConfigPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    listOption({ category: 'security' }).then((res) => {
      const data = res.data || []
      const values: any = {}
      data.forEach((item: any) => { values[item.code] = isNaN(Number(item.value)) ? item.value : Number(item.value) })
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
    <Card title="安全配置" extra={<Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave}>保存</Button>}>
      <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
        <Form.Item name="PASSWORD_ERROR_LOCK_COUNT" label="密码错误锁定次数"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="PASSWORD_ERROR_LOCK_MINUTES" label="锁定时间(分钟)"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="PASSWORD_EXPIRATION_DAYS" label="密码过期天数"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="PASSWORD_MIN_LENGTH" label="密码最小长度"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
      </Form>
    </Card>
  )
}
