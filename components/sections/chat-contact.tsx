"use client"

import { useState, useRef, useEffect, forwardRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatContactProps {
  className?: string
}

const ChatContact = forwardRef<HTMLDivElement, ChatContactProps>((props, ref) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "你好！我是王起哲的智能助手。有什么我可以帮助你的吗？",
      time: "刚刚",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      time: "刚刚",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      let botResponse

      if (inputValue.toLowerCase().includes("你好") || inputValue.toLowerCase().includes("嗨")) {
        botResponse = "你好！很高兴认识你。我是王起哲的智能助手，有什么我可以帮助你的吗？"
      } else if (inputValue.toLowerCase().includes("项目") || inputValue.toLowerCase().includes("作品")) {
        botResponse = "王起哲有多个优秀的设计项目，包括电商应用重设计、金融科技平台等。你可以在作品集部分查看详细信息。"
      } else if (inputValue.toLowerCase().includes("联系") || inputValue.toLowerCase().includes("合作")) {
        botResponse = "你可以通过邮箱 2158588419@qq.com 直接联系王起哲，或者填写联系表单，他会尽快回复你。"
      } else if (inputValue.toLowerCase().includes("技能") || inputValue.toLowerCase().includes("专长")) {
        botResponse =
          "王起哲擅长UI/UX设计、交互设计、前端开发等领域。他熟练使用Figma、Adobe系列工具，以及React等前端技术。"
      } else {
        botResponse =
          "感谢你的留言！王起哲会尽快查看并回复你。如果有紧急事项，可以直接发送邮件到 2158588419@qq.com。"
      }

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: botResponse,
        time: "刚刚",
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <motion.div
      ref={ref}
      id="contact"
      className="min-h-screen flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full bg-card/30 backdrop-blur-md rounded-xl overflow-hidden border border-border shadow-xl"
      >
        {/* Chat header */}
        <div className="bg-muted/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <div>
              <h3 className="font-medium">王起哲的助手</h3>
              <p className="text-xs text-foreground/50">通常在几分钟内回复</p>
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn("flex", message.type === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 flex flex-col",
                    message.type === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted rounded-tl-none",
                  )}
                >
                  <span className="text-sm">{message.content}</span>
                  <span className="text-xs mt-1 opacity-70 self-end">{message.time}</span>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex space-x-1">
                    <span
                      className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        {/* Chat input */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <button type="button" className="p-2 rounded-full hover:bg-muted transition-colors">
              <Paperclip className="h-5 w-5 text-foreground/70" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入你的消息..."
              className="flex-1 bg-muted/30 border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="button" className="p-2 rounded-full hover:bg-muted transition-colors">
              <Smile className="h-5 w-5 text-foreground/70" />
            </button>
            <Button type="submit" size="icon" className="rounded-full" disabled={!inputValue.trim() || isTyping}>
              <Send className="h-5 w-5" />
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-foreground/50">
              或者直接发送邮件至{" "}
              <a href="mailto:2158588419@qq.com" className="text-primary hover:underline">
                2158588419@qq.com
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
})

ChatContact.displayName = "ChatContact"

export default ChatContact

