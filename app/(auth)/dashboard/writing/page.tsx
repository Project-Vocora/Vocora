"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/story-generator/header";
import { useLanguage } from "@/lang/LanguageContext";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Send to backend (replace with your endpoint)
    const response = await fetch("/api/chat-box", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, language }),
    });

    const data = await response.json();
    console.log(response);
    const aiReply = { role: "ai" as const, content: data.reply };
    setMessages((prev) => [...prev, aiReply]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full flex flex-col">
        <h1 className="text-2xl font-semibold mb-6 text-center">Language Practice Chat</h1>

        <div className="flex-1 overflow-y-auto bg-white rounded-lg p-4 shadow border space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "self-end bg-purple-100 text-right"
                  : "self-start bg-gray-100"
              }`}
            >
              <p className="text-gray-800">{msg.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type your message in ${language}...`}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </main>
    </div>
  );
}
