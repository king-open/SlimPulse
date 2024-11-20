import React, { useState } from 'react'
import { Layout, Menu, theme, Button } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  ReadOutlined,
  SettingOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/dashboard', icon: <CalendarOutlined />, label: '打卡统计' },
    { key: '/profile', icon: <UserOutlined />, label: '个人中心' },
    { key: '/community', icon: <TeamOutlined />, label: '社区' },
    { key: '/knowledge', icon: <ReadOutlined />, label: '知识库' },
    { key: '/settings', icon: <SettingOutlined />, label: '设置' },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="h-16 m-4 bg-gray-700" /> {/* Logo */}
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header 
          style={{ 
            padding: '0 24px', 
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            size="large"
            onClick={() => navigate('/checkin')}
          >
            打卡
          </Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div 
            style={{ 
              padding: 24, 
              background: colorBgContainer,
              borderRadius: 8,
              minHeight: 'calc(100vh - 184px)',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout 
