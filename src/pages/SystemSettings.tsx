import { useState } from 'react';
import { Card, Row, Col, Form, Input, InputNumber, Switch, Select, Button, Divider, Typography, Tag, Space, Table, Modal, Slider, Alert } from 'antd';
import {
  CloudServerOutlined,
  BellOutlined,
  LockOutlined,
  GlobalOutlined,
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useTheme } from '../components/ThemeContext';
import type { ThemeMode } from '../components/ThemeContext';
import { systemConfig, alertRules } from '../data/mockData';

const { Text, Title } = Typography;

export default function SystemSettings() {
  const [configForm] = Form.useForm();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const { mode, setMode } = useTheme();

  const handleThemeChange = (value: ThemeMode) => {
    setMode(value);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>系统设置</h2>
          <p>配置系统参数、告警规则与安全策略</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />}>重置</Button>
          <Button type="primary" icon={<SaveOutlined />}>保存全部配置</Button>
        </Space>
      </div>

      <Row gutter={[20, 20]}>
        <Col span={12}>
          <Card title={<><CloudServerOutlined style={{ marginRight: 8, color: '#1890ff' }} />服务器配置</>} style={{ borderRadius: 12, height: '100%' }}>
            <Form form={configForm} layout="vertical" initialValues={systemConfig}>
              <Form.Item name="serverUrl" label="服务器地址">
                <Input prefix={<CloudServerOutlined />} placeholder="http://localhost:3002" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="dataRetentionDays" label="数据保留天数">
                    <InputNumber min={7} max={365} style={{ width: '100%' }} addonAfter="天" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="uploadInterval" label="数据上传间隔">
                    <InputNumber min={10} max={300} style={{ width: '100%' }} addonAfter="秒" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="maxDevices" label="最大设备数量">
                <InputNumber min={10} max={10000} style={{ width: '100%' }} addonAfter="台" />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<><BellOutlined style={{ marginRight: 8, color: '#f59e0b' }} />通知渠道</>} style={{ borderRadius: 12, height: '100%' }}>
            <Form form={configForm} layout="vertical" initialValues={systemConfig}>
              <Form.Item name="enableEmailAlert" label="邮件通知" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Form.Item name="enableSmsAlert" label="短信通知" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Form.Item name="enableWechatAlert" label="微信推送" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Divider />
              <Alert type="info" showIcon message="通知渠道说明" description="邮件通知用于发送日报/周报，短信用于紧急告警，微信用于实时推送。" />
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<><GlobalOutlined style={{ marginRight: 8, color: '#10b981' }} />系统偏好</>} style={{ borderRadius: 12, height: '100%' }}>
            <Form form={configForm} layout="vertical" initialValues={{ ...systemConfig, theme: mode }}>
              <Form.Item name="language" label="系统语言">
                <Select options={[
                  { label: '简体中文', value: 'zh-CN' },
                  { label: 'English', value: 'en-US' },
                  { label: '日本語', value: 'ja-JP' },
                ]} />
              </Form.Item>
              <Form.Item name="timezone" label="时区设置">
                <Select options={[
                  { label: '亚洲/上海 (UTC+8)', value: 'Asia/Shanghai' },
                  { label: '亚洲/东京 (UTC+9)', value: 'Asia/Tokyo' },
                  { label: '美国/纽约 (UTC-5)', value: 'America/New_York' },
                ]} />
              </Form.Item>
              <Form.Item name="theme" label="界面主题">
                <Select
                  value={mode}
                  onChange={handleThemeChange}
                  options={[
                    { label: '🌑 深色主题', value: 'dark' },
                    { label: '☀️ 浅色主题', value: 'light' },
                    { label: '🔄 跟随系统', value: 'auto' },
                  ]}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<><LockOutlined style={{ marginRight: 8, color: '#ef4444' }} />安全策略</>} style={{ borderRadius: 12, height: '100%' }}>
            <Form form={configForm} layout="vertical">
              <Form.Item label="登录失败锁定次数">
                <Slider min={3} max={10} marks={{ 3: '3次', 5: '5次', 10: '10次' }} defaultValue={5} />
              </Form.Item>
              <Form.Item label="会话超时时间">
                <Slider min={15} max={120} marks={{ 15: '15分', 30: '30分', 60: '60分', 120: '120分' }} defaultValue={30} step={15} />
              </Form.Item>
              <Form.Item label="强制双因素认证" valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Form.Item label="API访问Token有效期">
                <InputNumber min={1} max={90} style={{ width: '100%' }} addonAfter="天" defaultValue={7} />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card
        title={<><SafetyCertificateOutlined style={{ marginRight: 8, color: '#8b5cf6' }} />告警规则管理</>}
        extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setIsAlertModalOpen(true)}>新增规则</Button>}
        style={{ borderRadius: 12, marginTop: 20 }}
      >
        <Table
          dataSource={alertRules}
          rowKey="id"
          pagination={false}
          size="small"
          columns={[
            { title: '规则名称', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
            { title: '监测指标', dataIndex: 'metric', key: 'metric', render: (v: string) => <Tag color="blue">{v}</Tag> },
            { title: '条件', key: 'condition', render: (_: unknown, r: typeof alertRules[0]) => <Text>{r.condition} {r.threshold}</Text> },
            {
              title: '告警级别', dataIndex: 'level', key: 'level',
              render: (l: string) => {
                const map: Record<string, { color: string; text: string }> = {
                  critical: { color: 'red', text: '严重' },
                  warning: { color: 'orange', text: '警告' },
                  info: { color: 'blue', text: '通知' },
                };
                const item = map[l];
                return <Tag color={item.color}>{item.text}</Tag>;
              },
            },
            {
              title: '状态', dataIndex: 'enabled', key: 'enabled',
              render: (v: boolean) => (
                <Tag color={v ? 'green' : 'default'}>
                  {v ? '已启用' : '已禁用'}
                </Tag>
              ),
            },
            {
              title: '操作', key: 'action',
              render: (_: unknown, r: typeof alertRules[0]) => (
                <Space>
                  <Switch size="small" checked={r.enabled} />
                  <Button type="link" size="small">编辑</Button>
                  <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <DatabaseOutlined style={{ fontSize: 36, color: '#1890ff', marginBottom: 12 }} />
            <Title level={4} style={{ margin: 0 }}>数据库状态</Title>
            <Tag color="green" style={{ marginTop: 8 }}>正常运行</Tag>
            <div style={{ marginTop: 12 }}>
              <Text type="secondary">存储使用: 2.4 GB / 50 GB</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <CloudServerOutlined style={{ fontSize: 36, color: '#10b981', marginBottom: 12 }} />
            <Title level={4} style={{ margin: 0 }}>服务器状态</Title>
            <Tag color="green" style={{ marginTop: 8 }}>正常运行</Tag>
            <div style={{ marginTop: 12 }}>
              <Text type="secondary">CPU: 23% | 内存: 41%</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <SafetyCertificateOutlined style={{ fontSize: 36, color: '#f59e0b', marginBottom: 12 }} />
            <Title level={4} style={{ margin: 0 }}>安全状态</Title>
            <Tag color="green" style={{ marginTop: 8 }}>无威胁</Tag>
            <div style={{ marginTop: 12 }}>
              <Text type="secondary">最近扫描: 2026-03-25 12:00</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal title="新增告警规则" open={isAlertModalOpen} onCancel={() => setIsAlertModalOpen(false)}
        onOk={() => setIsAlertModalOpen(false)}>
        <Form layout="vertical">
          <Form.Item label="规则名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="监测指标">
            <Select options={[
              { label: '电池电量', value: 'battery' },
              { label: '皮肤温度', value: 'temp' },
              { label: '半月板应力', value: 'meniscus' },
              { label: '乳酸浓度', value: 'lactate' },
              { label: '前向滑移', value: 'att' },
              { label: '设备状态', value: 'status' },
            ]} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="条件">
                <Select options={[{ label: '大于', value: '>' }, { label: '小于', value: '<' }, { label: '等于', value: '=' }]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="阈值"><InputNumber style={{ width: '100%' }} /></Form.Item>
            </Col>
          </Row>
          <Form.Item label="告警级别">
            <Select options={[{ label: '严重', value: 'critical' }, { label: '警告', value: 'warning' }, { label: '通知', value: 'info' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
