import { Radio, Card, Typography, Space } from "antd";
import { SmileOutlined, MehOutlined, RocketOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function DifficultySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Card bordered={false} bodyStyle={{ padding: "8px" }}>
      <Radio.Group
        onChange={(e) => onChange(e.target.value)}
        value={value}
        buttonStyle="solid"
        style={{ width: "100%" }}
      >
        <Space size="middle" style={{ width: "100%" }}>
          <Radio.Button value="beginner">
            <Space size="small">
              <SmileOutlined />
              <Text>Beginner</Text>
            </Space>
          </Radio.Button>
          <Radio.Button value="intermediate">
            <Space size="small">
              <MehOutlined />
              <Text>Intermediate</Text>
            </Space>
          </Radio.Button>
          <Radio.Button value="advanced">
            <Space size="small">
              <RocketOutlined />
              <Text>Advanced</Text>
            </Space>
          </Radio.Button>
        </Space>
      </Radio.Group>
    </Card>
  );
}
