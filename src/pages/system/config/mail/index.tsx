import React from 'react'
import { message } from 'antd'
import { ProForm, ProFormText, ProFormDigit } from '@ant-design/pro-components'
import { listOption, updateOption } from '@/services/system/option'

export default function MailConfigPage() {
  const loadConfig = async () => {
    const res = await listOption({ category: 'mail' })
    const data = res.data || []
    const values: any = {}
    data.forEach((item: any) => { values[item.code] = item.value })
    return values
  }

  const handleSave = async (values: any) => {
    const data = Object.entries(values).map(([code, value]) => ({ code, value: String(value) }))
    await updateOption(data)
    message.success('保存成功')
  }

  return (
    <ProForm
      title="邮件配置"
      layout="vertical"
      request={loadConfig}
      onFinish={handleSave}
      style={{ maxWidth: 600 }}
      submitter={{ searchConfig: { submitText: '保存' } }}
    >
      <ProFormText name="MAIL_PROTOCOL" label="协议" />
      <ProFormText name="MAIL_HOST" label="主机" />
      <ProFormDigit name="MAIL_PORT" label="端口" fieldProps={{ style: { width: '100%' } }} />
      <ProFormText name="MAIL_USERNAME" label="用户名" />
      <ProFormText.Password name="MAIL_PASSWORD" label="密码" />
    </ProForm>
  )
}
