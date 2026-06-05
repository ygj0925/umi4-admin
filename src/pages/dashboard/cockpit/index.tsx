import React from 'react'
import { Card, Tabs, Button, Space } from 'antd'
import { TableOutlined, AppstoreOutlined, BarChartOutlined } from '@ant-design/icons'

export default function CockpitPage() {
  return (
    <Card title="任务驾驶舱">
      <Tabs
        items={[
          { key: 'table', label: <span><TableOutlined /> 表格视图</span>, children: <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>表格视图 - 开发中</div> },
          { key: 'kanban', label: <span><AppstoreOutlined /> 看板视图</span>, children: <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>看板视图 - 开发中</div> },
          { key: 'gantt', label: <span><BarChartOutlined /> 甘特图</span>, children: <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>甘特图 - 开发中</div> },
        ]}
      />
    </Card>
  )
}
