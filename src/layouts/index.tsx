import React, { useState, useEffect } from 'react'
import { Outlet, history, useLocation } from 'umi'
import { Layout, Menu, Dropdown, Avatar, Breadcrumb, Tabs, Button, Space, Badge, Tooltip, theme } from 'antd'
import {
  MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined,
  SettingOutlined, BellOutlined, DashboardOutlined, TeamOutlined,
  MenuOutlined, ApartmentOutlined, BookOutlined, SoundOutlined,
  FolderOutlined, SafetyOutlined, CloudOutlined, CodeOutlined,
  ScheduleOutlined, ApiOutlined, ShopOutlined,
  SunOutlined, MoonOutlined,
} from '@ant-design/icons'
import { useAppStore } from '@/stores/useAppStore'
import { useUserStore } from '@/stores/useUserStore'
import { useTabsStore } from '@/stores/useTabsStore'
import { SIDEBAR, LAYOUT } from '@/constants/theme'
import type { MenuProps } from 'antd'

const { Sider, Header, Content } = Layout

const menuItems: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
    children: [
      { key: '/dashboard/workplace', label: '工作台' },
      { key: '/dashboard/analysis', label: '分析页' },
      { key: '/dashboard/cockpit', label: '任务驾驶舱' },
      { key: '/dashboard/task', label: '任务管理' },
      { key: '/dashboard/category', label: '任务分类' },
      { key: '/dashboard/project-schedule', label: '项目进度' },
      { key: '/dashboard/resource-board', label: '资源看板' },
    ],
  },
  {
    key: '/system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: '/system/user', label: '用户管理' },
      { key: '/system/role', label: '角色管理' },
      { key: '/system/menu', label: '菜单管理' },
      { key: '/system/dept', label: '部门管理' },
      { key: '/system/dict', label: '字典管理' },
      { key: '/system/notice', label: '公告管理' },
      { key: '/system/file', label: '文件管理' },
      {
        key: '/system/config',
        label: '系统配置',
        children: [
          { key: '/system/config/site', label: '站点配置' },
          { key: '/system/config/login', label: '登录配置' },
          { key: '/system/config/security', label: '安全配置' },
          { key: '/system/config/mail', label: '邮件配置' },
          { key: '/system/config/storage', label: '存储配置' },
          { key: '/system/config/sms', label: '短信配置' },
          { key: '/system/config/client', label: '客户端配置' },
        ],
      },
    ],
  },
  {
    key: '/monitor',
    icon: <FolderOutlined />,
    label: '系统监控',
    children: [
      { key: '/monitor/log/login', label: '登录日志' },
      { key: '/monitor/log/operation', label: '操作日志' },
      { key: '/monitor/online', label: '在线用户' },
      { key: '/monitor/sms/log', label: '短信日志' },
    ],
  },
  {
    key: '/schedule',
    icon: <ScheduleOutlined />,
    label: '任务调度',
    children: [
      { key: '/schedule/job', label: '任务管理' },
      { key: '/schedule/log', label: '任务日志' },
    ],
  },
  { key: '/open/app', icon: <ApiOutlined />, label: '开放接口' },
  {
    key: '/tenant',
    icon: <ShopOutlined />,
    label: '租户管理',
    children: [
      { key: '/tenant/management', label: '租户管理' },
      { key: '/tenant/package', label: '租户套餐' },
    ],
  },
  { key: '/code/generator', icon: <CodeOutlined />, label: '代码生成' },
]

function findMenuLabel(items: any[], path: string): string {
  for (const item of items) {
    if (item.key === path) return item.label
    if (item.children) {
      const label = findMenuLabel(item.children, path)
      if (label) return label
    }
  }
  return ''
}

function getBreadcrumbItems(pathname: string) {
  const pathSnippets = pathname.split('/').filter((i) => i)
  const items = [{ title: '首页', href: '/' }]
  let currentPath = ''
  pathSnippets.forEach((snippet) => {
    currentPath += `/${snippet}`
    const label = findMenuLabel(menuItems, currentPath)
    if (label) {
      items.push({ title: label })
    }
  })
  return items
}

export default function MainLayout() {
  const location = useLocation()
  const { menuCollapse, setMenuCollapse, theme: appTheme, toggleTheme } = useAppStore()
  const { userInfo, logout } = useUserStore()
  const { tabList, addTabItem, closeCurrent, closeOther, closeAll } = useTabsStore()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const { token: themeToken } = theme.useToken()

  const isDark = appTheme === 'dark'

  useEffect(() => {
    const path = location.pathname
    setSelectedKeys([path])
    const label = findMenuLabel(menuItems, path)
    if (label) {
      addTabItem({ path, title: label, closable: path !== '/dashboard/workplace' })
    }
    const pathSnippets = path.split('/').filter((i) => i)
    if (pathSnippets.length > 1) {
      setOpenKeys([`/${pathSnippets[0]}`])
    }
  }, [location.pathname])

  const handleMenuClick = (info: { key: string }) => {
    history.push(info.key)
  }

  const handleTabChange = (key: string) => {
    history.push(key)
  }

  const handleTabEdit = (targetKey: any, action: 'remove') => {
    if (action === 'remove') {
      closeCurrent(targetKey as string)
      const remaining = tabList.filter((t) => t.path !== targetKey)
      if (remaining.length > 0) {
        history.push(remaining[remaining.length - 1].path)
      }
    }
  }

  const handleLogout = async () => {
    await logout()
    history.push('/login')
  }

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
    { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ]

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        history.push('/user/profile')
        break
      case 'logout':
        handleLogout()
        break
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ─── Sidebar ─────────────────────────────────────── */}
      <Sider
        trigger={null}
        collapsible
        collapsed={menuCollapse}
        width={SIDEBAR.width}
        collapsedWidth={SIDEBAR.collapsedWidth}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          background: SIDEBAR.darkBgGradient,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        {/* Brand */}
        <div style={{
          height: LAYOUT.headerHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: '-0.5px',
            flexShrink: 0,
          }}>
            S
          </div>
          {!menuCollapse && (
            <span style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: '-0.3px',
              whiteSpace: 'nowrap',
            }}>
              SSS Admin
            </span>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={menuCollapse ? [] : openKeys}
          onOpenChange={setOpenKeys}
          onClick={handleMenuClick}
          items={menuItems}
          style={{
            background: 'transparent',
            borderRight: 'none',
            marginTop: 4,
          }}
        />
      </Sider>

      {/* ─── Main Area ───────────────────────────────────── */}
      <Layout style={{
        marginLeft: menuCollapse ? SIDEBAR.collapsedWidth : SIDEBAR.width,
        transition: 'margin-left 0.2s cubic-bezier(0.2, 0, 0, 1)',
      }}>
        {/* Header */}
        <Header style={{
          padding: '0 20px',
          height: LAYOUT.headerHeight,
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-primary)',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          transition: 'background-color 0.3s, border-color 0.3s',
        }}>
          <Space size={4}>
            <Button
              type="text"
              icon={menuCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setMenuCollapse(!menuCollapse)}
              style={{ color: 'var(--text-secondary)', width: 36, height: 36 }}
            />
            <Breadcrumb
              items={getBreadcrumbItems(location.pathname)}
              style={{ marginLeft: 4 }}
            />
          </Space>

          <Space size={4}>
            {/* Theme Toggle */}
            <Tooltip title={isDark ? '切换亮色模式' : '切换暗色模式'}>
              <Button
                type="text"
                icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                style={{ color: 'var(--text-secondary)', width: 36, height: 36 }}
              />
            </Tooltip>

            {/* Notifications */}
            <Badge count={0} size="small" offset={[-2, 2]}>
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ color: 'var(--text-secondary)', width: 36, height: 36 }}
              />
            </Badge>

            {/* User Dropdown */}
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer', marginLeft: 4, padding: '4px 8px', borderRadius: 6 }}>
                <Avatar
                  size={28}
                  icon={<UserOutlined />}
                  src={userInfo?.avatar}
                  style={{ background: isDark ? '#4F46E5' : '#E0E7FF', color: isDark ? '#fff' : '#4F46E5' }}
                />
                <span style={{
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 500,
                  maxWidth: 80,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {userInfo?.nickname || userInfo?.username || 'Admin'}
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Tabs */}
        {tabList.length > 0 && (
          <div style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-secondary)',
            paddingLeft: 8,
            paddingRight: 8,
            transition: 'background-color 0.3s, border-color 0.3s',
          }}>
            <Tabs
              type="editable-card"
              hideAdd
              activeKey={location.pathname}
              onChange={handleTabChange}
              onEdit={handleTabEdit}
              size="small"
              style={{ marginBottom: 0 }}
              items={tabList.map((tab) => ({
                key: tab.path,
                label: tab.title,
                closable: tab.closable,
              }))}
            />
          </div>
        )}

        {/* Content */}
        <Content style={{
          margin: LAYOUT.pagePadding,
          padding: LAYOUT.cardPadding,
          background: 'var(--bg-page)',
          minHeight: 280,
          transition: 'background-color 0.3s',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
