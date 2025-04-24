import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message, language } = req.body;

  if (!message || !language) {
    return res.status(400).json({ error: "Missing message or language" });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `You are a friendly language tutor, you are texting someone learning ${language} using you as a way to practice communicating. Keep it simple andshort. Respond in ${language}:\n\n${message}` }],
            },
          ],
        }),
      }
    );

    const responseData = await geminiRes.json();

    // Debug logging for transparency (optional)
    console.log("Gemini raw response:", JSON.stringify(responseData, null, 2));

    const reply = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply received.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
