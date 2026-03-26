import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Space, Input, Select, Modal, Form, Progress, Row, Col, Card, Typography, Badge } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MobileOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  WifiOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { deviceList } from '../data/mockData';
import type { DeviceInfo } from '../data/mockData';

const { Text } = Typography;

export default function DeviceManagement() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceInfo | null>(null);
  const [form] = Form.useForm();

  const filteredDevices = deviceList.filter(d => {
    const matchSearch = d.id.toLowerCase().includes(searchText.toLowerCase()) || d.name.includes(searchText) || d.user.includes(searchText);
    const matchMode = modeFilter === 'all' || d.mode === modeFilter;
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchMode && matchStatus;
  });

  const handleEdit = (device: DeviceInfo) => {
    setEditingDevice(device);
    form.setFieldsValue(device);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingDevice(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const goToDataCenter = (deviceId: string) => {
    navigate(`/data-center?device=${deviceId}`);
  };

  const columns = [
    {
      title: '设备编号', dataIndex: 'id', key: 'id',
      render: (v: string) => (
        <Button type="link" style={{ padding: 0, fontWeight: 600, fontSize: 14 }} onClick={() => goToDataCenter(v)}>
          {v}
        </Button>
      ),
    },
    {
      title: '模式', dataIndex: 'mode', key: 'mode',
      render: (m: string) => <Tag color={m === 'REHAB' ? 'cyan' : 'orange'}>{m === 'REHAB' ? '康复模式' : '运动模式'}</Tag>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => {
        const map: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
          online: { color: '#10b981', icon: <CheckCircleOutlined />, text: '在线' },
          offline: { color: '#64748b', icon: <CloseCircleOutlined />, text: '离线' },
          warning: { color: '#f59e0b', icon: <ExclamationCircleOutlined />, text: '告警' },
        };
        const item = map[s];
        return <Tag color={item.color} icon={item.icon}>{item.text}</Tag>;
      },
    },
    {
      title: '电量', dataIndex: 'battery', key: 'battery',
      render: (v: number) => (
        <Space>
          <ThunderboltOutlined style={{ color: v > 30 ? '#10b981' : '#ef4444' }} />
          <Progress percent={Math.round(v)} size="small" style={{ width: 80 }} strokeColor={v > 30 ? '#10b981' : '#ef4444'} />
        </Space>
      ),
    },
    { title: '使用者', dataIndex: 'user', key: 'user' },
    { title: '固件版本', dataIndex: 'firmware', key: 'firmware', render: (v: string) => <Tag>{v}</Tag> },
    { title: '最后活跃', dataIndex: 'lastActive', key: 'lastActive' },
    {
      title: '操作', key: 'action',
      render: (_: unknown, record: DeviceInfo) => (
        <Space>
          <Button type="link" icon={<LineChartOutlined />} size="small" onClick={() => goToDataCenter(record.id)}>数据</Button>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">删除</Button>
        </Space>
      ),
    },
  ];

  const onlineCount = deviceList.filter(d => d.status === 'online').length;
  const offlineCount = deviceList.filter(d => d.status === 'offline').length;
  const warningCount = deviceList.filter(d => d.status === 'warning').length;
  const rehabCount = deviceList.filter(d => d.mode === 'REHAB').length;
  const sportsCount = deviceList.filter(d => d.mode === 'SPORTS').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>设备管理</h2>
          <p>管理所有智能护膝设备，查看状态与配置</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加设备</Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <MobileOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{deviceList.length}</div>
            <Text type="secondary">总设备数</Text>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <WifiOutlined style={{ fontSize: 24, color: '#10b981' }} />
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8, color: '#10b981' }}>{onlineCount}</div>
            <Text type="secondary">在线</Text>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <CloseCircleOutlined style={{ fontSize: 24, color: '#64748b' }} />
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8, color: '#64748b' }}>{offlineCount}</div>
            <Text type="secondary">离线</Text>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <ExclamationCircleOutlined style={{ fontSize: 24, color: '#f59e0b' }} />
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8, color: '#f59e0b' }}>{warningCount}</div>
            <Text type="secondary">告警</Text>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Badge status="processing" color="#06b6d4" />
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8, color: '#06b6d4' }}>{rehabCount}</div>
            <Text type="secondary">康复模式</Text>
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Badge status="processing" color="#f59e0b" />
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8, color: '#f59e0b' }}>{sportsCount}</div>
            <Text type="secondary">运动模式</Text>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="搜索设备ID、名称、使用者" prefix={<SearchOutlined />} value={searchText} onChange={e => setSearchText(e.target.value)} style={{ width: 280 }} />
          <Select value={modeFilter} onChange={setModeFilter} style={{ width: 120 }} options={[{ label: '全部模式', value: 'all' }, { label: '康复模式', value: 'REHAB' }, { label: '运动模式', value: 'SPORTS' }]} />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120 }} options={[{ label: '全部状态', value: 'all' }, { label: '在线', value: 'online' }, { label: '离线', value: 'offline' }, { label: '告警', value: 'warning' }]} />
          <Button icon={<ReloadOutlined />}>刷新</Button>
        </Space>
        <Table dataSource={filteredDevices} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title={editingDevice ? '编辑设备' : '添加设备'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => { form.validateFields().then(() => setIsModalOpen(false)); }}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="设备名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="id" label="设备ID" rules={[{ required: true }]}><Input disabled={!!editingDevice} /></Form.Item>
          <Form.Item name="mode" label="运行模式" rules={[{ required: true }]}>
            <Select options={[{ label: '康复模式', value: 'REHAB' }, { label: '运动模式', value: 'SPORTS' }]} />
          </Form.Item>
          <Form.Item name="user" label="绑定用户"><Input /></Form.Item>
          <Form.Item name="firmware" label="固件版本"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
