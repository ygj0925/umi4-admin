import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, List, Tag, Avatar, Space, Button } from 'antd'
import { ProjectOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, BellOutlined, UserOutlined } from '@ant-design/icons'
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

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle" gutter={24}>
          <Col>
            <Avatar size={72} icon={<UserOutlined />} src={userInfo?.avatar} />
          </Col>
          <Col flex="1">
            <h2 style={{ marginBottom: 4 }}>{goodTimeText()}，{userInfo?.nickname || userInfo?.username}</h2>
            <p style={{ color: '#999', margin: 0 }}>{userInfo?.deptName || '企业级后台管理系统'}</p>
          </Col>
          <Col>
            <Space>
              <Statistic title="待办任务" value={0} prefix={<ClockCircleOutlined />} />
              <Statistic title="进行中" value={0} prefix={<ProjectOutlined />} />
              <Statistic title="已完成" value={0} prefix={<CheckCircleOutlined />} />
            </Space>
          </Col>
        </Row>
      </Card>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="快速操作" style={{ marginBottom: 16 }}>
            <Space wrap>
              <Button onClick={() => history.push('/dashboard/task')}>任务管理</Button>
              <Button onClick={() => history.push('/dashboard/cockpit')}>任务驾驶舱</Button>
              <Button onClick={() => history.push('/system/user')}>用户管理</Button>
              <Button onClick={() => history.push('/system/notice')}>公告管理</Button>
            </Space>
          </Card>
          <Card title="项目动态">
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
        <Col span={8}>
          <Card title="公告通知" extra={<a onClick={() => history.push('/user/notice')}>更多</a>}>
            <List
              dataSource={notices.slice(0, 5)}
              locale={{ emptyText: '暂无公告' }}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<BellOutlined />}
                    title={<a onClick={() => history.push(`/user/notice?id=${item.id}`)}>{item.title}</a>}
                    description={item.isTop && <Tag color="red">置顶</Tag>}
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
