import { useState, useEffect } from 'react';
import { Table, Button, DatePicker, Space } from 'antd';
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Moment } from 'moment';

interface LogEntry {
  id: string;
  timestamp: number;
  action: string;
  domain: string;
  details: string;
}

const CleanupLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([null, null]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const result = await chrome.storage.local.get('cleanupLogs');
      setLogs(result.cleanupLogs || []);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const clearLogs = async () => {
    try {
      await chrome.storage.local.set({ cleanupLogs: [] });
      setLogs([]);
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: '域名',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">清理日志</h1>
        <Space>
          <DatePicker.RangePicker
            onChange={(dates) => setDateRange(dates as [Moment | null, Moment | null])}
          />
          <Button 
            icon={<ReloadOutlined />}
            onClick={loadLogs}
          >
            刷新
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={clearLogs}
          >
            清空日志
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={logs}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default CleanupLog; 