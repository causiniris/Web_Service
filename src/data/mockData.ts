import dayjs from 'dayjs';

export interface DeviceData {
  timestamp: string;
  device_id: string;
  mode: string;
  tick: number;
  battery: number;
  lactate: number;
  emg: number;
  meniscus: number;
  att: number;
  temp: number;
  vgrf: number;
  vag: number;
}

export interface DeviceInfo {
  id: string;
  name: string;
  mode: 'REHAB' | 'SPORTS';
  status: 'online' | 'offline' | 'warning';
  battery: number;
  user: string;
  lastActive: string;
  firmware: string;
  dataCount: number;
}

export const deviceList: DeviceInfo[] = [
  { id: 'KNEE_R_001', name: '智能护膝-康复型A', mode: 'REHAB', status: 'online', battery: 80.9, user: '张伟', lastActive: '2026-03-17 15:12:13', firmware: 'v2.3.1', dataCount: 120 },
  { id: 'KNEE_R_002', name: '智能护膝-康复型B', mode: 'REHAB', status: 'online', battery: 75.3, user: '李娜', lastActive: '2026-03-17 15:10:45', firmware: 'v2.3.1', dataCount: 120 },
  { id: 'KNEE_R_003', name: '智能护膝-运动型A', mode: 'SPORTS', status: 'online', battery: 92.1, user: '王强', lastActive: '2026-03-17 15:11:30', firmware: 'v2.3.0', dataCount: 120 },
  { id: 'KNEE_R_004', name: '智能护膝-运动型B', mode: 'SPORTS', status: 'warning', battery: 15.7, user: '赵敏', lastActive: '2026-03-17 14:55:00', firmware: 'v2.3.1', dataCount: 120 },
  { id: 'KNEE_R_005', name: '智能护膝-康复型C', mode: 'REHAB', status: 'offline', battery: 43.2, user: '刘洋', lastActive: '2026-03-16 18:30:00', firmware: 'v2.2.9', dataCount: 120 },
  { id: 'KNEE_R_006', name: '智能护膝-运动型C', mode: 'SPORTS', status: 'online', battery: 67.8, user: '陈静', lastActive: '2026-03-17 15:09:22', firmware: 'v2.3.1', dataCount: 120 },
];

export const users = [
  { id: 1, name: '张伟', phone: '138****1234', role: '普通用户', devices: ['KNEE_R_001'], registerDate: '2026-01-15', status: 'active' },
  { id: 2, name: '李娜', phone: '139****5678', role: '普通用户', devices: ['KNEE_R_002'], registerDate: '2026-01-20', status: 'active' },
  { id: 3, name: '王强', phone: '136****9012', role: 'VIP用户', devices: ['KNEE_R_003'], registerDate: '2025-12-05', status: 'active' },
  { id: 4, name: '赵敏', phone: '137****3456', role: '普通用户', devices: ['KNEE_R_004'], registerDate: '2026-02-10', status: 'active' },
  { id: 5, name: '刘洋', phone: '135****7890', role: '普通用户', devices: ['KNEE_R_005'], registerDate: '2026-02-28', status: 'inactive' },
  { id: 6, name: '陈静', phone: '133****2345', role: 'VIP用户', devices: ['KNEE_R_006'], registerDate: '2025-11-18', status: 'active' },
  { id: 7, name: '管理员-李明', phone: '188****0001', role: '管理员', devices: [], registerDate: '2025-10-01', status: 'active' },
  { id: 8, name: '医生-王芳', phone: '189****0002', role: '康复医师', devices: [], registerDate: '2025-10-15', status: 'active' },
];

export const permissions = [
  { key: 'dashboard', name: '大盘概览', description: '查看设备总览和实时数据', admin: true, doctor: true, vip: true, normal: true },
  { key: 'device_view', name: '设备查看', description: '查看设备列表和详情', admin: true, doctor: true, vip: true, normal: true },
  { key: 'device_manage', name: '设备管理', description: '添加、编辑、删除设备', admin: true, doctor: false, vip: false, normal: false },
  { key: 'data_view', name: '数据查看', description: '查看图表数据和历史记录', admin: true, doctor: true, vip: true, normal: true },
  { key: 'data_export', name: '数据导出', description: '导出CSV/PDF报告', admin: true, doctor: true, vip: true, normal: false },
  { key: 'user_manage', name: '用户管理', description: '管理用户账号和状态', admin: true, doctor: false, vip: false, normal: false },
  { key: 'permission_manage', name: '权限管理', description: '配置角色权限', admin: true, doctor: false, vip: false, normal: false },
  { key: 'system_settings', name: '系统设置', description: '修改系统配置参数', admin: true, doctor: false, vip: false, normal: false },
  { key: 'miniprogram', name: '小程序管理', description: '配置小程序页面和功能', admin: true, doctor: false, vip: false, normal: false },
  { key: 'alert_manage', name: '告警管理', description: '配置告警规则和通知', admin: true, doctor: true, vip: false, normal: false },
];

export const alertRules = [
  { id: 1, name: '电池低电量告警', metric: 'battery', condition: '<', threshold: 20, level: 'warning', enabled: true },
  { id: 2, name: '皮肤温度过高', metric: 'temp', condition: '>', threshold: 37, level: 'critical', enabled: true },
  { id: 3, name: '半月板应力异常', metric: 'meniscus', condition: '>', threshold: 12, level: 'critical', enabled: true },
  { id: 4, name: '乳酸浓度过高', metric: 'lactate', condition: '>', threshold: 18, level: 'warning', enabled: true },
  { id: 5, name: '设备离线告警', metric: 'status', condition: '=', threshold: 'offline', level: 'info', enabled: true },
  { id: 6, name: '前向滑移异常', metric: 'att', condition: '>', threshold: 10, level: 'warning', enabled: false },
];

export const systemConfig = {
  serverUrl: 'http://localhost:3002',
  dataRetentionDays: 90,
  uploadInterval: 60,
  maxDevices: 100,
  enableEmailAlert: true,
  enableSmsAlert: false,
  enableWechatAlert: true,
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  theme: 'dark',
};

export const miniprogramConfig = {
  appName: '智能护膝',
  version: '1.2.0',
  pages: [
    { id: 1, name: '首页', path: '/pages/index/index', enabled: true, order: 1 },
    { id: 2, name: '设备绑定', path: '/pages/bind/bind', enabled: true, order: 2 },
    { id: 3, name: '实时监测', path: '/pages/monitor/monitor', enabled: true, order: 3 },
    { id: 4, name: '康复报告', path: '/pages/report/report', enabled: true, order: 4 },
    { id: 5, name: '运动记录', path: '/pages/sport/sport', enabled: true, order: 5 },
    { id: 6, name: '健康建议', path: '/pages/advice/advice', enabled: false, order: 6 },
    { id: 7, name: '个人中心', path: '/pages/profile/profile', enabled: true, order: 7 },
    { id: 8, name: '设置', path: '/pages/settings/settings', enabled: true, order: 8 },
  ],
  features: {
    realTimeMonitor: true,
    dataReport: true,
    sportAnalysis: true,
    healthAdvice: false,
    communityShare: false,
    aiDiagnosis: false,
  },
  tabBar: [
    { pagePath: '/pages/index/index', text: '首页', iconPath: '/icons/home.png' },
    { pagePath: '/pages/monitor/monitor', text: '监测', iconPath: '/icons/monitor.png' },
    { pagePath: '/pages/report/report', text: '报告', iconPath: '/icons/report.png' },
    { pagePath: '/pages/profile/profile', text: '我的', iconPath: '/icons/profile.png' },
  ],
};

export function generateTimeSeriesData(_deviceId: string, field: keyof DeviceData, count: number = 120) {
  const baseValues: Record<string, number> = {
    battery: 85,
    lactate: 14.5,
    emg: 83,
    meniscus: 8.5,
    att: 5.5,
    temp: 31.5,
    vgrf: 1.2,
    vag: 0.05,
  };

  const ranges: Record<string, number> = {
    battery: 3,
    lactate: 1.5,
    emg: 5,
    meniscus: 4,
    att: 3,
    temp: 1,
    vgrf: 0.3,
    vag: 0.03,
  };

  const base = baseValues[field as string] ?? 50;
  const range = ranges[field as string] ?? 10;

  return Array.from({ length: count }, (_, i) => ({
    time: dayjs('2026-03-17 13:13:13').add(i, 'minute').format('HH:mm'),
    value: +(base + (Math.random() - 0.5) * range - (field === 'battery' ? i * 0.05 : 0)).toFixed(2),
  }));
}
