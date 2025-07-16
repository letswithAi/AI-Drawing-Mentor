// import {
//   Button,
//   Card,
//   Input,
//   Space,
//   Typography,
//   Image,
//   Drawer,
//   message,
//   Spin,
//   Popover,
//   Divider,
// } from "antd";
// import {
//   SendOutlined,
//   DownloadOutlined,
//   AudioOutlined,
//   ShareAltOutlined,
//   CloseOutlined,
//   BulbOutlined,
//   FireOutlined,
//   StarOutlined,
//   HeartOutlined,
//   EyeOutlined,
// } from "@ant-design/icons";
// import { useState, useEffect, useRef } from "react";
// import DrawingCard from "./DrawingCard";
// import CanvasTools from "./CanvasTools";
// // Remove the duplicate import - PracticeCanvas should be a separate component
// import useApi from "../hooks/useApi";
// import useCanvas from "../hooks/useCanvas";
// import type { Message, Drawing } from "../types";

// const { Text, Title } = Typography;

// interface ExtendedMessage extends Omit<Message, "drawings"> {
//   drawings?: boolean;
//   steps?: boolean;
// }

// declare global {
//   interface Window {
//     webkitSpeechRecognition: any;
//   }
// }

// const drawingPrompts = [
//   { icon: <BulbOutlined />, text: "Try drawing a futuristic cityscape" },
//   { icon: <FireOutlined />, text: "Sketch your favorite mythical creature" },
//   { icon: <StarOutlined />, text: "Illustrate a scene from your dreams" },
//   { icon: <HeartOutlined />, text: "Draw something that makes you happy" },
//   { icon: <BulbOutlined />, text: "Create a character from your imagination" },
//   { icon: <FireOutlined />, text: "Design an alien world" },
//   { icon: <StarOutlined />, text: "Paint a sunset over mountains" },
// ];

// export default function Chat({
//   showError,
//   isDarkMode,
// }: {
//   showError: (message: string) => void;
//   isDarkMode: boolean;
// }) {
//   const [input, setInput] = useState("");
//   const [drawingPrompt, setDrawingPrompt] = useState("");
//   const [messages, setMessages] = useState<ExtendedMessage[]>([
//     {
//       role: "ai",
//       content:
//         "🎨 Hello! I'm your AI Drawing Mentor. What would you like to draw today?",
//     },
//   ]);
//   const [drawings, setDrawings] = useState<Drawing[]>([]);
//   const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
//   const [steps, setSteps] = useState<string>("");

//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [practiceDrawerVisible, setPracticeDrawerVisible] = useState(false);
//   const [difficulty, setDifficulty] = useState("");
//   const [artStyle, setArtStyle] = useState("cartoon");
//   const [showCanvas, setShowCanvas] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showDifficultySelector, setShowDifficultySelector] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const {
//     canvasRef,
//     startDrawing,
//     draw,
//     stopDrawing,
//     changeColor,
//     changeBrushSize,
//     clearCanvas,
//   } = useCanvas();

//   // Create a separate canvas hook for the practice drawer
//   const practiceCanvasHook = useCanvas();

//   const { generateDrawings, getDrawingSteps } = useApi();

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, drawings]);

//   // const handleSubmit = async () => {
//   //   if (!input.trim()) return;

//   //   const userMessage: ExtendedMessage = { role: "user", content: input };
//   //   setMessages((prev) => [...prev, userMessage]);
//   //   setInput("");
//   //   setShowDifficultySelector(true);
//   // };

//   const handleSubmit = async () => {
//     if (!input.trim()) return;

//     const userMessage: ExtendedMessage = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setDrawingPrompt(input); // Save the prompt
//     setInput("");
//     setShowDifficultySelector(true);
//   };

//   // Rename this function to avoid duplicate declaration
//   const handleSelectDifficulty = async (selectedDifficulty: string) => {
//     setDifficulty(selectedDifficulty);
//     setLoading(true);

//     try {
//       const drawings = await generateDrawings(
//         drawingPrompt, // Use the saved prompt
//         selectedDifficulty,
//         artStyle
//       );
//       setDrawings(drawings);
//       setShowDifficultySelector(false);
//     } catch (error) {
//       showError("Failed to generate drawings. Please try again.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDifficultySelect = async (selectedDifficulty: string) => {
//     setDifficulty(selectedDifficulty);
//     setLoading(true);

//     try {
//       const drawings = await generateDrawings(
//         drawingPrompt, // Use the saved prompt
//         selectedDifficulty,
//         artStyle
//       );
//       setDrawings(drawings);
//       setShowDifficultySelector(false);
//     } catch (error) {
//       showError("Failed to generate drawings. Please try again.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleDifficultySelect = async (selectedDifficulty: string) => {
//   //   setDifficulty(selectedDifficulty);
//   //   setLoading(true);

//   //   try {
//   //     const drawings = await generateDrawings(
//   //       input,
//   //       selectedDifficulty,
//   //       artStyle
//   //     );
//   //     setDrawings(drawings);
//   //     setShowDifficultySelector(false);
//   //   } catch (error) {
//   //     showError("Failed to generate drawings. Please try again.");
//   //     console.error(error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSelectDrawing = async (drawing: Drawing) => {
//     setSelectedDrawing(drawing);
//     setLoading(true);

//     try {
//       const steps = await getDrawingSteps(drawing.description, difficulty);
//       setSteps(steps);
//       setDrawerVisible(true);
//     } catch (error) {
//       showError("Failed to get drawing steps. Please try again.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Alternative PDF generation using canvas and simple approach
//   const generatePDF = async () => {
//     if (!selectedDrawing || !steps) {
//       showError("No drawing selected or steps available");
//       return;
//     }

//     try {
//       message.loading("Generating PDF...", 1);

//       const currentDate = new Date().toLocaleDateString();

//       // Create a temporary container for PDF content
//       const pdfContainer = document.createElement("div");
//       pdfContainer.style.cssText = `
//         position: fixed;
//         top: -10000px;
//         left: -10000px;
//         width: 800px;
//         background: white;
//         font-family: Arial, sans-serif;
//         padding: 40px;
//         color: #333;
//         line-height: 1.6;
//       `;

//       // Create PDF content
//       pdfContainer.innerHTML = `
//         <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1890ff; padding-bottom: 20px;">
//           <h1 style="color: #1890ff; margin: 0; font-size: 28px;">🎨 AI Drawing Mentor Guide</h1>
//           <p style="color: #666; margin: 5px 0; font-size: 16px;">How to Draw: ${
//             selectedDrawing.description
//           }</p>
//         </div>

//         <div style="display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #e6f7ff; border-radius: 8px;">
//           <div style="text-align: center;">
//             <strong style="color: #1890ff;">Difficulty Level:</strong><br>
//             ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
//           </div>
//           <div style="text-align: center;">
//             <strong style="color: #1890ff;">Art Style:</strong><br>
//             ${artStyle.charAt(0).toUpperCase() + artStyle.slice(1)}
//           </div>
//           <div style="text-align: center;">
//             <strong style="color: #1890ff;">Generated On:</strong><br>
//             ${currentDate}
//           </div>
//         </div>

//         <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
//           <img src="${selectedDrawing.imageUrl}" alt="${
//         selectedDrawing.description
//       }" style="max-width: 100%; max-height: 400px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
//         </div>

//         <div style="margin: 30px 0;">
//           <h2 style="color: #1890ff; border-bottom: 2px solid #1890ff; padding-bottom: 10px; margin-bottom: 20px;">📝 Step-by-Step Instructions</h2>
//           <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1890ff; white-space: pre-line; font-size: 14px; line-height: 1.8;">
//             ${steps}
//           </div>
//         </div>

//         <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef; padding-top: 20px;">
//           <p>• Keep practicing and have fun drawing • 🎨</p>
//         </div>
//       `;

//       document.body.appendChild(pdfContainer);

//       // Use modern approach with window.print()
//       const printWindow = window.open("", "_blank", "width=800,height=600");
//       if (!printWindow) {
//         showError("Please allow popups to download PDF");
//         document.body.removeChild(pdfContainer);
//         return;
//       }

//       printWindow.document.write(`
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Drawing Guide - ${selectedDrawing.description}</title>
//           <meta charset="utf-8">
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               margin: 0;
//               padding: 20px;
//               background: white;
//               color: #333;
//               line-height: 1.6;
//             }
//             .no-print {
//               display: block;
//               position: fixed;
//               top: 10px;
//               right: 10px;
//               background: #1890ff;
//               color: white;
//               padding: 10px 20px;
//               border: none;
//               border-radius: 5px;
//               cursor: pointer;
//               z-index: 1000;
//               font-size: 14px;
//             }
//             .no-print:hover {
//               background: #40a9ff;
//             }
//             @media print {
//               .no-print { display: none !important; }
//             }
//           </style>
//         </head>
//         <body>
//           <button class="no-print" onclick="window.print()">🖨️ Save as PDF (Ctrl+P)</button>
//           ${pdfContainer.innerHTML}

//           <script>
//             window.onload = function() {
//               setTimeout(() => {
//                 if (confirm('Ready to save as PDF? Click OK to open print dialog where you can save as PDF.')) {
//                   window.print();
//                 }
//               }, 1000);
//             };
//           </script>
//         </body>
//         </html>
//       `);

//       printWindow.document.close();
//       document.body.removeChild(pdfContainer);

//       message.success(
//         "PDF viewer opened! Use Ctrl+P or click the button to save as PDF."
//       );
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       showError("Failed to generate PDF. Please try again.");
//     }
//   };

//   const handleDownloadPDF = () => {
//     generatePDF();
//   };

//   const startVoiceInput = () => {
//     if ("webkitSpeechRecognition" in window) {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.lang = "en-US";
//       recognition.onresult = (event: any) => {
//         const transcript = event.results[0][0].transcript;
//         setInput(transcript);
//       };
//       recognition.onerror = (event: any) => {
//         showError("Voice recognition error: " + event.error);
//       };
//       recognition.start();
//     } else {
//       showError("Voice recognition not supported in your browser");
//     }
//   };

//   const openPracticeDrawer = () => {
//     setPracticeDrawerVisible(true);
//   };

//   const clearDrawings = () => {
//     setDrawings([]);
//     setShowDifficultySelector(false);
//     setDifficulty("");
//     setSelectedDrawing(null);
//     setSteps("");
//   };

//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     startDrawing(e.nativeEvent);
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     draw(e.nativeEvent);
//   };

//   const handleMouseUp = () => {
//     stopDrawing();
//   };

//   const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
//     startDrawing(e.nativeEvent);
//   };

//   const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
//     draw(e.nativeEvent);
//   };

//   const handleTouchEnd = () => {
//     stopDrawing();
//   };

//   // Practice canvas event handlers
//   const handlePracticeMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     practiceCanvasHook.startDrawing(e.nativeEvent);
//   };

//   const handlePracticeMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     practiceCanvasHook.draw(e.nativeEvent);
//   };

//   const handlePracticeMouseUp = () => {
//     practiceCanvasHook.stopDrawing();
//   };

//   const handlePracticeTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
//     practiceCanvasHook.startDrawing(e.nativeEvent);
//   };

//   const handlePracticeTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
//     practiceCanvasHook.draw(e.nativeEvent);
//   };

//   const handlePracticeTouchEnd = () => {
//     practiceCanvasHook.stopDrawing();
//   };

//   return (
//     <div className="chat-container">
//       {loading && (
//         <div className="loading-overlay">
//           <Spin size="large" tip="Generating your drawing guide..." />
//         </div>
//       )}

//       <div className="messages-container">
//         {/* Drawing Prompt Carousel */}
//         {messages.length <= 1 && !drawings.length && (
//           <div className="drawing-carousel">
//             <div className="carousel-track">
//               {[...drawingPrompts, ...drawingPrompts].map((prompt, index) => (
//                 <div key={index} className="carousel-item">
//                   <span className="icon">{prompt.icon}</span>
//                   <span>{prompt.text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.role}`}>
//             <Card
//               bordered={false}
//               style={{
//                 backgroundColor:
//                   msg.role === "ai"
//                     ? isDarkMode
//                       ? "#1f1f1f"
//                       : "#f9f0ff"
//                     : isDarkMode
//                     ? "#141414"
//                     : "#f0f5ff",
//                 borderRadius: "18px",
//                 marginBottom: "16px",
//               }}
//             >
//               <Text
//                 style={{
//                   color: isDarkMode ? "rgba(255, 255, 255, 0.85)" : undefined,
//                 }}
//               >
//                 {msg.content}
//               </Text>
//             </Card>
//           </div>
//         ))}

//         {/* Drawings Grid */}
//         {drawings.length > 0 && (
//           <div className="drawings-section">
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "16px",
//               }}
//             >
//               <Title level={4} style={{ margin: 0 }}>
//                 {drawingPrompt} drawing ideas ({difficulty} level)
//               </Title>
//               <Button
//                 type="text"
//                 icon={<CloseOutlined />}
//                 onClick={clearDrawings}
//                 style={{
//                   color: isDarkMode
//                     ? "rgba(255, 255, 255, 0.85)"
//                     : "rgba(0, 0, 0, 0.85)",
//                 }}
//               />
//             </div>
//             <div className="drawing-grid">
//               {drawings.map((drawing, i) => (
//                 <DrawingCard
//                   key={i}
//                   drawing={drawing}
//                   onSelect={handleSelectDrawing}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Canvas Area */}
//         {showCanvas && (
//           <Card
//             title="Practice Drawing"
//             style={{ marginBottom: "16px" }}
//             extra={
//               <Button
//                 type="text"
//                 icon={<CloseOutlined />}
//                 onClick={() => setShowCanvas(false)}
//               />
//             }
//           >
//             <CanvasTools
//               canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
//               onColorChange={changeColor}
//               onBrushSizeChange={changeBrushSize}
//               isDarkMode={isDarkMode}
//               showError={showError}
//             />
//             <canvas
//               ref={canvasRef}
//               width="800"
//               height="400"
//               style={{
//                 border: "1px solid #d9d9d9",
//                 borderRadius: "8px",
//                 backgroundColor: "white",
//                 touchAction: "none",
//                 width: "100%",
//                 maxWidth: "800px",
//               }}
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//               onMouseLeave={handleMouseUp}
//               onTouchStart={handleTouchStart}
//               onTouchMove={handleTouchMove}
//               onTouchEnd={handleTouchEnd}
//             />
//           </Card>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Difficulty Selector */}
//       {showDifficultySelector && !drawings.length && (
//         <Card
//           style={{
//             marginBottom: "16px",
//             backgroundColor: isDarkMode ? "#1f1f1f" : "#f9f0ff",
//           }}
//         >
//           <div style={{ textAlign: "center" }}>
//             <Title level={4} style={{ marginBottom: "16px" }}>
//               • Select difficulty level • {input}
//             </Title>
//             <Space size="large">
//               <Button
//                 type={difficulty === "beginner" ? "primary" : "default"}
//                 onClick={() => handleDifficultySelect("beginner")}
//               >
//                 Beginner
//               </Button>
//               <Button
//                 type={difficulty === "intermediate" ? "primary" : "default"}
//                 onClick={() => handleDifficultySelect("intermediate")}
//               >
//                 Intermediate
//               </Button>
//               <Button
//                 type={difficulty === "advanced" ? "primary" : "default"}
//                 onClick={() => handleDifficultySelect("advanced")}
//               >
//                 Advanced
//               </Button>
//             </Space>
//           </div>
//         </Card>
//       )}

//       {/* Input Area */}
//       <div className="input-container">
//         <Space.Compact style={{ width: "100%" }}>
//           <Input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="What would you like to draw today?"
//             size="large"
//             onPressEnter={handleSubmit}
//             suffix={
//               <Popover content="Voice Input">
//                 <Button
//                   type="text"
//                   icon={<AudioOutlined />}
//                   onClick={startVoiceInput}
//                 />
//               </Popover>
//             }
//           />
//           <Button
//             style={{
//               padding: "20px 20px", // match horizontal padding, remove top margin
//               height: "100%", // ensures vertical alignment with Input
//             }}
//             type="primary"
//             size="large"
//             onClick={handleSubmit}
//             icon={<SendOutlined />}
//           />
//         </Space.Compact>

//         <Divider style={{ margin: "16px 0", textAlign: "center" }}>
//           <span
//             style={{
//               color: "#6C5CE7", // elegant violet-blue
//               fontWeight: "600",
//               fontSize: "18px",
//               letterSpacing: "0.5px",
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "8px",
//             }}
//           >
//             Drawing Mentor
//           </span>
//         </Divider>

//         {/* <Button
//           type="dashed"
//           block
//           onClick={() => setShowCanvas(!showCanvas)}
//           size="large"
//         >
//           {showCanvas ? "Hide Drawing Pad" : "Show Drawing Pad"}
//         </Button> */}
//       </div>

//       {/* Drawing Preview Right Drawer */}
//       <Drawer
//         title={`Drawing Guide: ${selectedDrawing?.description || ""}`}
//         placement="right"
//         onClose={() => setDrawerVisible(false)}
//         open={drawerVisible}
//         width={700}
//         extra={
//           <Space>
//             <Button onClick={openPracticeDrawer}>Practice</Button>
//             <Button
//               type="primary"
//               icon={<DownloadOutlined />}
//               onClick={handleDownloadPDF}
//             >
//               Download PDF
//             </Button>
//           </Space>
//         }
//       >
//         {selectedDrawing && (
//           <div>
//             <div style={{ textAlign: "center", marginBottom: "20px" }}>
//               <Image
//                 src={selectedDrawing.imageUrl}
//                 alt={selectedDrawing.description}
//                 style={{
//                   borderRadius: "8px",
//                   maxHeight: "400px",
//                   width: "100%",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                 }}
//                 preview={{
//                   mask: <EyeOutlined />,
//                 }}
//               />
//             </div>

//             <div style={{ marginBottom: "16px" }}>
//               <Title
//                 level={4}
//                 style={{ color: "#1890ff", marginBottom: "12px" }}
//               >
//                 📝 Step-by-Step Instructions ({difficulty} level)
//               </Title>
//               <div
//                 style={{
//                   whiteSpace: "pre-line",
//                   padding: "20px",
//                   background: isDarkMode ? "#1f1f1f" : "#f8f9fa",
//                   borderRadius: "8px",
//                   border: `1px solid ${isDarkMode ? "#303030" : "#e9ecef"}`,
//                   borderLeft: "4px solid #1890ff",
//                   lineHeight: "1.6",
//                 }}
//               >
//                 {steps}
//               </div>
//             </div>
//           </div>
//         )}
//       </Drawer>

//       {/* Practice Canvas Left Drawer */}
//       <Drawer
//         title="Practice Drawing Canvas"
//         placement="left"
//         onClose={() => setPracticeDrawerVisible(false)}
//         open={practiceDrawerVisible}
//         width={600}
//         mask={false}
//       >
//         <div>
//           <CanvasTools
//             canvasRef={
//               practiceCanvasHook.canvasRef as React.RefObject<HTMLCanvasElement>
//             }
//             onColorChange={practiceCanvasHook.changeColor}
//             onBrushSizeChange={practiceCanvasHook.changeBrushSize}
//             isDarkMode={isDarkMode}
//             showError={showError}
//           />
//           <canvas
//             ref={practiceCanvasHook.canvasRef}
//             width="550"
//             height="400"
//             style={{
//               border: "1px solid #d9d9d9",
//               borderRadius: "8px",
//               backgroundColor: "white",
//               touchAction: "none",
//               width: "100%",
//               maxWidth: "550px",
//             }}
//             onMouseDown={handlePracticeMouseDown}
//             onMouseMove={handlePracticeMouseMove}
//             onMouseUp={handlePracticeMouseUp}
//             onMouseLeave={handlePracticeMouseUp}
//             onTouchStart={handlePracticeTouchStart}
//             onTouchMove={handlePracticeTouchMove}
//             onTouchEnd={handlePracticeTouchEnd}
//           />
//         </div>
//       </Drawer>
//     </div>
//   );
// }

import {
  Button,
  Card,
  Input,
  Space,
  Typography,
  Image,
  Drawer,
  message,
  Spin,
  Popover,
  Divider,
} from "antd";
import {
  SendOutlined,
  DownloadOutlined,
  AudioOutlined,
  // ShareAltOutlined,
  CloseOutlined,
  BulbOutlined,
  FireOutlined,
  StarOutlined,
  HeartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import DrawingCard from "./DrawingCard";
import CanvasTools from "./CanvasTools";
import useApi from "../hooks/useApi";
import useCanvas from "../hooks/useCanvas";
import type { Message, Drawing } from "../types";

const { Text, Title } = Typography;

interface ExtendedMessage extends Omit<Message, "drawings"> {
  drawings?: boolean;
  steps?: boolean;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const drawingPrompts = [
  { icon: <BulbOutlined />, text: "Try drawing a futuristic cityscape" },
  { icon: <FireOutlined />, text: "Sketch your favorite mythical creature" },
  { icon: <StarOutlined />, text: "Illustrate a scene from your dreams" },
  { icon: <HeartOutlined />, text: "Draw something that makes you happy" },
  { icon: <BulbOutlined />, text: "Create a character from your imagination" },
  { icon: <FireOutlined />, text: "Design an alien world" },
  { icon: <StarOutlined />, text: "Paint a sunset over mountains" },
];

export default function Chat({
  showError,
  isDarkMode,
}: {
  showError: (message: string) => void;
  isDarkMode: boolean;
}) {
  const [input, setInput] = useState("");
  const [drawingPrompt, setDrawingPrompt] = useState("");
  const [messages, setMessages] = useState<ExtendedMessage[]>([
    {
      role: "ai",
      content:
        "🎨 Hello! I'm your AI Drawing Mentor. What would you like to draw today?",
    },
  ]);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [steps, setSteps] = useState<string>("");

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [practiceDrawerVisible, setPracticeDrawerVisible] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [artStyle] = useState("cartoon");
  const [showCanvas, setShowCanvas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    changeColor,
    changeBrushSize,
    // clearCanvas,
  } = useCanvas();

  const practiceCanvasHook = useCanvas();

  const { generateDrawings, getDrawingSteps } = useApi();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, drawings]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage: ExtendedMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setDrawingPrompt(input);
    setInput("");
    setShowDifficultySelector(true);
  };

  const handleDifficultySelect = async (selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty);
    setLoading(true);

    try {
      const drawings = await generateDrawings(
        drawingPrompt,
        selectedDifficulty,
        artStyle
      );
      setDrawings(drawings);
      setShowDifficultySelector(false);
    } catch (error) {
      showError("Failed to generate drawings. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDrawing = async (drawing: Drawing) => {
    setSelectedDrawing(drawing);
    setLoading(true);

    try {
      const steps = await getDrawingSteps(drawing.description, difficulty);
      setSteps(steps);
      setDrawerVisible(true);
    } catch (error) {
      showError("Failed to get drawing steps. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!selectedDrawing || !steps) {
      showError("No drawing selected or steps available");
      return;
    }

    try {
      message.loading("Generating PDF...", 1);

      const currentDate = new Date().toLocaleDateString();

      const pdfContainer = document.createElement("div");
      pdfContainer.style.cssText = `
        position: fixed;
        top: -10000px;
        left: -10000px;
        width: 800px;
        background: white;
        font-family: Arial, sans-serif;
        padding: 40px;
        color: #333;
        line-height: 1.6;
      `;

      pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1890ff; padding-bottom: 20px;">
          <h1 style="color: #1890ff; margin: 0; font-size: 28px;">🎨 AI Drawing Mentor Guide</h1>
          <p style="color: #666; margin: 5px 0; font-size: 16px;">How to Draw: ${
            selectedDrawing.description
          }</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #e6f7ff; border-radius: 8px;">
          <div style="text-align: center;">
            <strong style="color: #1890ff;">Difficulty Level:</strong><br>
            ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </div>
          <div style="text-align: center;">
            <strong style="color: #1890ff;">Art Style:</strong><br>
            ${artStyle.charAt(0).toUpperCase() + artStyle.slice(1)}
          </div>
          <div style="text-align: center;">
            <strong style="color: #1890ff;">Generated On:</strong><br>
            ${currentDate}
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
          <img src="${selectedDrawing.imageUrl}" alt="${
        selectedDrawing.description
      }" style="max-width: 100%; max-height: 400px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
        </div>

        <div style="margin: 30px 0;">
          <h2 style="color: #1890ff; border-bottom: 2px solid #1890ff; padding-bottom: 10px; margin-bottom: 20px;">📝 Step-by-Step Instructions</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1890ff; white-space: pre-line; font-size: 14px; line-height: 1.8;">
            ${steps}
          </div>
        </div>

        <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e9ecef; padding-top: 20px;">
          <p>• Keep practicing and have fun drawing • 🎨</p>
        </div>
      `;

      document.body.appendChild(pdfContainer);

      const printWindow = window.open("", "_blank", "width=800,height=600");
      if (!printWindow) {
        showError("Please allow popups to download PDF");
        document.body.removeChild(pdfContainer);
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Drawing Guide - ${selectedDrawing.description}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #333;
              line-height: 1.6;
            }
            .no-print {
              display: block;
              position: fixed;
              top: 10px;
              right: 10px;
              background: #1890ff;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              z-index: 1000;
              font-size: 14px;
            }
            .no-print:hover {
              background: #40a9ff;
            }
            @media print {
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <button class="no-print" onclick="window.print()">🖨️ Save as PDF (Ctrl+P)</button>
          ${pdfContainer.innerHTML}
          
          <script>
            window.onload = function() {
              setTimeout(() => {
                if (confirm('Ready to save as PDF? Click OK to open print dialog where you can save as PDF.')) {
                  window.print();
                }
              }, 1000);
            };
          </script>
        </body>
        </html>
      `);

      printWindow.document.close();
      document.body.removeChild(pdfContainer);

      message.success(
        "PDF viewer opened! Use Ctrl+P or click the button to save as PDF."
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      showError("Failed to generate PDF. Please try again.");
    }
  };

  const handleDownloadPDF = () => {
    generatePDF();
  };

  const startVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.onerror = (event: any) => {
        showError("Voice recognition error: " + event.error);
      };
      recognition.start();
    } else {
      showError("Voice recognition not supported in your browser");
    }
  };

  const openPracticeDrawer = () => {
    setPracticeDrawerVisible(true);
  };

  const clearDrawings = () => {
    setDrawings([]);
    setShowDifficultySelector(false);
    setDifficulty("");
    setSelectedDrawing(null);
    setSteps("");
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    startDrawing(e.nativeEvent);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    draw(e.nativeEvent);
  };

  const handleMouseUp = () => {
    stopDrawing();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    startDrawing(e.nativeEvent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    draw(e.nativeEvent);
  };

  const handleTouchEnd = () => {
    stopDrawing();
  };

  const handlePracticeMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    practiceCanvasHook.startDrawing(e.nativeEvent);
  };

  const handlePracticeMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    practiceCanvasHook.draw(e.nativeEvent);
  };

  const handlePracticeMouseUp = () => {
    practiceCanvasHook.stopDrawing();
  };

  const handlePracticeTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    practiceCanvasHook.startDrawing(e.nativeEvent);
  };

  const handlePracticeTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    practiceCanvasHook.draw(e.nativeEvent);
  };

  const handlePracticeTouchEnd = () => {
    practiceCanvasHook.stopDrawing();
  };

  return (
    <div className="chat-container">
      {loading && (
        <div className="loading-overlay">
          <Spin size="large" tip="Generating your drawing guide..." />
        </div>
      )}

      <div className="messages-container">
        {messages.length <= 1 && !drawings.length && (
          <div className="drawing-carousel">
            <div className="carousel-track">
              {[...drawingPrompts, ...drawingPrompts].map((prompt, index) => (
                <div key={index} className="carousel-item">
                  <span className="icon">{prompt.icon}</span>
                  <span>{prompt.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <Card
              bordered={false}
              style={{
                backgroundColor:
                  msg.role === "ai"
                    ? isDarkMode
                      ? "#1f1f1f"
                      : "#f9f0ff"
                    : isDarkMode
                    ? "#141414"
                    : "#f0f5ff",
                borderRadius: "18px",
                marginBottom: "16px",
              }}
            >
              <Text
                style={{
                  color: isDarkMode ? "rgba(255, 255, 255, 0.85)" : undefined,
                }}
              >
                {msg.content}
              </Text>
            </Card>
          </div>
        ))}

        {drawings.length > 0 && (
          <div className="drawings-section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                {drawingPrompt} drawing ideas ({difficulty} level)
              </Title>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={clearDrawings}
                style={{
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.85)"
                    : "rgba(0, 0, 0, 0.85)",
                }}
              />
            </div>
            <div className="drawing-grid">
              {drawings.map((drawing, i) => (
                <DrawingCard
                  key={i}
                  drawing={drawing}
                  onSelect={handleSelectDrawing}
                />
              ))}
            </div>
          </div>
        )}

        {showCanvas && (
          <Card
            title="Practice Drawing"
            style={{ marginBottom: "16px" }}
            extra={
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setShowCanvas(false)}
              />
            }
          >
            <CanvasTools
              canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
              onColorChange={changeColor}
              onBrushSizeChange={changeBrushSize}
              isDarkMode={isDarkMode}
              showError={showError}
            />
            <canvas
              ref={canvasRef}
              width="800"
              height="400"
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
                backgroundColor: "white",
                touchAction: "none",
                width: "100%",
                maxWidth: "800px",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </Card>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showDifficultySelector && !drawings.length && (
        <Card
          style={{
            marginBottom: "16px",
            backgroundColor: isDarkMode ? "#1f1f1f" : "#f9f0ff",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Title level={4} style={{ marginBottom: "16px" }}>
              • Select difficulty level • {input}
            </Title>
            <Space size="large">
              <Button
                type={difficulty === "beginner" ? "primary" : "default"}
                onClick={() => handleDifficultySelect("beginner")}
              >
                Beginner
              </Button>
              <Button
                type={difficulty === "intermediate" ? "primary" : "default"}
                onClick={() => handleDifficultySelect("intermediate")}
              >
                Intermediate
              </Button>
              <Button
                type={difficulty === "advanced" ? "primary" : "default"}
                onClick={() => handleDifficultySelect("advanced")}
              >
                Advanced
              </Button>
            </Space>
          </div>
        </Card>
      )}

      <div className="input-container">
        <Space.Compact style={{ width: "100%" }}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What would you like to draw today?"
            size="large"
            onPressEnter={handleSubmit}
            suffix={
              <Popover content="Voice Input">
                <Button
                  type="text"
                  icon={<AudioOutlined />}
                  onClick={startVoiceInput}
                />
              </Popover>
            }
          />
          <Button
            style={{
              padding: "20px 20px",
              height: "100%",
            }}
            type="primary"
            size="large"
            onClick={handleSubmit}
            icon={<SendOutlined />}
          />
        </Space.Compact>

        <Divider style={{ margin: "16px 0", textAlign: "center" }}>
          <span
            style={{
              color: "#6C5CE7",
              fontWeight: "600",
              fontSize: "18px",
              letterSpacing: "0.5px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Drawing Mentor
          </span>
        </Divider>
      </div>

      <Drawer
        title={`Drawing Guide: ${selectedDrawing?.description || ""}`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={700}
        extra={
          <Space>
            <Button onClick={openPracticeDrawer}>Practice</Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </Space>
        }
      >
        {selectedDrawing && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Image
                src={selectedDrawing.imageUrl}
                alt={selectedDrawing.description}
                style={{
                  borderRadius: "8px",
                  maxHeight: "400px",
                  width: "100%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                preview={{
                  mask: <EyeOutlined />,
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <Title
                level={4}
                style={{ color: "#1890ff", marginBottom: "12px" }}
              >
                📝 Step-by-Step Instructions ({difficulty} level)
              </Title>
              <div
                style={{
                  whiteSpace: "pre-line",
                  padding: "20px",
                  background: isDarkMode ? "#1f1f1f" : "#f8f9fa",
                  borderRadius: "8px",
                  border: `1px solid ${isDarkMode ? "#303030" : "#e9ecef"}`,
                  borderLeft: "4px solid #1890ff",
                  lineHeight: "1.6",
                }}
              >
                {steps}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Drawer
        title="Practice Drawing Canvas"
        placement="left"
        onClose={() => setPracticeDrawerVisible(false)}
        open={practiceDrawerVisible}
        width={600}
        mask={false}
      >
        <div>
          <CanvasTools
            canvasRef={
              practiceCanvasHook.canvasRef as React.RefObject<HTMLCanvasElement>
            }
            onColorChange={practiceCanvasHook.changeColor}
            onBrushSizeChange={practiceCanvasHook.changeBrushSize}
            isDarkMode={isDarkMode}
            showError={showError}
          />
          <canvas
            ref={practiceCanvasHook.canvasRef}
            width="550"
            height="400"
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              backgroundColor: "white",
              touchAction: "none",
              width: "100%",
              maxWidth: "550px",
            }}
            onMouseDown={handlePracticeMouseDown}
            onMouseMove={handlePracticeMouseMove}
            onMouseUp={handlePracticeMouseUp}
            onMouseLeave={handlePracticeMouseUp}
            onTouchStart={handlePracticeTouchStart}
            onTouchMove={handlePracticeTouchMove}
            onTouchEnd={handlePracticeTouchEnd}
          />
        </div>
      </Drawer>
    </div>
  );
}
