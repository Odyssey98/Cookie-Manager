import { useCallback, useState, useEffect, useMemo } from "react";
import { Button, Input, message, Checkbox } from 'antd';
import { SearchOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';

interface Cookie {
  domain: string;
  name: string;
  value: string;
  path: string;
  expirationDate?: number;
  secure: boolean;
  httpOnly: boolean;
  sameSite: string;
}

const CookieManager: React.FC = () => {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCookies, setSelectedCookies] = useState<Cookie[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取所有 cookies
  const fetchCookies = useCallback(async () => {
    try {
      setLoading(true);
      const allCookies = await chrome.cookies.getAll({});
      setCookies(allCookies);
    } catch (error) {
      message.error('获取 Cookie 失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 组件加载时获取 cookies
  useEffect(() => {
    fetchCookies();
  }, [fetchCookies]);

  // 删除单个 cookie
  const deleteCookie = async (cookie: Cookie) => {
    try {
      await chrome.cookies.remove({
        url: `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`,
        name: cookie.name,
      });
      message.success('删除成功');
      fetchCookies();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 批量删除能
  const batchDelete = async () => {
    try {
      await Promise.all(
        selectedCookies.map(cookie => deleteCookie(cookie))
      );
      setSelectedCookies([]);
      message.success('批量删除成功');
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  // 添加到白名单/灰名单
  const addToList = async (cookie: Cookie, listType: 'white' | 'gray') => {
    try {
      const key = `${listType}List`;
      const list = await chrome.storage.local.get(key);
      const cookieId = `${cookie.domain}:${cookie.name}`;
      
      // 检查是否已存在
      if (list[key]?.includes(cookieId)) {
        message.info('该 Cookie 已在列表中');
        return;
      }

      await chrome.storage.local.set({
        [key]: [...(list[key] || []), cookieId]
      });
      message.success(`已添加到${listType === 'white' ? '白' : '灰'}名单`);
    } catch (error) {
      message.error('添加失败');
    }
  };

  // 优化搜索逻辑
  const filteredCookies = useMemo(() => {
    if (!searchTerm) return cookies;
    
    const searchLower = searchTerm.toLowerCase();
    return cookies.filter(cookie => {
      const domain = cookie.domain.toLowerCase();
      const name = cookie.name.toLowerCase();
      return domain.includes(searchLower) || name.includes(searchLower);
    });
  }, [cookies, searchTerm]);

  // 使用防抖处理搜索输入
  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);  // 300ms 延迟

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    setSelectedCookies(checked ? filteredCookies : []);
  };

  // 处理单个选择
  const handleSelect = (cookie: Cookie, checked: boolean) => {
    if (checked) {
      setSelectedCookies([...selectedCookies, cookie]);
    } else {
      setSelectedCookies(selectedCookies.filter(c => 
        c.domain !== cookie.domain || c.name !== cookie.name
      ));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 顶部操作栏 */}
      <div className="p-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-2">
          <Button size="small">导出设置</Button>
          <Button size="small">导入设置</Button>
          <Button size="small" danger>恢复默认</Button>
        </div>
        <Button 
          size="small"
          icon={<ReloadOutlined />}
          onClick={fetchCookies} 
          loading={loading}
        >
          刷新
        </Button>
      </div>

      {/* 搜索和批量操作区 */}
      <div className="p-3 space-y-3 border-b border-zinc-200 dark:border-zinc-800">
        <Input
          size="small"
          prefix={<SearchOutlined />}
          placeholder="搜索 Cookie..."
          onChange={e => handleSearch(e.target.value)}
        />

        <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
          <Checkbox
            checked={selectedCookies.length === filteredCookies.length}
            indeterminate={selectedCookies.length > 0 && selectedCookies.length < filteredCookies.length}
            onChange={e => handleSelectAll(e.target.checked)}
          >
            全选
          </Checkbox>
          <Button 
            size="small"
            danger 
            icon={<DeleteOutlined />}
            disabled={selectedCookies.length === 0}
            onClick={batchDelete}
          >
            批量删除
          </Button>
        </div>
      </div>

      {/* Cookie 列表 */}
      <div className="flex-1 overflow-auto p-3">
        <div className="space-y-2">
          {filteredCookies.map(cookie => (
            <div
              key={`${cookie.domain}:${cookie.name}`}
              className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg group border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedCookies.some(
                    selected => selected.domain === cookie.domain && selected.name === cookie.name
                  )}
                  onChange={e => handleSelect(cookie, e.target.checked)}
                />
                <div className="flex-1 text-sm">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {cookie.domain}
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1 mt-2 text-zinc-600 dark:text-zinc-400">
                    <div className="text-right">名称:</div>
                    <div>{cookie.name}</div>
                    <div className="text-right">值:</div>
                    <div className="truncate">{cookie.value}</div>
                    <div className="text-right">路径:</div>
                    <div>{cookie.path}</div>
                    <div className="text-right">过期时间:</div>
                    <div>
                      {cookie.expirationDate 
                        ? new Date(cookie.expirationDate * 1000).toLocaleString('zh-CN')
                        : '会话 Cookie'
                      }
                    </div>
                    <div className="text-right">安全标志:</div>
                    <div>{cookie.secure ? '是' : '否'}</div>
                    <div className="text-right">HttpOnly:</div>
                    <div>{cookie.httpOnly ? '是' : '否'}</div>
                    <div className="text-right">SameSite:</div>
                    <div>{cookie.sameSite}</div>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                  <Button 
                    size="small"
                    className="border-zinc-200 dark:border-zinc-700 dark:text-zinc-300"
                    onClick={() => addToList(cookie, 'gray')}
                  >
                    加入灰名单
                  </Button>
                  <Button 
                    size="small"
                    className="border-zinc-200 dark:border-zinc-700 dark:text-zinc-300"
                    onClick={() => addToList(cookie, 'white')}
                  >
                    加入白名单
                  </Button>
                  <Button 
                    size="small" 
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteCookie(cookie)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CookieManager; 