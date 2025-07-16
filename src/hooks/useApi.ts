import { message } from "antd";

const extractJsonFromResponse = (responseText: string): any[] => {
  try {
    return JSON.parse(responseText);
  } catch (e) {
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON from code block", e);
      }
    }

    const fallbackMatch = responseText.match(/\[[\s\S]*?\]/);
    if (fallbackMatch) {
      try {
        return JSON.parse(fallbackMatch[0]);
      } catch (e) {
        console.error("Failed to parse fallback JSON", e);
      }
    }

    throw new Error("Could not extract valid JSON from response");
  }
};

export default function useApi() {
  const generateDrawings = async (
    prompt: string,
    difficulty: string,
    style: string
  ) => {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: [
              {
                role: "user",
                content: `Generate 21 ${difficulty} level ${style} style drawing ideas for: "${prompt}".
                For ${difficulty} level, focus on ${
                  difficulty === "beginner"
                    ? "simple shapes"
                    : difficulty === "intermediate"
                    ? "basic shading"
                    : "complex techniques"
                }.
                Include a color palette for each idea.
                Return ONLY a JSON array with these EXACT properties for each item:
                - description: string
                - imagePrompt: string
                - colors: string[] (hex codes)
                - videoTutorial: string (YouTube search URL)

                Example output:
                [{
                  "description": "A futuristic bicycle", 
                  "imagePrompt": "A futuristic bicycle drawing, clean lines, white background",
                  "colors": ["#ff0000", "#00ff00", "#0000ff"],
                  "videoTutorial": "https://www.youtube.com/results?search_query=how+to+draw+a+futuristic+bicycle"
                }]`,
              },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      const ideas = extractJsonFromResponse(responseText);

      if (!Array.isArray(ideas)) {
        throw new Error("Response was not an array");
      }

      const drawings = ideas.map((idea: any) => ({
        description: idea.description || "Untitled drawing",
        imagePrompt: idea.imagePrompt || idea.description || "drawing",
        colors: Array.isArray(idea.colors) ? idea.colors : ["#000000"],
        videoTutorial:
          idea.videoTutorial ||
          `https://www.youtube.com/results?search_query=how+to+draw+${encodeURIComponent(
            idea.description || "drawing"
          )}`,
        imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(
          idea.imagePrompt || idea.description || "drawing"
        )}`,
      }));

      return drawings;
    } catch (error) {
      console.error("Error generating drawings:", error);
      message.error(
        "Failed to generate drawings. Please try a different prompt."
      );

      // Return sample data if API fails
      const sampleDrawings = Array.from({ length: 16 }, (_, i) => ({
        description: `Sample Drawing ${i + 1}`,
        imagePrompt: `sample drawing ${i + 1}`,
        colors: ["#ff0000", "#00ff00", "#0000ff"],
        videoTutorial:
          "https://www.youtube.com/results?search_query=how+to+draw",
        imageUrl: `https://image.pollinations.ai/prompt/sample%20drawing%20${
          i + 1
        }`,
      }));

      return sampleDrawings;
    }
  };

  const getDrawingSteps = async (description: string, difficulty: string) => {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: [
              {
                role: "user",
                content: `Explain how to draw ${description} in 5-10 simple steps for ${difficulty} level. 
                Use a friendly, encouraging tone suitable for beginners. 
                Add motivational comments between steps. 
                Include tips for ${
                  difficulty === "beginner"
                    ? "basic shapes"
                    : difficulty === "intermediate"
                    ? "shading techniques"
                    : "advanced perspective"
                }.
                Return the steps as markdown formatted text.`,
              },
            ],
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error getting drawing steps:", error);
      message.error("Failed to get drawing steps. Please try again.");
      return `1. Start with basic shapes\n2. Add details gradually\n3. Take your time and enjoy the process!\n\nRemember: Every artist was first an amateur. Keep practicing!`;
    }
  };

  return { generateDrawings, getDrawingSteps };
}
