import React from 'react'
import { message } from 'antd'
import { ProForm, ProFormSwitch } from '@ant-design/pro-components'
import { listOption, updateOption } from '@/services/system/option'

export default function LoginConfigPage() {
  const loadConfig = async () => {
    const res = await listOption({ category: 'login' })
    const data = res.data || []
    const values: any = {}
    data.forEach((item: any) => { values[item.code] = item.value === 'true' })
    return values
  }

  const handleSave = async (values: any) => {
    const data = Object.entries(values).map(([code, value]) => ({ code, value: String(value) }))
    await updateOption(data)
    message.success('保存成功')
  }

  return (
    <ProForm
      title="登录配置"
      layout="vertical"
      request={loadConfig}
      onFinish={handleSave}
      style={{ maxWidth: 600 }}
      submitter={{ searchConfig: { submitText: '保存' } }}
    >
      <ProFormSwitch name="LOGIN_CAPTCHA_ENABLED" label="启用验证码" />
    </ProForm>
  )
}
