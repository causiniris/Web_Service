import { Card, Row, Col, Button, Typography, Space, Tag, Divider } from 'antd';
import {
  WechatOutlined,
  DesktopOutlined,
  CloudServerOutlined,
  SafetyOutlined,
  CodeOutlined,
  FolderOpenOutlined,
  LinkOutlined,
  PlayCircleOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useTheme } from '../components/ThemeContext';

const { Text, Title } = Typography;

const platforms = [
  {
    title: '微信小程序',
    subtitle: 'WeChat Miniprogram',
    icon: <WechatOutlined />,
    color: '#07c160',
    bgColor: 'rgba(7,193,96,0.12)',
    items: [
      { label: '打开开发者工具', desc: 'C:\\Users\\25644\\WeChatProjects\\minicode-1', icon: <CodeOutlined />, action: 'path', value: 'C:\\Users\\25644\\WeChatProjects\\minicode-1' },
      { label: '打开项目文件夹', desc: 'minicode-1 项目目录', icon: <FolderOpenOutlined />, action: 'path', value: 'C:\\Users\\25644\\WeChatProjects\\minicode-1' },
    ],
  },
  {
    title: '数据模拟器',
    subtitle: 'Data Simulator',
    icon: <DesktopOutlined />,
    color: '#1890ff',
    bgColor: 'rgba(24,144,255,0.12)',
    items: [
      { label: '启动可视化终端', desc: 'python src/gui_main.py', icon: <PlayCircleOutlined />, action: 'cmd', value: 'python src/gui_main.py' },
      { label: '启动无头模式', desc: 'python src/simulator_core.py', icon: <ApiOutlined />, action: 'cmd', value: 'python src/simulator_core.py' },
      { label: '打开源码目录', desc: 'C:\\...\\software_design\\src', icon: <FolderOpenOutlined />, action: 'path', value: 'C:\\Users\\25644\\Desktop\\课程\\程序设计\\数据库\\software_design\\src' },
    ],
  },
  {
    title: 'ECS 管理控制台',
    subtitle: 'Alibaba Cloud Console',
    icon: <CloudServerOutlined />,
    color: '#ff6a00',
    bgColor: 'rgba(255,106,0,0.12)',
    items: [
      { label: '打开控制台', desc: 'i-2vc4b51jt2zwcpxdzcn3 · 成都', icon: <LinkOutlined />, action: 'url', value: 'https://ecs.console.aliyun.com/server/i-2vc4b51jt2zwcpxdzcn3/detail?regionId=cn-chengdu' },
    ],
  },
  {
    title: 'ECS WorkBench',
    subtitle: 'Alibaba Cloud Terminal',
    icon: <SafetyOutlined />,
    color: '#722ed1',
    bgColor: 'rgba(114,46,209,0.12)',
    items: [
      { label: '远程终端连接', desc: '在线 SSH 管理', icon: <LinkOutlined />, action: 'url', value: 'https://ecs-workbench.aliyun.com/?spm=5176.ecscore_server-lite.0.0.6ee94df5pcXpJ6&instanceId=i-2vc4b51jt2zwcpxdzcn3&form=EcsConsole&regionId=cn-chengdu&instanceType=ecs&language=zh&resourceGroupId=' },
    ],
  },
];

export default function MiniProgram() {
  const { isDark } = useTheme();

  const cardBg = isDark
    ? 'linear-gradient(135deg, #111827 0%, #0f172a 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
  const textPri = isDark ? '#e2e8f0' : '#1e293b';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const textMuted = isDark ? '#475569' : '#94a3b8';
  const dividerColor = isDark ? '#1e293b' : '#e2e8f0';

  const handleAction = (action: string, value: string) => {
    if (action === 'url') {
      window.open(value, '_blank');
    } else {
      navigator.clipboard.writeText(value).then(() => {
        alert('已复制: ' + value);
      });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>平台中枢</h2>
          <p>智能护膝产品全平台入口 · 小程序 · 模拟器 · 云服务器</p>
        </div>
        <Tag color="blue" style={{ padding: '4px 14px', fontSize: 13 }}>4 个平台</Tag>
      </div>

      <Row gutter={[20, 20]}>
        {platforms.map(p => (
          <Col span={12} key={p.title}>
            <Card
              style={{
                borderRadius: 14,
                borderColor: p.color + '30',
                background: cardBg,
                transition: 'all 0.3s',
              }}
              styles={{ body: { padding: '20px 24px' } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: p.bgColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, color: p.color,
                }}>
                  {p.icon}
                </div>
                <div>
                  <Title level={5} style={{ margin: 0, color: textPri }}>{p.title}</Title>
                  <Text style={{ color: textSec, fontSize: 12 }}>{p.subtitle}</Text>
                </div>
              </div>

              {p.items.map((item, i) => (
                <div key={i}>
                  {i > 0 && <Divider style={{ margin: '10px 0', borderColor: dividerColor }} />}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space>
                      <span style={{ color: p.color, fontSize: 16, opacity: 0.8 }}>{item.icon}</span>
                      <div>
                        <div style={{ color: textPri, fontSize: 14, fontWeight: 500 }}>{item.label}</div>
                        <div style={{ color: textMuted, fontSize: 11, marginTop: 2, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</div>
                      </div>
                    </Space>
                    <Button
                      size="small"
                      type="primary"
                      ghost
                      style={{ borderColor: p.color, color: p.color, minWidth: 80 }}
                      onClick={() => handleAction(item.action, item.value)}
                    >
                      {item.action === 'url' ? '打开链接' : '复制路径'}
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
