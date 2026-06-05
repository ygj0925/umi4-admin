import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Spin } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons'
import { getDashboardOverviewPv, getDashboardOverviewIp, getAnalysisGeo, getAnalysisTimeslot, getAnalysisModule, getAnalysisOs, getAnalysisBrowser } from '@/services/dashboard'

export default function AnalysisPage() {
  const [pvData, setPvData] = useState<any>(null)
  const [ipData, setIpData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getDashboardOverviewPv().catch(() => ({ data: null })),
      getDashboardOverviewIp().catch(() => ({ data: null })),
    ]).then(([pv, ip]) => {
      setPvData(pv.data)
      setIpData(ip.data)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <Spin spinning={loading}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="今日 PV"
              value={pvData?.today || 0}
              suffix={<span style={{ fontSize: 14, color: pvData?.growth >= 0 ? '#3f8600' : '#cf1322' }}>
                {pvData?.growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(pvData?.growth || 0)}%
              </span>}
              prefix={<EyeOutlined />}
            />
            <div style={{ color: '#999', marginTop: 8 }}>总 PV: {pvData?.total || 0}</div>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="今日 IP"
              value={ipData?.today || 0}
              suffix={<span style={{ fontSize: 14, color: ipData?.growth >= 0 ? '#3f8600' : '#cf1322' }}>
                {ipData?.growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(ipData?.growth || 0)}%
              </span>}
              prefix={<UserOutlined />}
            />
            <div style={{ color: '#999', marginTop: 8 }}>总 IP: {ipData?.total || 0}</div>
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}><Card title="访问时段分析"><div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>图表组件待集成 ECharts</div></Card></Col>
        <Col span={12}><Card title="模块分析"><div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>图表组件待集成 ECharts</div></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}><Card title="终端分析"><div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>饼图待集成</div></Card></Col>
        <Col span={8}><Card title="浏览器分析"><div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>饼图待集成</div></Card></Col>
        <Col span={8}><Card title="地域分析"><div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>地图待集成</div></Card></Col>
      </Row>
    </Spin>
  )
}
