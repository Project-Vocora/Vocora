import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Initializes OpenAI client from the API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const { story } = req.body;
  
  // This statement ensures that a story is provided and is not empty
  if (!story || story.trim().length === 0) {
    return res.status(400).json({ error: "No story provided" });
  }

  try {
    // This calls OpenAI's DALL·E 2 to generate an image from the story
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: story,
      size: "512x512",
    });

    // Sends the image URL back
    const imageUrl = response.data[0].url;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
}
