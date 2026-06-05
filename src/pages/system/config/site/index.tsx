import React from 'react'
import { message } from 'antd'
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { listOption, updateOption } from '@/services/system/option'

export default function SiteConfigPage() {
  const loadConfig = async () => {
    const res = await listOption({ category: 'site' })
    const data = res.data || []
    const values: any = {}
    data.forEach((item: any) => { values[item.code] = item.value })
    return values
  }

  const handleSave = async (values: any) => {
    const data = Object.entries(values).map(([code, value]) => ({ code, value }))
    await updateOption(data)
    message.success('保存成功')
  }

  return (
    <ProForm
      title="站点配置"
      layout="vertical"
      request={loadConfig}
      onFinish={handleSave}
      style={{ maxWidth: 600 }}
      submitter={{ searchConfig: { submitText: '保存' } }}
    >
      <ProFormText name="SITE_TITLE" label="站点标题" />
      <ProFormTextArea name="SITE_DESCRIPTION" label="站点描述" fieldProps={{ rows: 3 }} />
      <ProFormText name="SITE_COPYRIGHT" label="版权信息" />
      <ProFormText name="SITE_BEIAN" label="备案号" />
    </ProForm>
  )
}
