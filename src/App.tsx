import { useState } from "react";
import {
  ConfigProvider,
  theme,
  Layout,
  message,
  Switch,
  FloatButton,
} from "antd";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import Chat from "./components/Chat";
import "./index.css";

const { Header, Content } = Layout;

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [api, contextHolder] = message.useMessage();

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#7b2cbf",
          borderRadius: 12,
          fontFamily: "'Poppins', sans-serif",
        },
      }}
    >
      {contextHolder}
      <Layout className={`app-layout ${isDarkMode ? "dark-mode" : ""}`}>
        <Header className="app-header">
          <div className="header-content">
            <h1>🎨 AI Drawing Mentor</h1>
            <Switch
              checkedChildren={<BulbFilled />}
              // unCheckedChildren={<BulbOutlined />}
              checked={isDarkMode}
              onChange={handleThemeChange}
            />
          </div>
        </Header>
        <Content className="app-content">
          <Chat showError={api.error} isDarkMode={isDarkMode} />
        </Content>
        <FloatButton.BackTop />
      </Layout>
    </ConfigProvider>
  );
}
