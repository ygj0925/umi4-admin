import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, List, Tag, Avatar, Space, Button } from 'antd'
import { ProjectOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, BellOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { history } from 'umi'
import { useUserStore } from '@/stores/useUserStore'
import { goodTimeText } from '@/utils/index'
import { listDashboardNotice } from '@/services/dashboard'

export default function WorkplacePage() {
  const { userInfo } = useUserStore()
  const [notices, setNotices] = useState<any[]>([])

  useEffect(() => {
    listDashboardNotice().then((res) => setNotices(res.data || [])).catch(() => {})
  }, [])

  const statItems = [
    { title: '待办任务', value: 0, icon: <ClockCircleOutlined />, color: '#F59E0B' },
    { title: '进行中', value: 0, icon: <ProjectOutlined />, color: '#3B82F6' },
    { title: '已完成', value: 0, icon: <CheckCircleOutlined />, color: '#10B981' },
  ]

  const quickActions = [
    { label: '任务管理', path: '/dashboard/task' },
    { label: '任务驾驶舱', path: '/dashboard/cockpit' },
    { label: '用户管理', path: '/system/user' },
    { label: '公告管理', path: '/system/notice' },
  ]

  return (
    <div>
      {/* Welcome Card */}
      <Card
        style={{ marginBottom: 16, overflow: 'hidden' }}
        styles={{ body: { padding: '24px 24px 20px' } }}
      >
        <Row align="middle" gutter={24}>
          <Col flex="none">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              src={userInfo?.avatar}
              style={{
                background: 'var(--accent-light, #EEF2FF)',
                color: 'var(--accent, #4F46E5)',
                border: '2px solid var(--border-secondary)',
              }}
            />
          </Col>
          <Col flex="1">
            <h2 style={{
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 4,
              color: 'var(--text-primary)',
              letterSpacing: '-0.3px',
            }}>
              {goodTimeText()}，{userInfo?.nickname || userInfo?.username}
            </h2>
            <p style={{
              color: 'var(--text-tertiary)',
              margin: 0,
              fontSize: 14,
            }}>
              {userInfo?.deptName || '企业级后台管理系统'}
            </p>
          </Col>
        </Row>

        {/* Stats */}
        <Row gutter={16} style={{ marginTop: 20 }}>
          {statItems.map((item) => (
            <Col key={item.title} xs={8}>
              <div style={{
                padding: '12px 16px',
                borderRadius: 8,
                background: 'var(--bg-page)',
                border: '1px solid var(--border-secondary)',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                }}>
                  <span style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: `${item.color}14`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    fontSize: 14,
                  }}>
                    {item.icon}
                  </span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{item.title}</span>
                </div>
                <div style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.5px',
                }}>
                  {item.value}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={16}>
        {/* Quick Actions + Activity */}
        <Col xs={24} lg={16}>
          <Card
            title="快速操作"
            style={{ marginBottom: 16 }}
            styles={{ body: { padding: '16px 24px' } }}
          >
            <Space wrap size={8}>
              {quickActions.map((action) => (
                <Button
                  key={action.path}
                  onClick={() => history.push(action.path)}
                  style={{ borderRadius: 6 }}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          </Card>
          <Card
            title="项目动态"
            styles={{ body: { padding: '8px 24px' } }}
          >
            <List
              dataSource={[]}
              locale={{ emptyText: '暂无动态' }}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta title={item.title} description={item.time} />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Notices */}
        <Col xs={24} lg={8}>
          <Card
            title="公告通知"
            extra={
              <a
                onClick={() => history.push('/user/notice')}
                style={{ color: 'var(--accent)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                更多 <ArrowRightOutlined style={{ fontSize: 11 }} />
              </a>
            }
            styles={{ body: { padding: '8px 24px' } }}
          >
            <List
              dataSource={notices.slice(0, 5)}
              locale={{ emptyText: '暂无公告' }}
              renderItem={(item: any) => (
                <List.Item style={{ padding: '10px 0' }}>
                  <List.Item.Meta
                    avatar={
                      <span style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: 'var(--accent-light, #EEF2FF)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent, #4F46E5)',
                        fontSize: 14,
                      }}>
                        <BellOutlined />
                      </span>
                    }
                    title={
                      <a
                        onClick={() => history.push(`/user/notice?id=${item.id}`)}
                        style={{ color: 'var(--text-primary)', fontSize: 13 }}
                      >
                        {item.title}
                      </a>
                    }
                    description={item.isTop && <Tag color="red" style={{ fontSize: 11 }}>置顶</Tag>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
