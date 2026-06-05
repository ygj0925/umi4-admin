import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Tag, Avatar, List, Space, Button, Empty } from 'antd'
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined, WarningOutlined, ReloadOutlined } from '@ant-design/icons'
import { getTaskStats, listTaskItems } from '@/services/task'
import { STATUS_MAP, STATUS_COLOR_MAP } from '@/constants/task'

export default function ResourceBoardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentTasks, setRecentTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, tasksRes] = await Promise.all([
        getTaskStats(),
        listTaskItems({ page: 1, size: 10, sort: ['updateTime,desc'] })
      ])
      setStats(statsRes.data)
      setRecentTasks(tasksRes.data?.list || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const ownerStats = recentTasks.reduce((acc: any, task: any) => {
    task.owners?.forEach((o: any) => {
      if (!acc[o.userId]) acc[o.userId] = { name: o.nickname, count: 0, tasks: [] }
      acc[o.userId].count++
      acc[o.userId].tasks.push(task)
    })
    return acc
  }, {})

  return (
    <div>
      <Card title="资源看板" extra={<Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>刷新</Button>} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={4}><Statistic title="总事项" value={stats?.total || 0} /></Col>
          <Col span={4}><Statistic title="进行中" value={stats?.byStatus?.in_progress || 0} valueStyle={{ color: '#1890ff' }} prefix={<ClockCircleOutlined />} /></Col>
          <Col span={4}><Statistic title="已完成" value={stats?.byStatus?.completed || 0} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} /></Col>
          <Col span={4}><Statistic title="有风险" value={stats?.byStatus?.at_risk || 0} valueStyle={{ color: '#faad14' }} prefix={<WarningOutlined />} /></Col>
          <Col span={4}><Statistic title="已阻塞" value={stats?.byStatus?.blocked || 0} valueStyle={{ color: '#ff4d4f' }} /></Col>
          <Col span={4}><Statistic title="已逾期" value={stats?.overdueCount || 0} valueStyle={{ color: '#ff4d4f' }} /></Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="负责人工作量分布">
            {Object.keys(ownerStats).length > 0 ? (
              <List
                dataSource={Object.values(ownerStats) as any[]}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />}>{item.name?.[0]}</Avatar>}
                      title={item.name}
                      description={`负责 ${item.count} 项任务`}
                    />
                    <Space>
                      {item.tasks.slice(0, 3).map((t: any) => (
                        <Tag key={t.id} color={STATUS_COLOR_MAP[t.status as keyof typeof STATUS_COLOR_MAP]}>{t.title?.slice(0, 8)}</Tag>
                      ))}
                    </Space>
                  </List.Item>
                )}
              />
            ) : <Empty description="暂无数据" />}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近更新任务">
            <List
              dataSource={recentTasks}
              renderItem={(task: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={<span>{task.title} <Tag color={STATUS_COLOR_MAP[task.status as keyof typeof STATUS_COLOR_MAP]}>{STATUS_MAP[task.status as keyof typeof STATUS_MAP]}</Tag></span>}
                    description={task.latestProgress || task.description || '暂无进展'}
                  />
                  <span style={{ color: '#999', fontSize: 12 }}>{task.updateTime}</span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
