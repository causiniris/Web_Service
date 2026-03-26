import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Badge, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  MobileOutlined,
  LineChartOutlined,
  TeamOutlined,
  SettingOutlined,
  WechatOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '大盘概览' },
  { key: '/devices', icon: <MobileOutlined />, label: '设备管理' },
  { key: '/data-center', icon: <LineChartOutlined />, label: '数据图表中心' },
  { key: '/users', icon: <TeamOutlined />, label: '用户权限' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
  { key: '/miniprogram', icon: <WechatOutlined />, label: '小程序调整' },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{ position: 'relative' }}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1e293b' }}>
          <ThunderboltOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: collapsed ? 0 : 10 }} />
          {!collapsed && (
            <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap' }}>
              智能护膝管理平台
            </Text>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
        {!collapsed && (
          <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, padding: 12, background: '#1e293b', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge status="processing" color="#10b981" />
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>系统运行正常</Text>
            </div>
            <Text style={{ color: '#64748b', fontSize: 11 }}>v1.0.0 · 2026-03-25</Text>
          </div>
        )}
      </Sider>
      <Layout>
        <Header style={{ background: '#111827', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {collapsed ? (
              <MenuUnfoldOutlined onClick={() => setCollapsed(false)} style={{ color: '#94a3b8', fontSize: 18, cursor: 'pointer' }} />
            ) : (
              <MenuFoldOutlined onClick={() => setCollapsed(true)} style={{ color: '#94a3b8', fontSize: 18, cursor: 'pointer' }} />
            )}
            <div style={{ background: '#1e293b', borderRadius: 6, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge status="processing" color="#10b981" />
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>4 台设备在线</Text>
            </div>
          </div>
          <Space size={20}>
            <Badge count={3} size="small">
              <BellOutlined style={{ color: '#94a3b8', fontSize: 18, cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ background: '#1890ff' }} icon={<UserOutlined />} />
                <Text style={{ color: '#e2e8f0' }}>管理员</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ padding: 24, overflow: 'auto', background: '#0a0e1a' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
