import { Card } from 'antd';

const Welcome: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">欢迎使用 Cookie 管理器</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="快速开始" className="shadow-sm">
          <ul className="space-y-2">
            <li>• 在 CAD Settings 中配置自动清理选项</li>
            <li>• 在 List of Expressions 中管理域名表达式</li>
            <li>• 使用 Cleanup Log 查看清理历史</li>
          </ul>
        </Card>

        <Card title="功能特点" className="shadow-sm">
          <ul className="space-y-2">
            <li>• 自动清理过期 Cookie</li>
            <li>• 支持白名单和灰名单</li>
            <li>• 域名表达式匹配</li>
            <li>• 清理日志记录</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Welcome; 