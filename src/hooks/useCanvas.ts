import { useRef, useState, useCallback } from "react";

interface Point {
  x: number;
  y: number;
}

export default function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentBrushSize, setCurrentBrushSize] = useState(5);
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser">("pen");
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  const getCanvasPoint = useCallback((e: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const startDrawing = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setIsDrawing(true);
      const point = getCanvasPoint(e);
      setLastPoint(point);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = currentBrushSize;

      if (currentTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = currentColor;
      }

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    },
    [currentBrushSize, currentColor, currentTool, getCanvasPoint]
  );

  const draw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const currentPoint = getCanvasPoint(e);

      if (lastPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
      }

      setLastPoint(currentPoint);
    },
    [isDrawing, lastPoint, getCanvasPoint]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  const changeColor = useCallback((color: string) => {
    setCurrentColor(color);
    setCurrentTool("pen"); // Switch to pen when color changes
  }, []);

  const changeBrushSize = useCallback((size: number) => {
    setCurrentBrushSize(size);
  }, []);

  const changeTool = useCallback((tool: "pen" | "eraser") => {
    setCurrentTool(tool);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    changeColor,
    changeBrushSize,
    changeTool,
    clearCanvas,
    isDrawing,
    currentColor,
    currentBrushSize,
    currentTool,
  };
}
