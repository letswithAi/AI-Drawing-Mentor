import {
  Button,
  Space,
  Slider,
  ColorPicker,
  Tooltip,
  Divider,
  message,
} from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  ClearOutlined,
  DownloadOutlined,
  BorderOutlined,
  HighlightOutlined,
  EditOutlined,
  BgColorsOutlined,
  MinusOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";

interface CanvasToolsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  isDarkMode?: boolean;
  showError?: (message: string) => void;
}

type DrawingTool =
  | "pen"
  | "marker"
  | "highlighter"
  | "eraser"
  | "rectangle"
  | "circle"
  | "line";

export default function CanvasTools({
  canvasRef,
  onColorChange,
  onBrushSizeChange,
  isDarkMode = false,
  showError = (msg: string) => message.error(msg),
}: CanvasToolsProps) {
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState<DrawingTool>("pen");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Set canvas size if not already set
        if (canvas.width === 0) canvas.width = 800;
        if (canvas.height === 0) canvas.height = 400;

        // Set white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Save initial state
        saveState();
      }
    }
  }, []);

  const saveState = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const imageData = ctx.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        setHistory((prev) => [...prev.slice(0, historyIndex + 1), imageData]);
        setHistoryIndex((prev) => prev + 1);
      }
    }
  };

  const loadState = (imageData: ImageData) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.putImageData(imageData, 0, 0);
      }
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      loadState(history[historyIndex - 1]);
      message.success("Undone!");
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      loadState(history[historyIndex + 1]);
      message.success("Redone!");
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        saveState();
        message.success("Canvas cleared!");
      }
    }
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) {
      showError("No canvas to download");
      return;
    }

    try {
      const canvas = canvasRef.current;
      const link = document.createElement("a");
      link.download = `drawing-${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
      message.success("Drawing downloaded!");
    } catch (error) {
      showError("Failed to download drawing");
      console.error(error);
    }
  };

  const handleColorChange = (newColor: any) => {
    const colorString =
      typeof newColor === "string" ? newColor : newColor.toHexString();
    setColor(colorString);
    onColorChange(colorString);
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
    onBrushSizeChange(size);
  };

  const handleToolChange = (newTool: DrawingTool) => {
    setTool(newTool);
    // You can add tool-specific logic here if needed
  };

  const increaseBrushSize = () => {
    const newSize = Math.min(brushSize + 1, 50);
    handleBrushSizeChange(newSize);
  };

  const decreaseBrushSize = () => {
    const newSize = Math.max(brushSize - 1, 1);
    handleBrushSizeChange(newSize);
  };

  return (
    <div
      style={{
        marginBottom: "16px",
        padding: "16px",
        backgroundColor: isDarkMode ? "#1f1f1f" : "#f8f9fa",
        borderRadius: "8px",
        border: `1px solid ${isDarkMode ? "#303030" : "#e9ecef"}`,
      }}
    >
      {/* Drawing Tools */}
      <Space wrap style={{ marginBottom: "12px" }}>
        <Tooltip title="Pen">
          <Button
            type={tool === "pen" ? "primary" : "default"}
            icon={<EditOutlined />}
            onClick={() => handleToolChange("pen")}
            size="small"
          />
        </Tooltip>
        <Tooltip title="Marker">
          <Button
            type={tool === "marker" ? "primary" : "default"}
            icon={<HighlightOutlined />}
            onClick={() => handleToolChange("marker")}
            size="small"
          />
        </Tooltip>
        {/* <Tooltip title="Highlighter">
          <Button
            type={tool === "highlighter" ? "primary" : "default"}
            icon={<BgColorsOutlined />}
            onClick={() => handleToolChange("highlighter")}
            size="small"
          />
        </Tooltip> */}
        {/* <Tooltip title="Eraser">
          <Button
            type={tool === "eraser" ? "primary" : "default"}
            icon={<StopOutlined />}
            onClick={() => handleToolChange("eraser")}
            size="small"
          />
        </Tooltip> */}
        {/* <Tooltip title="Rectangle">
          <Button
            type={tool === "rectangle" ? "primary" : "default"}
            icon={<BorderOutlined />}
            onClick={() => handleToolChange("rectangle")}
            size="small"
          />
        </Tooltip> */}
      </Space>

      <Divider style={{ margin: "8px 0" }} />

      {/* Color and Size Controls */}
      <Space wrap align="center" style={{ marginBottom: "12px" }}>
        <span style={{ fontSize: "12px", color: isDarkMode ? "#fff" : "#666" }}>
          Color:
        </span>
        <ColorPicker
          value={color}
          onChange={handleColorChange}
          size="small"
          showText
        />

        <span
          style={{
            fontSize: "12px",
            color: isDarkMode ? "#fff" : "#666",
            marginLeft: "16px",
          }}
        >
          Size: {brushSize}px
        </span>
        <Button
          type="text"
          icon={<MinusOutlined />}
          size="small"
          onClick={decreaseBrushSize}
          disabled={brushSize <= 1}
        />
        <Slider
          min={1}
          max={50}
          value={brushSize}
          onChange={handleBrushSizeChange}
          style={{ width: "100px" }}
        />
        <Button
          type="text"
          icon={<PlusOutlined />}
          size="small"
          onClick={increaseBrushSize}
          disabled={brushSize >= 50}
        />
      </Space>

      <Divider style={{ margin: "8px 0" }} />

      {/* Action Buttons */}
      <Space wrap>
        <Tooltip title="Undo">
          <Button
            icon={<UndoOutlined />}
            onClick={undo}
            disabled={historyIndex <= 0}
            size="small"
          />
        </Tooltip>
        <Tooltip title="Redo">
          <Button
            icon={<RedoOutlined />}
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            size="small"
          />
        </Tooltip>
        <Tooltip title="Clear Canvas">
          <Button
            icon={<ClearOutlined />}
            onClick={clearCanvas}
            size="small"
            danger
          />
        </Tooltip>
        <Tooltip title="Download Drawing">
          <Button
            icon={<DownloadOutlined />}
            onClick={downloadCanvas}
            size="small"
            type="primary"
          />
        </Tooltip>
      </Space>
    </div>
  );
}
