"use client"

import { forwardRef, useRef, useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from "framer-motion"
import { Send, Bot, Mail, Phone, MapPin } from "lucide-react"
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

// 自定义容器组件，动画方向与ContainerScroll相反
const ReversedContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.9, 0.7] : [1, 1.05];
  };

  // 注意这里我们反转了动画的方向
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [-100, 0]);

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-0 md:p-4"
      ref={containerRef}
    >
      <div
        className="py-4 md:py-8 w-full h-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

// 卡片组件
const Card = ({
  rotate,
  scale,
  translate,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="w-full h-full mx-auto border-4 border-[#6C6C6C] p-2 md:p-4 bg-[#222222] rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl">
        {children}
      </div>
    </motion.div>
  );
};

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
  const inputRef = useRef<HTMLInputElement>(null)
  const [activeSection, setActiveSection] = useState("ai")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
    <div ref={ref} className={`${props.className || ''} h-full w-full`}>
      <ReversedContainer>
        <div className="flex h-full bg-white dark:bg-zinc-900">
          {/* 左侧边栏 */}
          <div className="w-[60px] min-w-[60px] border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-5">
            <div 
              className={`w-10 h-10 mb-5 rounded-lg flex items-center justify-center cursor-pointer
                ${activeSection === "ai" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-800"}`}
              onClick={() => setActiveSection("ai")}
            >
              <Bot className="w-5 h-5" />
            </div>
            <div 
              className={`w-10 h-10 mb-5 rounded-lg flex items-center justify-center cursor-pointer
                ${activeSection === "mail" ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-800"}`}
              onClick={() => setActiveSection("mail")}
            >
              <Mail className="w-5 h-5" />
            </div>
            <div 
              className={`w-10 h-10 mb-5 rounded-lg flex items-center justify-center cursor-pointer
                ${activeSection === "phone" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-800"}`}
              onClick={() => setActiveSection("phone")}
            >
              <Phone className="w-5 h-5" />
            </div>
            <div 
              className={`w-10 h-10 mb-5 rounded-lg flex items-center justify-center cursor-pointer
                ${activeSection === "location" ? "bg-green-100 text-green-600" : "hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-800"}`}
              onClick={() => setActiveSection("location")}
            >
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1 flex flex-col">
            {/* 顶部标题 */}
            <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-lg">智能助手</h3>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            {/* 内容展示区域 */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeSection === "ai" && (
                <>
                  {/* 消息区域 */}
                  <div className="mb-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.type === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          <div className="text-sm">
                            {message.content}
                          </div>
                          <div className="text-xs mt-1 opacity-70 text-right">
                            {message.time}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex mb-4 justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3">
                          <div className="flex space-x-2">
                            <motion.div
                              className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                              animate={{ y: [0, -3, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                delay: 0
                              }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                              animate={{ y: [0, -3, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                delay: 0.15
                              }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                              animate={{ y: [0, -3, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                delay: 0.3
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              )}
              
              {activeSection === "mail" && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Mail className="w-12 h-12 text-purple-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">电子邮件</h3>
                  <p className="text-gray-600 dark:text-gray-400">contact@example.com</p>
                </div>
              )}
              
              {activeSection === "phone" && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Phone className="w-12 h-12 text-blue-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">电话联系</h3>
                  <p className="text-gray-600 dark:text-gray-400">+86 123 4567 8910</p>
                </div>
              )}
              
              {activeSection === "location" && (
                <div className="flex flex-col items-center justify-center h-full">
                  <MapPin className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">地址</h3>
                  <p className="text-gray-600 dark:text-gray-400">中国，上海</p>
                </div>
              )}
            </div>
            
            {/* 底部操作区域 */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              {activeSection === "ai" && (
                <>
                  {/* 快速回复 */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 输入区域 */}
                  <form 
                    onSubmit={handleSendMessage}
                    onClick={handleWrapperClick}
                  >
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full focus-within:ring-1 focus-within:ring-blue-500 px-4 py-2">
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="发送消息..."
                        className="flex-1 bg-transparent outline-none text-sm"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onClick={handleInputClick}
                      />
                      <button
                        type="submit"
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${!inputValue.trim() || isTyping ? 'text-gray-400' : 'text-blue-500 hover:bg-blue-50'}`}
                        disabled={!inputValue.trim() || isTyping}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </ReversedContainer>
    </div>
  )
})

ChatContact.displayName = "ChatContact"

export default ChatContact

