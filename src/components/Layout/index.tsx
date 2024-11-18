import { useState, useEffect } from 'react';
import { HomeIcon, CogIcon, ListBulletIcon, ClockIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import CookieManager from '../CookieManager';
import CadSettings from '../pages/CadSettings';
import ExpressionList from '../pages/ExpressionList';
import CleanupLog from '../pages/CleanupLog';
import About from '../pages/About';

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { 
    id: 'cookie', 
    title: 'Cookie 管理器',
    icon: <HomeIcon className="w-4 h-4" />
  },
  { 
    id: 'settings', 
    title: 'CAD 设置',
    icon: <CogIcon className="w-4 h-4" />
  },
  { 
    id: 'expressions', 
    title: '表达式列表',
    icon: <ListBulletIcon className="w-4 h-4" />
  },
  { 
    id: 'cleanup', 
    title: '清理日志',
    icon: <ClockIcon className="w-4 h-4" />
  },
  { 
    id: 'about', 
    title: '关于',
    icon: <InformationCircleIcon className="w-4 h-4" />
  }
];

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cookie');
  const [settings, setSettings] = useState({
    enableAutoCleaning: false,
    cleaningDelay: 30,
    enableTabCleanup: false,
    enableDomainChangeCleanup: false,
    enableGraylistCleanup: false,
    cleanOpenTabsOnStartup: false
  });

  // 加载设置
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await chrome.storage.local.get('settings');
        if (result.settings) {
          setSettings(result.settings);
        }
      } catch (error) {
        console.error('加载设置失败:', error);
      }
    };
    loadSettings();
  }, []);

  // 保存设置
  const handleSaveSettings = async (newSettings: any) => {
    try {
      await chrome.storage.local.set({ settings: newSettings });
      setSettings(newSettings);
    } catch (error) {
      throw new Error('保存设置失败');
    }
  };

  // 获取当前活动组件
  const getActiveComponent = () => {
    switch (activeTab) {
      case 'cookie':
        return <CookieManager />;
      case 'settings':
        return <CadSettings settings={settings} onSaveSettings={handleSaveSettings} />;
      case 'expressions':
        return <ExpressionList />;
      case 'cleanup':
        return <CleanupLog />;
      case 'about':
        return <About />;
      default:
        return <CookieManager />;
    }
  };

  return (
    <div className="flex h-full">
      {/* 侧边栏 */}
      <div className="w-14 flex-shrink-0 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
        <div className="p-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400">CAD</div>
          <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">1.0.0</div>
        </div>
        
        <nav className="mt-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex flex-col items-center p-2 text-xs
                ${activeTab === item.id 
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black' 
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
            >
              {item.icon}
              <span className="mt-1 text-[10px] whitespace-nowrap">{item.title}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {getActiveComponent()}
      </div>
    </div>
  );
};

export default Layout; 