import React, { useState, useEffect, useMemo } from 'react'
import { Card, Row, Col, Statistic, Spin } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { useAppStore } from '@/stores/useAppStore'
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

// ─── Chart Color Palette ───────────────────────────────────────
const CHART_COLORS = {
  light: {
    primary: '#4F46E5',
    primaryLight: '#818CF8',
    secondary: '#10B981',
    secondaryLight: '#6EE7B7',
    accent: '#6366F1',
    accentLight: '#A5B4FC',
    text: '#18181B',
    textSecondary: '#71717A',
    border: '#E4E4E7',
    bg: '#FFFFFF',
    area1: 'rgba(79,70,229,0.12)',
    area2: 'rgba(16,185,129,0.12)',
  },
  dark: {
    primary: '#818CF8',
    primaryLight: '#A5B4FC',
    secondary: '#34D399',
    secondaryLight: '#6EE7B7',
    accent: '#A5B4FC',
    accentLight: '#C7D2FE',
    text: '#E4E4E7',
    textSecondary: '#A1A1AA',
    border: 'rgba(255,255,255,0.08)',
    bg: '#1A1A2E',
    area1: 'rgba(129,140,248,0.15)',
    area2: 'rgba(52,211,153,0.15)',
  },
}

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
  const appTheme = useAppStore((s) => s.theme)
  const isDark = appTheme === 'dark'
  const colors = isDark ? CHART_COLORS.dark : CHART_COLORS.light

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

  const trendOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textStyle: { color: colors.text, fontSize: 12 },
    },
    legend: {
      data: ['PV', 'IP'],
      textStyle: { color: colors.textSecondary, fontSize: 12 },
      right: 0,
      top: 0,
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: 40, containLabel: true },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: trendData?.dates || trendData?.map((d: any) => d.date) || [],
      axisLine: { lineStyle: { color: colors.border } },
      axisLabel: { color: colors.textSecondary, fontSize: 11 },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: colors.border, type: 'dashed' as const } },
      axisLabel: { color: colors.textSecondary, fontSize: 11 },
    },
    series: [
      {
        name: 'PV',
        type: 'line' as const,
        smooth: true,
        data: trendData?.pvList || trendData?.map((d: any) => d.pv) || [],
        lineStyle: { width: 2, color: colors.primary },
        areaStyle: { color: colors.area1 },
        itemStyle: { color: colors.primary },
        symbol: 'circle',
        symbolSize: 4,
      },
      {
        name: 'IP',
        type: 'line' as const,
        smooth: true,
        data: trendData?.ipList || trendData?.map((d: any) => d.ip) || [],
        lineStyle: { width: 2, color: colors.secondary },
        areaStyle: { color: colors.area2 },
        itemStyle: { color: colors.secondary },
        symbol: 'circle',
        symbolSize: 4,
      },
    ],
  }), [trendData, colors])

  const geoOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textStyle: { color: colors.text, fontSize: 12 },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: 12, containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: (geoData || []).map((d: any) => d.name || d.region),
      axisLine: { lineStyle: { color: colors.border } },
      axisLabel: { color: colors.textSecondary, fontSize: 11 },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: colors.border, type: 'dashed' as const } },
      axisLabel: { color: colors.textSecondary, fontSize: 11 },
    },
    series: [{
      type: 'bar' as const,
      data: (geoData || []).map((d: any) => d.value || d.count),
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: colors.primary }, { offset: 1, color: colors.primaryLight }],
        },
      },
      barWidth: '40%',
    }],
  }), [geoData, colors])

  const timeslotOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textStyle: { color: colors.text, fontSize: 12 },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: 12, containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: (timeslotData || []).map((d: any) => d.hour !== undefined ? `${d.hour}:00` : d.name),
      axisLine: { lineStyle: { color: colors.border } },
      axisLabel: { color: colors.textSecondary, fontSize: 11 },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: colors.border, type: 'dashed' as const } },
      axisLabel: { color: colors.textSecondary, fontSize: 11 },
    },
    series: [{
      type: 'bar' as const,
      data: (timeslotData || []).map((d: any) => d.value || d.count),
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#8B5CF6' }, { offset: 1, color: '#A78BFA' }],
        },
      },
      barWidth: '40%',
    }],
  }), [timeslotData, colors])

  const osOption = useMemo(() => ({
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textStyle: { color: colors.text, fontSize: 12 },
    },
    legend: {
      orient: 'vertical' as const,
      left: 'left',
      textStyle: { color: colors.textSecondary, fontSize: 11 },
    },
    color: [colors.primary, colors.secondary, '#F59E0B', '#EF4444', '#8B5CF6'],
    series: [{
      type: 'pie' as const,
      radius: ['42%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: colors.bg, borderWidth: 2 },
      label: { show: false, position: 'center' as const },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' as const, color: colors.text } },
      labelLine: { show: false },
      data: (osData || []).map((d: any) => ({ name: d.name || d.os, value: d.value || d.count })),
    }],
  }), [osData, colors])

  const browserOption = useMemo(() => ({
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textStyle: { color: colors.text, fontSize: 12 },
    },
    legend: {
      orient: 'vertical' as const,
      left: 'left',
      textStyle: { color: colors.textSecondary, fontSize: 11 },
    },
    color: [colors.primary, '#10B981', '#F59E0B', '#EF4444', '#06B6D4'],
    series: [{
      type: 'pie' as const,
      radius: ['42%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: colors.bg, borderWidth: 2 },
      label: { show: false, position: 'center' as const },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' as const, color: colors.text } },
      labelLine: { show: false },
      data: (browserData || []).map((d: any) => ({ name: d.name || d.browser, value: d.value || d.count })),
    }],
  }), [browserData, colors])

  const moduleOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textStyle: { color: colors.text, fontSize: 12 },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: 12, containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: (moduleData || []).map((d: any) => d.name || d.module),
      axisLine: { lineStyle: { color: colors.border } },
      axisLabel: { color: colors.textSecondary, fontSize: 11 },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: colors.border, type: 'dashed' as const } },
      axisLabel: { color: colors.textSecondary, fontSize: 11 },
    },
    series: [{
      type: 'bar' as const,
      data: (moduleData || []).map((d: any) => d.value || d.count),
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#06B6D4' }, { offset: 1, color: '#67E8F9' }],
        },
      },
      barWidth: '40%',
    }],
  }), [moduleData, colors])

  return (
    <Spin spinning={loading}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Card styles={{ body: { padding: '20px 24px' } }}>
            <Statistic
              title={<span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>今日 PV</span>}
              value={pvData?.today || 0}
              suffix={
                <span style={{ fontSize: 13, color: pvData?.growth >= 0 ? '#10B981' : '#EF4444' }}>
                  {pvData?.growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{' '}
                  {Math.abs(pvData?.growth || 0)}%
                </span>
              }
              prefix={<EyeOutlined style={{ color: 'var(--accent, #4F46E5)' }} />}
              valueStyle={{ fontWeight: 700, letterSpacing: '-0.5px' }}
            />
            <div style={{ color: 'var(--text-tertiary)', marginTop: 6, fontSize: 12 }}>
              总 PV: {pvData?.total || 0}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card styles={{ body: { padding: '20px 24px' } }}>
            <Statistic
              title={<span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>今日 IP</span>}
              value={ipData?.today || 0}
              suffix={
                <span style={{ fontSize: 13, color: ipData?.growth >= 0 ? '#10B981' : '#EF4444' }}>
                  {ipData?.growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{' '}
                  {Math.abs(ipData?.growth || 0)}%
                </span>
              }
              prefix={<UserOutlined style={{ color: '#10B981' }} />}
              valueStyle={{ fontWeight: 700, letterSpacing: '-0.5px' }}
            />
            <div style={{ color: 'var(--text-tertiary)', marginTop: 6, fontSize: 12 }}>
              总 IP: {ipData?.total || 0}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card title={<span style={{ fontWeight: 600 }}>PV / IP 趋势（近30天）</span>}>
            <ReactECharts option={trendOption} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <Card title={<span style={{ fontWeight: 600 }}>访问时段分析</span>}>
            <ReactECharts option={timeslotOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<span style={{ fontWeight: 600 }}>模块分析</span>}>
            <ReactECharts option={moduleOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={8}>
          <Card title={<span style={{ fontWeight: 600 }}>终端分析</span>}>
            <ReactECharts option={osOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<span style={{ fontWeight: 600 }}>浏览器分析</span>}>
            <ReactECharts option={browserOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<span style={{ fontWeight: 600 }}>地域分析</span>}>
            <ReactECharts option={geoOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </Spin>
  )
}
