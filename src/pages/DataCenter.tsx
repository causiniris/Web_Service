import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Card, Select, Tag, Space, Button, Typography, Table } from 'antd';
import {
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  FireOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { generateTimeSeriesData, deviceList } from '../data/mockData';

const { Text } = Typography;

type MetricKey = 'lactate' | 'emg' | 'meniscus' | 'att' | 'temp' | 'vgrf' | 'vag';

const metrics: { key: MetricKey; label: string; unit: string; color: string; icon: React.ReactNode; range: string }[] = [
  { key: 'lactate', label: '乳酸浓度', unit: 'mM', color: '#1890ff', icon: <ExperimentOutlined />, range: '10-18' },
  { key: 'emg', label: '肌电频率', unit: 'Hz', color: '#10b981', icon: <ThunderboltOutlined />, range: '70-90' },
  { key: 'meniscus', label: '半月板应力', unit: 'MPa', color: '#f59e0b', icon: <HeartOutlined />, range: '3-13' },
  { key: 'att', label: '前向滑移量', unit: 'mm', color: '#ef4444', icon: <FireOutlined />, range: '2-10' },
  { key: 'temp', label: '皮肤温度', unit: '℃', color: '#8b5cf6', icon: <FireOutlined />, range: '30-33' },
  { key: 'vgrf', label: '地面反力', unit: 'N/kg', color: '#06b6d4', icon: <ThunderboltOutlined />, range: '0.8-1.6' },
  { key: 'vag', label: '声学摩擦方差', unit: 'VAG', color: '#ec4899', icon: <HeartOutlined />, range: '0.02-0.08' },
];

export default function DataCenter() {
  const [searchParams] = useSearchParams();
  const [selectedDevice, setSelectedDevice] = useState(searchParams.get('device') || 'KNEE_R_001');
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('lactate');

  const currentMetric = metrics.find(m => m.key === selectedMetric)!;

  const singleData = generateTimeSeriesData(selectedDevice, selectedMetric);
  const timeLabels = singleData.map(d => d.time);

  const lineOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', borderColor: '#334155', textStyle: { color: '#e2e8f0' } },
    grid: { left: 60, right: 20, top: 40, bottom: 40 },
    xAxis: { type: 'category', data: timeLabels, axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', name: `${currentMetric.label} (${currentMetric.unit})`, axisLine: { lineStyle: { color: '#334155' } }, splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#64748b' } },
    series: [{
      type: 'line', data: singleData.map(d => d.value), smooth: true, lineStyle: { width: 3, color: currentMetric.color },
      itemStyle: { color: currentMetric.color },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: currentMetric.color + '40' }, { offset: 1, color: currentMetric.color + '05' }] } },
      markLine: { silent: true, lineStyle: { color: '#ef4444', type: 'dashed' }, data: [{ yAxis: 15, label: { formatter: '预警阈值', color: '#ef4444' } }] },
    }],
  };

  const allMetricData = metrics.map(m => {
    const data = generateTimeSeriesData(selectedDevice, m.key);
    return { ...m, data, avg: +(data.reduce((s, d) => s + d.value, 0) / data.length).toFixed(2), max: +Math.max(...data.map(d => d.value)).toFixed(2), min: +Math.min(...data.map(d => d.value)).toFixed(2) };
  });

  const multiCompareOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', borderColor: '#334155', textStyle: { color: '#e2e8f0' } },
    legend: { data: allMetricData.map(m => m.label), textStyle: { color: '#94a3b8' }, top: 0, type: 'scroll' },
    grid: { left: 60, right: 60, top: 50, bottom: 30 },
    xAxis: { type: 'category', data: timeLabels, axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#64748b', fontSize: 10 } },
    yAxis: allMetricData.map((m, i) => ({ type: 'value', name: m.unit, position: i % 2 === 0 ? 'left' : 'right', axisLine: { lineStyle: { color: '#334155' } }, splitLine: { show: i === 0, lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#64748b' } })),
    series: allMetricData.map((m, i) => ({
      name: m.label, type: 'line', yAxisIndex: i > 3 ? 1 : 0, data: m.data.map(d => d.value), smooth: true,
      lineStyle: { width: 2, color: m.color }, itemStyle: { color: m.color }, showSymbol: false,
    })),
  };

  const heatmapData: number[][] = [];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 24; j++) {
      heatmapData.push([j, i, +(Math.random() * 5 + 12).toFixed(1)]);
    }
  }

  const heatmapOption = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: '#1e293b', borderColor: '#334155', textStyle: { color: '#e2e8f0' } },
    grid: { left: 50, right: 40, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: Array.from({ length: 24 }, (_, i) => `${i}:00`), axisLabel: { color: '#64748b', fontSize: 10 }, splitArea: { show: true, areaStyle: { color: ['transparent'] } } },
    yAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], axisLabel: { color: '#64748b' } },
    visualMap: { min: 10, max: 18, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, textStyle: { color: '#94a3b8' }, inRange: { color: ['#1e3a5f', '#1890ff', '#faad14', '#ff4d4f'] } },
    series: [{ type: 'heatmap', data: heatmapData, emphasis: { itemStyle: { borderColor: '#fff', borderWidth: 1 } } }],
  };

  const scatterData = generateTimeSeriesData(selectedDevice, 'meniscus').map((d, i) => [d.value, generateTimeSeriesData(selectedDevice, 'att')[i].value]);

  const scatterOption = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: '#1e293b', borderColor: '#334155', textStyle: { color: '#e2e8f0' } },
    grid: { left: 60, right: 20, top: 20, bottom: 40 },
    xAxis: { name: '半月板应力 (MPa)', nameLocation: 'center', nameGap: 30, axisLine: { lineStyle: { color: '#334155' } }, splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#64748b' } },
    yAxis: { name: '前向滑移 (mm)', nameLocation: 'center', nameGap: 40, axisLine: { lineStyle: { color: '#334155' } }, splitLine: { lineStyle: { color: '#1e293b' } }, axisLabel: { color: '#64748b' } },
    series: [{ type: 'scatter', data: scatterData, symbolSize: 8, itemStyle: { color: '#1890ff', opacity: 0.7 } }],
  };

  const pieOption = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: '#1e293b', borderColor: '#334155', textStyle: { color: '#e2e8f0' } },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['50%', '50%'],
      label: { color: '#94a3b8', fontSize: 11 },
      data: allMetricData.map(m => ({ name: m.label, value: m.avg, itemStyle: { color: m.color } })),
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
    }],
  };

  const statsColumns = [
    { title: '指标', dataIndex: 'label', key: 'label', render: (v: string, r: typeof allMetricData[0]) => <Space>{r.icon}<Text>{v}</Text></Space> },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '平均值', dataIndex: 'avg', key: 'avg', render: (v: number, r: typeof allMetricData[0]) => <Text style={{ color: r.color, fontWeight: 600 }}>{v}</Text> },
    { title: '最大值', dataIndex: 'max', key: 'max', render: (v: number) => <Tag color="red">{v}</Tag> },
    { title: '最小值', dataIndex: 'min', key: 'min', render: (v: number) => <Tag color="green">{v}</Tag> },
    { title: '正常范围', dataIndex: 'range', key: 'range' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>数据图表中心</h2>
          <p>7维核心生理/物理数据可视化分析，支持多维度对比与趋势洞察</p>
        </div>
        <Space>
          <Select value={selectedDevice} onChange={setSelectedDevice} style={{ width: 180 }}
            options={deviceList.map(d => ({ label: `${d.id} (${d.user})`, value: d.id }))} />
          <Button icon={<DownloadOutlined />}>导出报告</Button>
          <Button icon={<ReloadOutlined />}>刷新</Button>
        </Space>
      </div>

      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        {metrics.map(m => (
          <Col span={24 / 7} key={m.key}>
            <div className="stat-card" style={{ cursor: 'pointer', borderColor: selectedMetric === m.key ? m.color : undefined, padding: 14, textAlign: 'center' }}
              onClick={() => setSelectedMetric(m.key)}>
              <div style={{ fontSize: 20, color: m.color, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{allMetricData.find(a => a.key === m.key)?.avg}</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>{m.unit}</div>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={24}>
          <div className="chart-card">
            <div className="chart-title">
              <LineChartOutlined style={{ marginRight: 8, color: currentMetric.color }} />
              {currentMetric.label} 趋势分析 ({currentMetric.unit})
              <Tag style={{ marginLeft: 12 }} color="blue">{selectedDevice}</Tag>
            </div>
            <ReactECharts option={lineOption} style={{ height: 320 }} />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={14}>
          <div className="chart-card">
            <div className="chart-title">
              <LineChartOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              全指标对比趋势
            </div>
            <ReactECharts option={multiCompareOption} style={{ height: 350 }} />
          </div>
        </Col>
        <Col span={10}>
          <div className="chart-card">
            <div className="chart-title">
              <PieChartOutlined style={{ marginRight: 8, color: '#f59e0b' }} />
              指标均值占比
            </div>
            <ReactECharts option={pieOption} style={{ height: 350 }} />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <div className="chart-card">
            <div className="chart-title">
              <BarChartOutlined style={{ marginRight: 8, color: '#8b5cf6' }} />
              乳酸浓度周热力图
            </div>
            <ReactECharts option={heatmapOption} style={{ height: 280 }} />
          </div>
        </Col>
        <Col span={12}>
          <div className="chart-card">
            <div className="chart-title">
              <ExperimentOutlined style={{ marginRight: 8, color: '#06b6d4' }} />
              半月板应力 vs 前向滑移量 散点图
            </div>
            <ReactECharts option={scatterOption} style={{ height: 280 }} />
          </div>
        </Col>
      </Row>

      <Card title="数据统计汇总" style={{ borderRadius: 12 }}>
        <Table dataSource={allMetricData} columns={statsColumns} rowKey="key" pagination={false} size="small" />
      </Card>
    </div>
  );
}
