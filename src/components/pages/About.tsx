import { Card } from 'antd';

const About: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">关于</h1>
      
      <div className="max-w-2xl space-y-6">
        <Card title="版本信息">
          <p>当前版本：1.0.0</p>
          <p>更新日期：2024-11-18</p>
        </Card>

        <Card title="功能介绍">
          <p>Cookie 管理器是一个强大的 Chrome 扩展，帮助您：</p>
          <ul className="list-disc list-inside mt-2">
            <li>自动清理过期的 Cookie</li>
            <li>通过白名单和灰名单管理 Cookie</li>
            <li>支持域名表达式匹配</li>
            <li>提供详细的清理日志</li>
          </ul>
        </Card>

        <Card title="联系方式">
          <p>如果您有任何问题或建议，请通过以下方式联系我们：</p>
          <ul className="list-disc list-inside mt-2">
            <li>电子邮件：yongbi1998@proton.me</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default About; 