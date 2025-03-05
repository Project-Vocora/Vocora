import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Initializes OpenAI client from the API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const { words } = req.body;

  // This statement ensures that words are being provided and are not empty
  if (!words || words.length === 0) {
    return res.status(400).json({ error: "No words provided" });
  }

  try {
    // This calls OpenAI's o1 model to generate the story
    const completion = await openai.chat.completions.create({
        model: "o1-mini-2024-09-12",
        messages: [
          { role: "user", content: `Write a short, four-sentence story using elementary level words along with this list: ${words.join(", ")}` }
        ],
    });
      

    // Sends the generated story back
    res.status(200).json({ story: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: "Failed to generate story" });
  }
}