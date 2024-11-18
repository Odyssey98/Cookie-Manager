import { Form, Switch, InputNumber, Button, message } from 'antd';

interface CadSettingsProps {
  settings: any;
  onSaveSettings: (settings: any) => Promise<void>;
}

const CadSettings: React.FC<CadSettingsProps> = ({ settings, onSaveSettings }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await onSaveSettings(values);
      message.success('设置已保存');
    } catch (error) {
      message.error('保存设置失败');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">CAD 设置</h1>
      
      <Form
        form={form}
        initialValues={settings}
        onFinish={handleSubmit}
        layout="vertical"
        className="max-w-2xl"
      >
        <Form.Item
          label="启用自动清理"
          name="enableAutoCleaning"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="自动清理延迟时间（秒）"
          name="cleaningDelay"
          rules={[{ required: true, message: '请输入延迟时间' }]}
        >
          <InputNumber min={0} max={3600} />
        </Form.Item>

        <Form.Item
          label="启用未加载标签页清理"
          name="enableTabCleanup"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="启用域名变更清理"
          name="enableDomainChangeCleanup"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="浏览器重启时清理灰名单"
          name="enableGraylistCleanup"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="启动时清理打开标签页的 Cookie"
          name="cleanOpenTabsOnStartup"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CadSettings; 