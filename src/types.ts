// export interface Message {
//   role: "user" | "ai";
//   content: string;
//   drawings?: any[];
//   steps?: boolean;
// }

// export interface Drawing {
//   description: string;
//   imageUrl: string;
//   imagePrompt: string;
//   colors?: string[];
//   videoTutorial?: string;
// }

export interface Message {
  role: "user" | "ai";
  content: string;
}

export interface Drawing {
  description: string;
  imageUrl: string;
  colors: string[];
  videoTutorial: string;
}
