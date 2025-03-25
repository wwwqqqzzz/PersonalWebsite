"use client"

import { useState, useRef, useEffect, forwardRef } from "react"
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion"
import { Send, Bot, Paperclip, Smile, Link, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Particles } from "@/components/ui/particles"
import { chatWithQianwen } from "@/lib/qianwen"

interface ChatContactProps {
  className?: string
}

interface Message {
  id: number
  type: "bot" | "user"
  content: string
  time: string
  contentType?: "text" | "link" | "image"
  metadata?: {
    url?: string
    title?: string
    preview?: string
  }
}

const suggestions = [
  "你好!我想了解更多关于你的作品",
  "我有一个项目想和你合作",
  "你擅长哪些技术领域?",
  "如何与你取得联系?"
]

const ChatContact = forwardRef<HTMLDivElement, ChatContactProps>((props, ref) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: "你好！我是王起哲的AI助手。我可以帮你了解王起哲的技能、项目经验,或者安排与他的沟通。请问有什么我可以帮你的吗？",
      time: "刚刚",
      contentType: "text"
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      time: "刚刚",
      contentType: "text"
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // 调用通义千问API
      const response = await chatWithQianwen(inputValue)
      
      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        time: "刚刚",
        contentType: "text",
        content: response
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        time: "刚刚",
        contentType: "text",
        content: "抱歉,我现在无法回答。请稍后再试或直接发送邮件联系。"
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  // 阻止事件冒泡
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // 处理输入框聚焦
  const handleWrapperClick = () => {
    inputRef.current?.focus()
  }

  return (
    <motion.div
      ref={ref}
      id="contact"
      className="min-h-screen relative flex flex-col items-center justify-center py-20"
      onClick={handleWrapperClick}
    >
      {/* 背景粒子 */}
      <Particles
        className="absolute inset-0 opacity-40"
        quantity={40}
        staticity={50}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        onMouseMove={handleMouseMove}
        className="relative w-full max-w-2xl"
      >
        {/* 光晕效果 */}
        <motion.div
          className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50 opacity-50 blur-xl"
          style={{
            background: useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, var(--primary-color) 0%, transparent 60%)`
          }}
        />

        <div className="relative bg-card/30 backdrop-blur-md rounded-xl overflow-hidden border border-border shadow-xl">
          {/* Chat header */}
          <div className="bg-muted/30 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <motion.div
                  className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bot className="h-5 w-5 text-primary" />
                </motion.div>
                <motion.span
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
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
                        : "bg-muted rounded-tl-none"
                    )}
                  >
                    {message.contentType === "text" && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm"
                      >
                        {message.content}
                      </motion.span>
                    )}

                    {message.contentType === "link" && message.metadata && (
                      <motion.a
                        href={message.metadata.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Link className="h-4 w-4" />
                        <span className="text-sm underline">{message.metadata.title}</span>
                      </motion.a>
                    )}

                    {message.contentType === "image" && message.metadata && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative mt-2 rounded-lg overflow-hidden"
                      >
                        <img
                          src={message.metadata.url}
                          alt={message.metadata.title}
                          className="w-full h-auto rounded-lg"
                        />
                      </motion.div>
                    )}

                    <span className="text-xs mt-1 opacity-70 self-end">{message.time}</span>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex space-x-1">
                      <motion.span
                        className="w-2 h-2 rounded-full bg-foreground/50"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                      <motion.span
                        className="w-2 h-2 rounded-full bg-foreground/50"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, delay: 0.15, repeat: Infinity }}
                      />
                      <motion.span
                        className="w-2 h-2 rounded-full bg-foreground/50"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, delay: 0.3, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          {/* Quick suggestions */}
          <div className="px-4 py-2 border-t border-border flex items-center gap-2 overflow-x-auto scrollbar-none">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="shrink-0 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>

          {/* Chat input */}
          <div className="border-t border-border p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2" onClick={handleInputClick}>
              <motion.button
                type="button"
                className="p-2 rounded-full hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleInputClick}
              >
                <Paperclip className="h-5 w-5 text-foreground/70" />
              </motion.button>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onClick={handleInputClick}
                placeholder="输入你的消息..."
                className="flex-1 bg-muted/30 border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <motion.button
                type="button"
                className="p-2 rounded-full hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleInputClick}
              >
                <Smile className="h-5 w-5 text-foreground/70" />
              </motion.button>
              <Button
                type="submit"
                size="icon"
                className="rounded-full"
                disabled={!inputValue.trim() || isTyping}
                onClick={handleInputClick}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>

            <div className="mt-4 text-center" onClick={handleInputClick}>
              <p className="text-xs text-foreground/50">
                或者直接发送邮件至{" "}
                <a
                  href="mailto:2158588419@qq.com"
                  className="text-primary hover:underline"
                  onClick={handleInputClick}
                >
                  2158588419@qq.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
})

ChatContact.displayName = "ChatContact"

export default ChatContact

