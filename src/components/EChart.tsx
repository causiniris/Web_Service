import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartProps {
  option: Record<string, unknown>;
  style?: React.CSSProperties;
}

export default function EChart({ option, style }: EChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, undefined, { renderer: 'canvas' });
    instanceRef.current = chart;

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (instanceRef.current && option) {
      instanceRef.current.setOption(option as echarts.EChartsOption, { notMerge: false });
    }
  }, [option]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', ...style }} />;
}
