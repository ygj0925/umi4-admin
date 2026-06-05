import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Spin } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import {
  getDashboardOverviewPv,
  getDashboardOverviewIp,
  getAnalysisGeo,
  getAnalysisTimeslot,
  getAnalysisModule,
  getAnalysisOs,
  getAnalysisBrowser,
  getDashboardAccessTrend,
} from '@/services/dashboard'

export default function AnalysisPage() {
  const [pvData, setPvData] = useState<any>(null)
  const [ipData, setIpData] = useState<any>(null)
  const [trendData, setTrendData] = useState<any>(null)
  const [geoData, setGeoData] = useState<any>(null)
  const [timeslotData, setTimeslotData] = useState<any>(null)
  const [moduleData, setModuleData] = useState<any>(null)
  const [osData, setOsData] = useState<any>(null)
  const [browserData, setBrowserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getDashboardOverviewPv().catch(() => ({ data: null })),
      getDashboardOverviewIp().catch(() => ({ data: null })),
      getDashboardAccessTrend(30).catch(() => ({ data: null })),
      getAnalysisGeo().catch(() => ({ data: null })),
      getAnalysisTimeslot().catch(() => ({ data: null })),
      getAnalysisModule().catch(() => ({ data: null })),
      getAnalysisOs().catch(() => ({ data: null })),
      getAnalysisBrowser().catch(() => ({ data: null })),
    ]).then(([pv, ip, trend, geo, timeslot, module, os, browser]) => {
      setPvData(pv.data)
      setIpData(ip.data)
      setTrendData(trend.data)
      setGeoData(geo.data)
      setTimeslotData(timeslot.data)
      setModuleData(module.data)
      setOsData(os.data)
      setBrowserData(browser.data)
    }).finally(() => setLoading(false))
  }, [])

  // PV/IP trend line chart
  const trendOption = {
    tooltip: { trigger: 'axis' as const },
    legend: { data: ['PV', 'IP'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: trendData?.dates || trendData?.map((d: any) => d.date) || [],
    },
    yAxis: { type: 'value' as const },
    series: [
      {
        name: 'PV',
        type: 'line' as const,
        smooth: true,
        data: trendData?.pvList || trendData?.map((d: any) => d.pv) || [],
        areaStyle: { opacity: 0.3 },
      },
      {
        name: 'IP',
        type: 'line' as const,
        smooth: true,
        data: trendData?.ipList || trendData?.map((d: any) => d.ip) || [],
        areaStyle: { opacity: 0.3 },
      },
    ],
  }

  // Geo distribution bar chart
  const geoOption = {
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category' as const, data: (geoData || []).map((d: any) => d.name || d.region) },
    yAxis: { type: 'value' as const },
    series: [
      {
        type: 'bar' as const,
        data: (geoData || []).map((d: any) => d.value || d.count),
        itemStyle: {
          color: {
            type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#1890ff' },
              { offset: 1, color: '#69c0ff' },
            ],
          },
        },
      },
    ],
  }

  // Timeslot bar chart
  const timeslotOption = {
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category' as const, data: (timeslotData || []).map((d: any) => d.hour !== undefined ? `${d.hour}:00` : d.name) },
    yAxis: { type: 'value' as const },
    series: [
      {
        type: 'bar' as const,
        data: (timeslotData || []).map((d: any) => d.value || d.count),
        itemStyle: {
          color: {
            type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#722ed1' },
              { offset: 1, color: '#b37feb' },
            ],
          },
        },
      },
    ],
  }

  // OS pie chart
  const osOption = {
    tooltip: { trigger: 'item' as const },
    legend: { orient: 'vertical' as const, left: 'left' },
    series: [
      {
        type: 'pie' as const,
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' as const },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' as const } },
        labelLine: { show: false },
        data: (osData || []).map((d: any) => ({ name: d.name || d.os, value: d.value || d.count })),
      },
    ],
  }

  // Browser pie chart
  const browserOption = {
    tooltip: { trigger: 'item' as const },
    legend: { orient: 'vertical' as const, left: 'left' },
    series: [
      {
        type: 'pie' as const,
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' as const },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' as const } },
        labelLine: { show: false },
        data: (browserData || []).map((d: any) => ({ name: d.name || d.browser, value: d.value || d.count })),
      },
    ],
  }

  // Module usage bar chart
  const moduleOption = {
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category' as const, data: (moduleData || []).map((d: any) => d.name || d.module) },
    yAxis: { type: 'value' as const },
    series: [
      {
        type: 'bar' as const,
        data: (moduleData || []).map((d: any) => d.value || d.count),
        itemStyle: {
          color: {
            type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#13c2c2' },
              { offset: 1, color: '#87e8de' },
            ],
          },
        },
      },
    ],
  }

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

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card title="PV / IP 趋势（近30天）">
            <ReactECharts option={trendOption} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="访问时段分析">
            <ReactECharts option={timeslotOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="模块分析">
            <ReactECharts option={moduleOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card title="终端分析">
            <ReactECharts option={osOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="浏览器分析">
            <ReactECharts option={browserOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="地域分析">
            <ReactECharts option={geoOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </Spin>
  )
}
