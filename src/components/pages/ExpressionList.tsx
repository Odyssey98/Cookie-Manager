import { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface Expression {
  id: string;
  domain: string;
  type: 'whitelist' | 'graylist';
  options: string[];
}

const ExpressionList: React.FC = () => {
  const [expressions, setExpressions] = useState<Expression[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpression, setEditingExpression] = useState<Expression | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadExpressions();
  }, []);

  const loadExpressions = async () => {
    setLoading(true);
    try {
      const result = await chrome.storage.local.get('expressions');
      setExpressions(result.expressions || []);
    } catch (error) {
      console.error('Failed to load expressions:', error);
      message.error('加载表达式失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    try {
      const newExpression = {
        id: editingExpression?.id || Date.now().toString(),
        ...values,
      };

      let newExpressions;
      if (editingExpression) {
        newExpressions = expressions.map(exp => 
          exp.id === editingExpression.id ? newExpression : exp
        );
      } else {
        newExpressions = [...expressions, newExpression];
      }

      await chrome.storage.local.set({ expressions: newExpressions });
      setExpressions(newExpressions);
      setModalVisible(false);
      form.resetFields();
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const newExpressions = expressions.filter(exp => exp.id !== id);
      await chrome.storage.local.set({ expressions: newExpressions });
      setExpressions(newExpressions);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '域名表达式',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: '列表类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => type === 'whitelist' ? '白名单' : '灰名单',
    },
    {
      title: '选项',
      key: 'options',
      render: (text: string, record: Expression) => (
        <Space>
          <Button 
            icon={<EditOutlined />}
            onClick={() => {
              setEditingExpression(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">表达式列表</h1>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingExpression(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          添加表达式
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={expressions}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingExpression ? '编辑表达式' : '添加表达式'}
        open={modalVisible}
        onOk={form.submit}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          onFinish={handleSave}
          layout="vertical"
        >
          <Form.Item
            label="域名表达式"
            name="domain"
            rules={[{ required: true, message: '请输入域名表达式' }]}
          >
            <Input placeholder="例如: *.example.com" />
          </Form.Item>

          <Form.Item
            label="列表类型"
            name="type"
            rules={[{ required: true, message: '请选择列表类型' }]}
          >
            <Select>
              <Select.Option value="whitelist">白名单</Select.Option>
              <Select.Option value="graylist">灰名单</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="选项"
            name="options"
          >
            <Select mode="multiple">
              <Select.Option value="keepCache">保留缓存</Select.Option>
              <Select.Option value="keepIndexedDB">保留 IndexedDB</Select.Option>
              <Select.Option value="keepLocalStorage">保留本地存储</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpressionList; 