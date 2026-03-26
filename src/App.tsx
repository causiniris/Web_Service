import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, ConfigProvider, theme } from 'antd';
import {
  DashboardOutlined,
  MobileOutlined,
  LineChartOutlined,
  TeamOutlined,
  SettingOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import Dashboard from './pages/Dashboard';
import DeviceManagement from './pages/DeviceManagement';
import DataCenter from './pages/DataCenter';
import UserPermission from './pages/UserPermission';
import SystemSettings from './pages/SystemSettings';
import MiniProgram from './pages/MiniProgram';

const { Sider, Header, Content } = Layout;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '大盘概览' },
  { key: '/devices', icon: <MobileOutlined />, label: '设备管理' },
  { key: '/data-center', icon: <LineChartOutlined />, label: '数据图表中心' },
  { key: '/users', icon: <TeamOutlined />, label: '用户权限' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
  { key: '/miniprogram', icon: <AppstoreOutlined />, label: '平台中枢' },
];

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { isDark } = useTheme();

  const bg = isDark ? '#0a0e1a' : '#f0f2f5';
  const cardBg = isDark ? '#111827' : '#ffffff';
  const border = isDark ? '#1e293b' : '#e2e8f0';
  const textPri = isDark ? '#e2e8f0' : '#1e293b';
  const textSec = isDark ? '#94a3b8' : '#64748b';
  const textMuted = isDark ? '#64748b' : '#94a3b8';

  return (
    <Layout style={{ height: '100vh', background: bg }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        trigger={null}
        style={{ background: cardBg, borderRight: `1px solid ${border}` }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          paddingLeft: collapsed ? 0 : 20,
          gap: 10,
          borderBottom: `1px solid ${border}`,
        }}>
          <ThunderboltOutlined style={{ fontSize: 22, color: '#1890ff' }} />
          {!collapsed && (
            <span style={{ color: textPri, fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>
              智能护膝管理平台
            </span>
          )}
        </div>
        <Menu
          theme={isDark ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', borderRight: 0 }}
        />
        {!collapsed && (
          <div style={{ position: 'absolute', bottom: 60, left: 16, right: 16, padding: 12, background: isDark ? '#1e293b' : '#f0f2f5', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ color: textSec, fontSize: 12 }}>系统运行正常</span>
            </div>
            <span style={{ color: textMuted, fontSize: 11 }}>v1.0.0 · 2026-03-25</span>
          </div>
        )}
      </Sider>
      <Layout>
        <Header style={{
          background: cardBg,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${border}`,
          height: 64,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: textSec, fontSize: 18, cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? '☰' : '✕'}
            </span>
            <div style={{ background: isDark ? '#1e293b' : '#f0f2f5', borderRadius: 6, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ color: textSec, fontSize: 13 }}>4 台设备在线</span>
            </div>
          </div>
        </Header>
        <Content style={{ padding: 24, overflow: 'auto', background: bg }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

function ThemedApp() {
  const { isDark } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: '#1890ff', borderRadius: 8 },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="devices" element={<DeviceManagement />} />
            <Route path="data-center" element={<DataCenter />} />
            <Route path="users" element={<UserPermission />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="miniprogram" element={<MiniProgram />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
