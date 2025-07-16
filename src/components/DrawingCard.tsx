// import { Card, Image, Button, Space, Tag, Typography } from "antd";
// import { EyeOutlined, YoutubeOutlined } from "@ant-design/icons";

// const { Text } = Typography;

// interface Drawing {
//   description: string;
//   imageUrl: string;
//   colors: string[];
//   videoTutorial: string;
// }

// export default function DrawingCard({
//   drawing,
//   onSelect,
// }: {
//   drawing: Drawing;
//   onSelect: (drawing: Drawing) => void;
// }) {
//   return (
//     <Card
//       hoverable
//       cover={
//         <Image
//           src={drawing.imageUrl}
//           alt={drawing.description}
//           preview={{ mask: <EyeOutlined /> }}
//           style={{ height: "200px", objectFit: "cover" }}
//         />
//       }
//       onClick={() => onSelect(drawing)}
//       bodyStyle={{ padding: "12px" }}
//     >
//       <div style={{ height: "80px", overflow: "hidden" }}>
//         <Text strong>{drawing.description}</Text>
//       </div>

//       {drawing.colors && (
//         <Space size="small" style={{ marginTop: "8px" }}>
//           {drawing.colors.map((color: string, i: number) => (
//             <Tag
//               color={color}
//               key={i}
//               style={{ width: "20px", height: "20px", padding: 0 }}
//             />
//           ))}
//         </Space>
//       )}

//       {drawing.videoTutorial && (
//         <Button
//           type="link"
//           icon={<YoutubeOutlined />}
//           href={drawing.videoTutorial}
//           target="_blank"
//           onClick={(e) => e.stopPropagation()}
//           style={{ padding: 0, marginTop: "8px" }}
//         >
//           Video Tutorial
//         </Button>
//       )}
//     </Card>
//   );
// }

import { Card, Image, Button, Space, Tag, Typography } from "antd";
import { EyeOutlined, YoutubeOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Drawing {
  description: string;
  imageUrl: string;
  colors: string[];
  videoTutorial: string;
}

export default function DrawingCard({
  drawing,
  onSelect,
}: {
  drawing: Drawing;
  onSelect: (drawing: Drawing) => void;
}) {
  return (
    <Card
      hoverable
      cover={
        <div onClick={(e) => e.stopPropagation()}>
          <Image
            src={drawing.imageUrl}
            alt={drawing.description}
            preview={{ mask: <EyeOutlined /> }}
            style={{ height: "200px", objectFit: "cover" }}
          />
        </div>
      }
      onClick={() => onSelect(drawing)}
      bodyStyle={{ padding: "12px" }}
    >
      <div style={{ height: "80px", overflow: "hidden" }}>
        <Text strong>{drawing.description}</Text>
      </div>

      {drawing.colors && (
        <Space size="small" style={{ marginTop: "8px" }}>
          {drawing.colors.map((color: string, i: number) => (
            <Tag
              color={color}
              key={i}
              style={{ width: "20px", height: "20px", padding: 0 }}
            />
          ))}
        </Space>
      )}

      {drawing.videoTutorial && (
        <Button
          type="link"
          icon={<YoutubeOutlined />}
          href={drawing.videoTutorial}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          style={{ padding: 0, marginTop: "8px" }}
        >
          Video Tutorial
        </Button>
      )}
    </Card>
  );
}
