import React from 'react'
import { message } from 'antd'
import { ProForm, ProFormDigit } from '@ant-design/pro-components'
import { listOption, updateOption } from '@/services/system/option'

export default function SecurityConfigPage() {
  const loadConfig = async () => {
    const res = await listOption({ category: 'security' })
    const data = res.data || []
    const values: any = {}
    data.forEach((item: any) => { values[item.code] = isNaN(Number(item.value)) ? item.value : Number(item.value) })
    return values
  }

  const handleSave = async (values: any) => {
    const data = Object.entries(values).map(([code, value]) => ({ code, value: String(value) }))
    await updateOption(data)
    message.success('保存成功')
  }

  return (
    <ProForm
      title="安全配置"
      layout="vertical"
      request={loadConfig}
      onFinish={handleSave}
      style={{ maxWidth: 600 }}
      submitter={{ searchConfig: { submitText: '保存' } }}
    >
      <ProFormDigit name="PASSWORD_ERROR_LOCK_COUNT" label="密码错误锁定次数" min={0} fieldProps={{ style: { width: '100%' } }} />
      <ProFormDigit name="PASSWORD_ERROR_LOCK_MINUTES" label="锁定时间(分钟)" min={0} fieldProps={{ style: { width: '100%' } }} />
      <ProFormDigit name="PASSWORD_EXPIRATION_DAYS" label="密码过期天数" min={0} fieldProps={{ style: { width: '100%' } }} />
      <ProFormDigit name="PASSWORD_MIN_LENGTH" label="密码最小长度" min={0} fieldProps={{ style: { width: '100%' } }} />
    </ProForm>
  )
}
