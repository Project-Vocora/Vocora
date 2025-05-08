import type { NextApiRequest, NextApiResponse } from "next";
import { useState } from "react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message, practiceLang, language, history, } = req.body;

  if (!message || !practiceLang) {
    return res.status(400).json({ error: "Missing message or language" });
  }

  try {
    const formattedHistory =
    Array.isArray(history) && history.length > 0
      ? history.map((msg: { role: "user" | "ai"; content: string }) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }))
      : [];

      const contents = [
        ...formattedHistory,
        {
          role: "user",
          parts: [
            {
              text: `You are a friendly grammar tutor. You will receive a sentence from a student practicing ${practiceLang}. In ${practiceLang}, give a short verbal rating of the sentence. In ${language}, provide a sentence of simple grammatical feedback. If the sentence they sent was rated not quite or almost there, send a revised version. This is not a chat message, just feedback.
              Example:
              ¡No del todo!\n
              In English, the verb "estar" needs to agree with the subject.\n
              Revised sentence: ¿Dónde está la biblioteca?
            
              \n\nStudent's sentence: ${message}`,
            },
          ],
        },
      ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const responseData = await geminiRes.json();

    console.log("Gemini raw response:", JSON.stringify(responseData, null, 2));

    const reply = responseData?.candidates?.[0]?.content?.parts
        ?.map((p: { text: string }) => p.text)
        ?.join("\n") || "No reply received.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
