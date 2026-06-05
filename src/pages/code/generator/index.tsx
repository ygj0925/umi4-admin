import React, { useState, useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, Modal, message, Drawer, Tabs } from 'antd'
import { CodeOutlined, DownloadOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons'
import { listGenConfig, genPreview, downloadCode, generateCode } from '@/services/code/generator'

export default function CodeGeneratorPage() {
  const actionRef = useRef<ActionType>()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])

  const columns: ProColumns[] = [
    { title: '表名', dataIndex: 'tableName' },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    { title: '引擎', dataIndex: 'engine', width: 100, search: false },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 200,
      render: (_, record) => [
        <Button key="preview" type="link" size="small" icon={<EyeOutlined />} onClick={async () => {
          const res = await genPreview([record.tableName])
          setPreviewData(res.data || [])
          setPreviewOpen(true)
        }}>预览</Button>,
        <Button key="download" type="link" size="small" icon={<DownloadOutlined />} onClick={async () => {
          await downloadCode([record.tableName])
          message.success('下载成功')
        }}>下载</Button>,
      ],
    },
  ]

  return (
    <>
      <ProTable headerTitle="代码生成" actionRef={actionRef} rowKey="tableName" columns={columns}
        request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listGenConfig({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
        pagination={{ defaultPageSize: 10 }} search={false}
        rowSelection={{ selectedRowKeys: selectedRows, onChange: (keys) => setSelectedRows(keys as string[]) }}
        toolBarRender={() => [
          <Button key="batch" type="primary" icon={<CodeOutlined />} disabled={!selectedRows.length} onClick={async () => {
            await generateCode(selectedRows)
            message.success('生成成功')
          }}>批量生成</Button>,
          <Button key="batchDownload" icon={<DownloadOutlined />} disabled={!selectedRows.length} onClick={async () => {
            await downloadCode(selectedRows)
            message.success('下载成功')
          }}>批量下载</Button>,
        ]}
      />
      <Drawer title="代码预览" open={previewOpen} onClose={() => setPreviewOpen(false)} width={800}>
        <Tabs items={previewData.map((item, i) => ({
          key: String(i),
          label: item.fileName,
          children: <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, overflow: 'auto', maxHeight: 600 }}>{item.content}</pre>,
        }))} />
      </Drawer>
    </>
  )
}
