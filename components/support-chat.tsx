"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send } from "lucide-react"
import { useLanguage } from "@/lang/LanguageContext"
import homeTransla from "@/lang/home"
import { useToast } from "@/hooks/use-toast"

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "support", content: string }>>([])
  const { language } = useLanguage()
  const translated = homeTransla[language]
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: "user", content: message }])

    try {
      // Here you would typically make an API call to your support backend
      // For now, we'll just simulate a response
      const response = "Thank you for your message. Our support team will get back to you shortly."
      
      // Add support response to chat history
      setChatHistory(prev => [...prev, { role: "support", content: response }])

      // Show success toast
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }

    setMessage("")
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Open support chat"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 shadow-xl border-purple-100 dark:border-purple-800 dark:bg-slate-800">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                Support Chat
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 