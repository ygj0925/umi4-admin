import React, { useState, useEffect } from 'react'
import { Outlet, history, useLocation } from 'umi'
import { Layout, Menu, Dropdown, Avatar, Breadcrumb, Tabs, Button, theme, Space, Badge } from 'antd'
import {
  MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined,
  SettingOutlined, BellOutlined, DashboardOutlined, TeamOutlined,
  MenuOutlined, ApartmentOutlined, BookOutlined, SoundOutlined,
  FolderOutlined, SafetyOutlined, CloudOutlined, CodeOutlined,
  ScheduleOutlined, ApiOutlined, ShopOutlined,
} from '@ant-design/icons'
import { useAppStore } from '@/stores/useAppStore'
import { useUserStore } from '@/stores/useUserStore'
import { useTabsStore } from '@/stores/useTabsStore'
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
  const { menuCollapse, setMenuCollapse } = useAppStore()
  const { userInfo, logout } = useUserStore()
  const { tabList, addTabItem, closeCurrent, closeOther, closeAll } = useTabsStore()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const { token: themeToken } = theme.useToken()

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
      <Sider
        trigger={null}
        collapsible
        collapsed={menuCollapse}
        width={220}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: menuCollapse ? 16 : 20,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          {menuCollapse ? 'SSS' : 'SSS Admin'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={menuCollapse ? [] : openKeys}
          onOpenChange={setOpenKeys}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginLeft: menuCollapse ? 80 : 220, transition: 'margin-left 0.2s' }}>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 99,
        }}>
          <Space>
            <Button
              type="text"
              icon={menuCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setMenuCollapse(!menuCollapse)}
            />
            <Breadcrumb items={getBreadcrumbItems(location.pathname)} />
          </Space>
          <Space size={16}>
            <Badge count={0} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} src={userInfo?.avatar} />
                <span>{userInfo?.nickname || userInfo?.username || 'Admin'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        {tabList.length > 0 && (
          <Tabs
            type="editable-card"
            hideAdd
            activeKey={location.pathname}
            onChange={handleTabChange}
            onEdit={handleTabEdit}
            style={{ background: '#fff', paddingLeft: 12, paddingRight: 12 }}
            items={tabList.map((tab) => ({
              key: tab.path,
              label: tab.title,
              closable: tab.closable,
            }))}
          />
        )}
        <Content style={{ margin: 16, padding: 24, background: '#f5f5f5', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
