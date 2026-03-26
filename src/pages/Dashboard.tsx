// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tag, Progress, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  MobileOutlined, CheckCircleOutlined, ExclamationCircleOutlined,
  CloseCircleOutlined, ThunderboltOutlined, HeartOutlined,
  RiseOutlined, PieChartOutlined, LineChartOutlined,
} from '@ant-design/icons';
import EChart from '../components/EChart';
import { deviceList, generateTimeSeriesData } from '../data/mockData';
import { startTelemetryPolling } from '../utils/api';
import type { TelemetryPoint } from '../types/telemetry';

const statCards = [
  { icon: <MobileOutlined />, label: '总设备数', value: '6', change: '+2 本月新增', up: true, color: '#1890ff', bg: 'rgba(24,144,255,0.15)' },
  { icon: <CheckCircleOutlined />, label: '在线设备', value: '4', change: '在线率 66.7%', up: true, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  { icon: <HeartOutlined />, label: '康复训练', value: '3,840', change: '累计训练次数', up: true, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  { icon: <ExclamationCircleOutlined />, label: '告警事件', value: '2', change: '今日新增', up: false, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  // ==================== 核心逻辑：真实数据状态与轮询 ====================
  const [realData, setRealData] = useState<TelemetryPoint[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('等待同步...');

  useEffect(() => {
    // 启动轮询，每 8 秒向 Render 服务器拉取一次最新数据
    const stopPolling = startTelemetryPolling(
      (points) => {
        setRealData(points.slice(-60)); // 取最后 60 个点
        setLastUpdateTime(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
      },
      (err) => console.error('数据同步异常:', err),
      8000
    );
    return () => stopPolling();
  }, []);

  // 适配器：将后端的 TelemetryPoint 转换为队友图表期待的 { time, value } 格式
  const formatData = (field: keyof TelemetryPoint) => {
    if (realData.length === 0) return generateTimeSeriesData('KNEE_R_001', field as any, 60);
    return realData.map(d => ({
      time: new Date(d.timestamp).toLocaleTimeString('zh-CN', { hour12: false }),
      value: Number(d[field]) || 0
    }));
  };
  // ====================================================================

  const goToDataCenter = (deviceId: string) => navigate(`/data-center?device=${deviceId}`);

  const columns = [
    { title: '设备ID', dataIndex: 'id', key: 'id', render: (v: string) => <Button type="link" style={{ padding: 0, fontWeight: 600 }} onClick={() => goToDataCenter(v)}>{v}</Button> },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '模式', dataIndex: 'mode', key: 'mode', render: (m: string) => <Tag color={m === 'REHAB' ? 'cyan' : 'orange'}>{m === 'REHAB' ? '康复' : '运动'}</Tag> },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => {
        const map: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
          online: { color: '#10b981', icon: <CheckCircleOutlined />, text: '在线' },
          offline: { color: '#64748b', icon: <CloseCircleOutlined />, text: '离线' },
          warning: { color: '#f59e0b', icon: <ExclamationCircleOutlined />, text: '告警' },
        };
        const item = map[s] || map.offline;
        return <Tag color={item.color} icon={item.icon}>{item.text}</Tag>;
      },
    },
    { 
      title: '电量', dataIndex: 'battery', key: 'battery', 
      render: (v: number, r: any) => {
        const displayBattery = (r.id === 'KNEE_R_001' && realData.length > 0) ? realData[realData.length - 1].battery : v;
        return <Progress percent={Math.round(displayBattery)} size="small" strokeColor={displayBattery > 30 ? '#10b981' : '#ef4444'} />;
      } 
    },
    { title: '使用者', dataIndex: 'user', key: 'user' },
    { title: '最后活跃', dataIndex: 'lastActive', key: 'lastActive' },
    { title: '操作', key: 'action', render: (_: unknown, r: typeof deviceList[0]) => <Button type="link" icon={<LineChartOutlined />} size="small" onClick={() => goToDataCenter(r.id)}>查看数据</Button> },
  ];

  const lactateData = formatData('lactate');
  const emgData = formatData('emg');
  const tempData = formatData('temp');
  const vgrfData = formatData('vgrf');
  const timeLabels = lactateData.map(d => d.time);

  const multiLineOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', borderColor: '#334155', textStyle: { color: '#e2e8f0' } },
    legend: { data: ['乳酸浓度', '肌电频率', '皮肤温度'], textStyle: { color: '#94a3b8' }, top: 0 },
    grid: { left: 50, right: 20, top: 50, bottom: 30 },
    xAxis: { type: 'category', data: timeLabels, axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b', fontSize: 10 } },
    yAxis: [
      { type: 'value', name: 'mM / Hz', axisLine: { lineStyle: { color: '#334155' } }, splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#64748b' } },
      { type: 'value', name: '℃', axisLine: { lineStyle: { color: '#334155' } }, splitLine: { show: false }, axisLabel: { color: '#64748b' } },
    ],
    series: [
      { name: '乳酸浓度', type: 'line', data: lactateData.map(d => d.value), smooth: true, lineStyle: { width: 2 }, itemStyle: { color: '#1890ff' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(24,144,255,0.3)' }, { offset: 1, color: 'rgba(24,144,255,0)' }] } } },
      { name: '肌电频率', type: 'line', data: emgData.map(d => d.value), smooth: true, lineStyle: { width: 2 }, itemStyle: { color: '#10b981' } },
      { name: '皮肤温度', type: 'line', yAxisIndex: 1, data: tempData.map(d => d.value), smooth: true, lineStyle: { width: 2 }, itemStyle: { color: '#f59e0b' } },
    ],
  };

  const vgrfOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', borderColor: '#334155', textStyle: { color: '#e2e8f0' } },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: { type: 'category', data: timeLabels, axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b', fontSize: 10 } },
    yAxis: { type: 'value', name: 'vGRF', axisLine: { lineStyle: { color: '#334155' } }, splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#64748b' } },
    series: [{ type: 'bar', data: vgrfData.map(d => d.value), barWidth: '60%', itemStyle: { borderRadius: [4, 4, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#06b6d4' }, { offset: 1, color: 'rgba(6,182,212,0.3)' }] } } }],
  };

  const onlineCount = deviceList.filter(d => d.status === 'online').length;
  const offlineCount = deviceList.filter(d => d.status === 'offline').length;
  const warningCount = deviceList.filter(d => d.status === 'warning').length;

  const pieOption = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: '#1e293b', borderColor: '#334155', textStyle: { color: '#e2e8f0' } },
    legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: '#94a3b8' } },
    series: [{
      type: 'pie', radius: ['45%', '70%'], center: ['40%', '50%'], label: { show: false },
      data: [
        { name: '在线', value: onlineCount, itemStyle: { color: '#10b981' } },
        { name: '离线', value: offlineCount, itemStyle: { color: '#64748b' } },
        { name: '告警', value: warningCount, itemStyle: { color: '#f59e0b' } },
      ],
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
    }],
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>大盘概览</h2>
          <p>智能护膝 IoT 管理平台 · 实时监控所有设备状态与健康数据</p>
        </div>
        <Space>
          <Tag color="processing" style={{ padding: '4px 12px', fontSize: 13 }}>最新同步: {lastUpdateTime}</Tag>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((item, i) => (
          <Col span={6} key={i}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
              <div className={`stat-change ${item.up ? 'up' : 'down'}`}>
                {item.up ? <RiseOutlined /> : <ExclamationCircleOutlined />} {item.change}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={14}>
          <div className="chart-card">
            <div className="chart-title"><ThunderboltOutlined style={{ marginRight: 8, color: '#1890ff' }} />实时生理数据监测 (KNEE_R_001)</div>
            <EChart option={multiLineOption} style={{ height: 300 }} />
          </div>
        </Col>
        <Col span={10}>
          <div className="chart-card">
            <div className="chart-title"><PieChartOutlined style={{ marginRight: 8, color: '#1890ff' }} />设备状态分布</div>
            <EChart option={pieOption} style={{ height: 300 }} />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <div className="chart-card">
            <div className="chart-title">垂直地面反作用力 (vGRF) 分布</div>
            <EChart option={vgrfOption} style={{ height: 200 }} />
          </div>
        </Col>
      </Row>

      <Card title="设备状态总览" style={{ borderRadius: 12 }}>
        <Table dataSource={deviceList} columns={columns} rowKey="id" pagination={false} size="small" />
      </Card>
    </div>
  );
}