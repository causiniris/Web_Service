import express from 'express';
import cors from 'cors'; // <-- 修复1：引入 cors 解决跨域
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const PORT = Number(process.env.PORT || 10000); // 确保 Render 端口正确
const MAX_POINTS = 5000; // 调大缓存，防丢数据

const telemetryStore = [];

function toPoint(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const timestamp = typeof raw.timestamp === 'string' ? raw.timestamp : new Date().toISOString();
  // <-- 修复3：找回失忆的设备 ID 和模式
  const device_id = typeof raw.device_id === 'string' ? raw.device_id : 'UNKNOWN_DEVICE';
  const mode = typeof raw.mode === 'string' ? raw.mode : 'UNKNOWN';
  
  const battery = Number(raw.battery);
  const meniscus = Number(raw.meniscus);
  const emg = Number(raw.emg);
  const lactate = Number(raw.lactate);
  const temp = Number(raw.temp);
  const att = Number(raw.att);
  const vgrf = Number(raw.vgrf);
  const vag = Number(raw.vag);

  // 只要核心数值合法就放行
  if (
    Number.isNaN(battery) || Number.isNaN(meniscus) || Number.isNaN(emg) ||
    Number.isNaN(lactate) || Number.isNaN(temp) || Number.isNaN(att) ||
    Number.isNaN(vgrf) || Number.isNaN(vag)
  ) {
    return null;
  }

  return {
    timestamp,
    device_id, // 保存入库
    mode,      // 保存入库
    battery, meniscus, emg, lactate, temp, att, vgrf, vag,
  };
}

app.use(cors()); // <-- 修复1：应用跨域放行策略
app.use(express.json({ limit: '5mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', points: telemetryStore.length, timestamp: Date.now() });
});

app.post('/api/telemetry', (req, res) => {
  const payload = req.body;
  const incoming = Array.isArray(payload) ? payload : [payload];
  const normalized = incoming.map(toPoint).filter((item) => item !== null);

  if (normalized.length === 0) {
    return res.status(400).json({ message: 'Invalid telemetry payload' });
  }

  telemetryStore.push(...normalized);
  if (telemetryStore.length > MAX_POINTS) {
    telemetryStore.splice(0, telemetryStore.length - MAX_POINTS);
  }

  return res.status(201).json({
    message: 'Telemetry accepted',
    accepted: normalized.length,
    total: telemetryStore.length,
  });
});

app.get('/api/telemetry', (_req, res) => {
  res.json({
    data: telemetryStore,
    count: telemetryStore.length,
    timestamp: Date.now(),
  });
});

const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// 兼容 Express 5.x 路由兜底
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`server running at http://0.0.0.0:${PORT}`);
});