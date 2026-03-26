import { useEffect, useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import EChart from './components/EChart';
import type { TelemetryPoint } from './types/telemetry';
import { API_BASE_URL, startTelemetryPolling } from './utils/api';
import './App.css';

const POLLING_INTERVAL_MS = 8000;
const MAX_POINTS = 30;

function formatTimeLabel(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function App() {
  const [series, setSeries] = useState<TelemetryPoint[]>([]);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const stop = startTelemetryPolling(
      (points) => {
        const next = points.slice(-MAX_POINTS);
        setSeries(next);
        setError('');
        setLastUpdated(new Date().toLocaleString('zh-CN'));
      },
      (message) => {
        setError(`数据拉取失败：${message}`);
      },
      POLLING_INTERVAL_MS,
    );

    return () => {
      stop();
    };
  }, []);

  const chartOption = useMemo<EChartsOption>(() => {
    const labels = series.map((item) => formatTimeLabel(item.timestamp));
    
    // 提取 7 维全量数据
    const meniscusData = series.map((item) => item.meniscus);
    const emgData = series.map((item) => item.emg);
    const lactateData = series.map((item) => item.lactate);
    const tempData = series.map((item) => item.temp);
    const attData = series.map((item) => item.att);
    const vgrfData = series.map((item) => item.vgrf);
    const vagData = series.map((item) => item.vag);

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(17, 24, 39, 0.88)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        textStyle: { color: '#f8fafc' },
      },
      legend: {
        top: 8,
        textStyle: { color: '#3f4c5f', fontSize: 12 },
        type: 'scroll', // 维度多了，开启图例滚动
      },
      grid: {
        left: 24,
        right: 16,
        top: 56,
        bottom: 24,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels,
        axisLabel: { color: '#6b7280', fontSize: 11 },
        axisLine: { lineStyle: { color: '#d1d5db' } },
      },
      yAxis: [
        {
          type: 'value',
          name: '主指标',
          position: 'left',
          axisLabel: { color: '#6b7280' },
          splitLine: { lineStyle: { color: '#eef2f7' } },
        },
        {
          type: 'value',
          name: '肌电频段',
          position: 'right',
          axisLabel: { color: '#6b7280' },
          splitLine: { show: false },
        }
      ],
      series: [
        { name: '半月板压力 (meniscus)', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2, color: '#e35d32' }, yAxisIndex: 0, data: meniscusData },
        { name: '肌电信号 (emg)', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2, color: '#0f766e' }, yAxisIndex: 1, data: emgData },
        { name: '乳酸浓度 (lactate)', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2, color: '#3b82f6' }, yAxisIndex: 0, data: lactateData },
        { name: '皮肤温度 (temp)', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2, color: '#f59e0b' }, yAxisIndex: 0, data: tempData },
        { name: '前向滑移 (att)', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2, color: '#8b5cf6' }, yAxisIndex: 0, data: attData },
        { name: '反作用力 (vgrf)', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2, color: '#ec4899' }, yAxisIndex: 0, data: vgrfData },
        { name: '声学摩擦 (vag)', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2, color: '#64748b' }, yAxisIndex: 0, data: vagData },
      ],
    };
  }, [series]);

  const latest = series.at(-1);

  return (
    <main className="dashboard-shell">
      <header className="hero">
        <p className="hero-tag">Smart Knee Data Service</p>
        <h1>智能护膝实时看板</h1>
        <p className="hero-subtitle">
          面向 C 端用户的实时生理指标展示，按 {POLLING_INTERVAL_MS / 1000} 秒自动更新。
        </p>
      </header>

      <section className="status-grid">
        <article className="status-card">
          <span className="status-label">API 基础地址</span>
          <strong className="status-value">{API_BASE_URL}</strong>
        </article>
        <article className="status-card">
          <span className="status-label">最近更新时间</span>
          <strong className="status-value">{lastUpdated || '等待首轮请求...'}</strong>
        </article>
        <article className="status-card">
          <span className="status-label">当前电量</span>
          <strong className="status-value">{latest ? `${latest.battery.toFixed(1)}%` : '--'}</strong>
        </article>
      </section>

      {error ? <section className="error-banner">{error}</section> : null}

      <section className="chart-panel">
        <div className="panel-head">
          <h2>核心趋势图：七维全量数据实时追踪</h2>
          <span>{series.length > 0 ? `当前样本: ${series.length}` : '暂无数据'}</span>
        </div>
        <div className="chart-wrap">
          <EChart option={chartOption} style={{ height: 360 }} />
        </div>
      </section>
    </main>
  );
}

export default App;