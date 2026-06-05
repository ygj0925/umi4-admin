import React, { useState, useRef } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Space, Tag, Modal, message, Popconfirm, Card, Row, Col, Image, Upload } from 'antd'
import { UploadOutlined, FolderOutlined, FileOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons'
import { listFile, deleteFile, uploadFile, getFileStatistics } from '@/services/system/file'
import { formatFileSize } from '@/utils/index'

export default function FilePage() {
  const actionRef = useRef<ActionType>()
  const [stats, setStats] = useState<any>(null)

  const columns: ProColumns[] = [
    { title: '文件名', dataIndex: 'originalName', ellipsis: true },
    { title: '类型', dataIndex: 'extension', width: 80,
      render: (_, record) => <Tag>{record.extension || (record.type === 1 ? '文件夹' : '文件')}</Tag>,
    },
    { title: '大小', dataIndex: 'size', width: 100, render: (_, record) => formatFileSize(record.size) },
    { title: '存储', dataIndex: 'storageName', width: 100 },
    { title: '上传时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', valueType: 'option', width: 180,
      render: (_, record) => [
        record.type !== 1 && <Button key="preview" type="link" size="small" icon={<EyeOutlined />} onClick={() => window.open(record.url)}>预览</Button>,
        record.type !== 1 && <Button key="download" type="link" size="small" icon={<DownloadOutlined />} onClick={() => window.open(record.url)}>下载</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  const handleDelete = async (id: string) => {
    await deleteFile([id])
    message.success('删除成功')
    actionRef.current?.reload()
  }

  return (
    <ProTable
      headerTitle="文件管理"
      actionRef={actionRef}
      rowKey="id"
      columns={columns}
      request={async (params) => {
        const { current, pageSize, ...rest } = params
        const res = await listFile({ page: current, size: pageSize, ...rest })
        return { data: res.data?.list || [], total: res.data?.total || 0, success: true }
      }}
      pagination={{ defaultPageSize: 10 }}
      search={{ labelWidth: 'auto' }}
      toolBarRender={() => [
        <Upload key="upload" showUploadList={false} customRequest={async ({ file }) => {
          const formData = new FormData()
          formData.append('file', file)
          await uploadFile(formData)
          message.success('上传成功')
          actionRef.current?.reload()
        }}>
          <Button type="primary" icon={<UploadOutlined />}>上传文件</Button>
        </Upload>,
      ]}
    />
  )
}
