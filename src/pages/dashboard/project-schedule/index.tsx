import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Progress, Space, Button, Input, Select, DatePicker } from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { listTaskItems } from '@/services/task'
import { STATUS_MAP, STATUS_COLOR_MAP, PRIORITY_COLOR_MAP } from '@/constants/task'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

export default function ProjectSchedulePage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const params: any = { page: 1, size: 100 }
      if (keyword) params.keyword = keyword
      if (statusFilter) params.status = [statusFilter]
      const res = await listTaskItems(params)
      setData(res.data?.list || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [statusFilter])

  const columns = [
    { title: '编号', dataIndex: 'code', width: 120 },
    { title: '任务名称', dataIndex: 'title', width: 200, ellipsis: true },
    {
      title: '状态', dataIndex: 'status', width: 100,
      render: (v: string) => <Tag color={STATUS_COLOR_MAP[v as keyof typeof STATUS_COLOR_MAP]}>{STATUS_MAP[v as keyof typeof STATUS_MAP]}</Tag>
    },
    {
      title: '优先级', dataIndex: 'priority', width: 80,
      render: (v: string) => <Tag color={PRIORITY_COLOR_MAP[v as keyof typeof PRIORITY_COLOR_MAP]}>{v}</Tag>
    },
    { title: '负责人', dataIndex: 'owners', width: 120, render: (v: any[]) => v?.map(o => o.nickname).join(', ') },
    { title: '分类', dataIndex: 'categories', width: 120, render: (v: any[]) => v?.map(c => c.name).join(', ') },
    { title: '开始日期', dataIndex: 'startDate', width: 120 },
    { title: '截止日期', dataIndex: 'dueDate', width: 120 },
    {
      title: '进度', width: 120,
      render: (_: any, record: any) => {
        const statusProgress: Record<string, number> = { pending: 0, in_progress: 50, submitted: 80, completed: 100, at_risk: 40, blocked: 30 }
        return <Progress percent={statusProgress[record.status] || 0} size="small" />
      }
    },
  ]

  return (
    <Card title="项目进度表" extra={
      <Space>
        <Input placeholder="搜索任务" prefix={<SearchOutlined />} value={keyword} onChange={e => setKeyword(e.target.value)} onPressEnter={fetchData} allowClear style={{ width: 200 }} />
        <Select placeholder="状态筛选" allowClear style={{ width: 120 }} value={statusFilter || undefined} onChange={v => setStatusFilter(v || '')}
          options={Object.entries(STATUS_MAP).map(([k, v]) => ({ label: v, value: k }))} />
        <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
      </Space>
    }>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" scroll={{ x: 1200 }} pagination={{ pageSize: 20, showSizeChanger: true, showTotal: t => `共 ${t} 条` }} />
    </Card>
  )
}
