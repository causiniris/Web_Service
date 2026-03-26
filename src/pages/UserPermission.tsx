import { useState } from 'react';
import { Table, Tag, Button, Space, Input, Modal, Form, Switch, Card, Row, Col, Typography, Avatar, Tabs, Select, Divider } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  LockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import { users, permissions } from '../data/mockData';

const { Text, Title } = Typography;

export default function UserPermission() {
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.includes(searchText) || u.phone.includes(searchText);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleColors: Record<string, string> = {
    '管理员': '#ef4444', '康复医师': '#1890ff', 'VIP用户': '#f59e0b', '普通用户': '#10b981',
  };

  const statusColors: Record<string, string> = {
    active: '#10b981', inactive: '#64748b',
  };

  const userColumns = [
    {
      title: '用户', key: 'user',
      render: (_: unknown, record: typeof users[0]) => (
        <Space>
          <Avatar style={{ background: roleColors[record.role] || '#1890ff' }} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.phone}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '角色', dataIndex: 'role', key: 'role',
      render: (r: string) => <Tag color={roleColors[r]}>{r}</Tag>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => (
        <Tag color={statusColors[s]} icon={s === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {s === 'active' ? '活跃' : '停用'}
        </Tag>
      ),
    },
    {
      title: '绑定设备', dataIndex: 'devices', key: 'devices',
      render: (devices: string[]) => devices.length > 0
        ? devices.map(d => <Tag key={d} icon={<MobileOutlined />} color="blue">{d}</Tag>)
        : <Text type="secondary">-</Text>,
    },
    { title: '注册日期', dataIndex: 'registerDate', key: 'registerDate' },
    {
      title: '操作', key: 'action',
      render: () => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small">编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">删除</Button>
        </Space>
      ),
    },
  ];

  const permissionColumns = [
    { title: '权限名称', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '管理员', key: 'admin',
      render: (_: unknown, r: typeof permissions[0]) => (
        <Switch checked={r.admin} disabled size="small" />
      ),
    },
    {
      title: '康复医师', key: 'doctor',
      render: (_: unknown, r: typeof permissions[0]) => (
        <Switch checked={r.doctor} size="small" />
      ),
    },
    {
      title: 'VIP用户', key: 'vip',
      render: (_: unknown, r: typeof permissions[0]) => (
        <Switch checked={r.vip} size="small" />
      ),
    },
    {
      title: '普通用户', key: 'normal',
      render: (_: unknown, r: typeof permissions[0]) => (
        <Switch checked={r.normal} size="small" />
      ),
    },
  ];

  const roleStats = [
    { role: '管理员', count: users.filter(u => u.role === '管理员').length, color: '#ef4444' },
    { role: '康复医师', count: users.filter(u => u.role === '康复医师').length, color: '#1890ff' },
    { role: 'VIP用户', count: users.filter(u => u.role === 'VIP用户').length, color: '#f59e0b' },
    { role: '普通用户', count: users.filter(u => u.role === '普通用户').length, color: '#10b981' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>用户权限管理</h2>
          <p>管理用户账号、角色分配与权限配置</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setIsUserModalOpen(true); }}>添加用户</Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(24,144,255,0.15)', color: '#1890ff' }}><TeamOutlined /></div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">总用户数</div>
          </div>
        </Col>
        <Col span={6}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}><CheckCircleOutlined /></div>
            <div className="stat-value">{users.filter(u => u.status === 'active').length}</div>
            <div className="stat-label">活跃用户</div>
          </div>
        </Col>
        <Col span={6}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}><SafetyOutlined /></div>
            <div className="stat-value">{permissions.length}</div>
            <div className="stat-label">权限项数</div>
          </div>
        </Col>
        <Col span={6}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}><LockOutlined /></div>
            <div className="stat-value">4</div>
            <div className="stat-label">角色类型</div>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {roleStats.map(r => (
          <Col span={6} key={r.role}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>{r.role}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: r.color }}>{r.count}</div>
              <Text type="secondary">人</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Tabs items={[
        {
          key: 'users',
          label: <><TeamOutlined /> 用户列表</>,
          children: (
            <Card style={{ borderRadius: 12 }}>
              <Space style={{ marginBottom: 16 }}>
                <Input placeholder="搜索用户名或手机号" prefix={<SearchOutlined />} value={searchText} onChange={e => setSearchText(e.target.value)} style={{ width: 240 }} />
                <Select value={roleFilter} onChange={setRoleFilter} style={{ width: 140 }}
                  options={[{ label: '全部角色', value: 'all' }, { label: '管理员', value: '管理员' }, { label: '康复医师', value: '康复医师' }, { label: 'VIP用户', value: 'VIP用户' }, { label: '普通用户', value: '普通用户' }]} />
              </Space>
              <Table dataSource={filteredUsers} columns={userColumns} rowKey="id" pagination={{ pageSize: 8 }} />
            </Card>
          ),
        },
        {
          key: 'permissions',
          label: <><SafetyOutlined /> 权限矩阵</>,
          children: (
            <Card style={{ borderRadius: 12 }}>
              <div style={{ marginBottom: 16 }}>
                <Title level={5} style={{ color: '#e2e8f0', margin: 0 }}>
                  <LockOutlined style={{ marginRight: 8 }} />
                  角色权限配置矩阵
                </Title>
                <Text type="secondary">通过开关控制各角色的访问权限，点击保存后生效</Text>
              </div>
              <Table dataSource={permissions} columns={permissionColumns} rowKey="key" pagination={false} />
              <Divider />
              <Space>
                <Button type="primary">保存配置</Button>
                <Button>重置</Button>
              </Space>
            </Card>
          ),
        },
      ]} />

      <Modal title="添加用户" open={isUserModalOpen} onCancel={() => setIsUserModalOpen(false)}
        onOk={() => { form.validateFields().then(() => setIsUserModalOpen(false)); }}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="用户名" rules={[{ required: true }]}><Input prefix={<UserOutlined />} /></Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select options={[{ label: '普通用户', value: '普通用户' }, { label: 'VIP用户', value: 'VIP用户' }, { label: '康复医师', value: '康复医师' }, { label: '管理员', value: '管理员' }]} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="active">
            <Select options={[{ label: '活跃', value: 'active' }, { label: '停用', value: 'inactive' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
