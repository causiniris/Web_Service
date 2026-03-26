# 智能护膝 Web 系统（Render 部署版）

本次重构遵循第一性原理，只保留上线所需的最小闭环：

1. 数据输入：阿里云 Simulator 通过 HTTP POST 上报护膝数据。
2. 数据处理：服务端校验并缓存最近 N 条数据。
3. 数据输出：前端按固定间隔轮询 GET 接口并更新图表。
4. 单域部署：同一 Render 域名同时承载 API 与前端页面。

在不改变现有前端功能的前提下，新增 Node 服务层用于接收并提供数据接口。

## 项目结构

```text
web/
  src/                 # 前端（保持现有功能）
  server/
    index.js           # 新增：Render 运行的 API + 静态资源服务
  render.yaml          # 新增：Render 蓝图配置
  .env.example
  package.json
```

## API 约定

### 1) 上报数据（Simulator -> Render）

- Method: POST
- Path: /api/telemetry
- Body: 支持单条对象或对象数组

单条示例：

```json
{
  "timestamp": "2026-03-26T10:10:00.000Z",
  "battery": 88.2,
  "meniscus": 8.6,
  "emg": 76.9
}
```

数组示例：

```json
[
  {
    "timestamp": "2026-03-26T10:10:00.000Z",
    "battery": 88.2,
    "meniscus": 8.6,
    "emg": 76.9
  },
  {
    "timestamp": "2026-03-26T10:10:04.000Z",
    "battery": 88.0,
    "meniscus": 8.7,
    "emg": 77.1
  }
]
```

### 2) 查询数据（前端 -> Render）

- Method: GET
- Path: /api/telemetry
- Response: `{ data: TelemetryPoint[] }`

### 3) 健康检查

- Method: GET
- Path: /health

## 本地运行

安装依赖：

```bash
npm install
```

仅前端调试：

```bash
npm run dev
```

生产方式本地验证（与 Render 一致）：

```bash
npm run serve
```

## 上传到 GitHub

```bash
git init
git add .
git commit -m "refactor: add render-ready full path for simulator telemetry"
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

## Render 部署步骤

方式 A（推荐）：使用 render.yaml 一键识别

1. 登录 Render，点击 New +。
2. 选择 Blueprint。
3. 选择你的 GitHub 仓库并创建。
4. 等待构建完成，获取 https://xxxxx.onrender.com 域名。

方式 B：手动创建 Web Service

1. New + -> Web Service。
2. 连接 GitHub 仓库。
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start`
5. 环境变量：
   - `VITE_API_BASE_URL` 设为空（同域调用）
   - `VITE_TELEMETRY_PATH=/api/telemetry`

## Simulator 上报示例

curl：

```bash
curl -X POST https://你的-render-域名/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{"timestamp":"2026-03-26T10:10:00.000Z","battery":88.2,"meniscus":8.6,"emg":76.9}'
```

Python requests：

```python
import requests

url = "https://你的-render-域名/api/telemetry"
payload = {
    "timestamp": "2026-03-26T10:10:00.000Z",
    "battery": 88.2,
    "meniscus": 8.6,
    "emg": 76.9,
}

resp = requests.post(url, json=payload, timeout=8)
print(resp.status_code, resp.text)
```

## 注意事项

- 该版本使用内存缓存保存最近 500 条数据，适合演示与联调。
- 若进入生产，请把 `server/index.js` 的存储层替换为数据库（如 PostgreSQL）。
