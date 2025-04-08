"use client"

import { forwardRef, useRef, useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from "framer-motion"
import { Send, Bot, Mail, Phone, MapPin, Calendar, User, MessageSquare, Home, Bell, Settings, Menu, X } from "lucide-react"
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
    offset: ["start end", "end start"], // 扩大触发区域，使动画更早开始更晚结束
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
    return isMobile ? [0.85, 1.08] : [0.9, 1.2]; // 扩大缩放范围，更明显的变化
  };

  // 大幅增强动画效果，使其更自然流畅
  const rotate = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [isMobile ? -15 : -25, 0, 0, isMobile ? 30 : 40]
  );
  
  const scale = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [scaleDimensions()[0], scaleDimensions()[1], scaleDimensions()[1], scaleDimensions()[0]]
  );
  
  const translate = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [-250, 0, 0, 150]
  );
  
  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.1, 0.2, 0.8, 0.9, 1], 
    [0.3, 0.7, 1, 1, 0.7, 0.3]
  );

  return (
    <div
      className="min-h-[40rem] md:min-h-[50rem] lg:h-[60rem] flex items-center justify-center relative py-16 px-4 md:p-10 w-full"
      ref={containerRef}
    >
      <div
        className="py-0 md:py-8 w-full h-full relative"
        style={{
          perspective: "2000px", // 增加透视深度
        }}
      >
        <Card rotate={rotate} translate={translate} scale={scale} opacity={opacity} isMobile={isMobile}>
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
  opacity,
  children,
  isMobile
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  opacity: MotionValue<number>;
  children: React.ReactNode;
  isMobile: boolean;
}) => {
  // 添加额外的动画值，增加动画层次感
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      style={{
        rotateX: rotate, // X轴旋转
        rotateY: useTransform(rotate, value => value * -0.2), // 添加Y轴轻微旋转，增加立体感
        scale,
        opacity,
        y: translate,
        z: useTransform(scale, [0.9, 1.2], [0, 50]), // 添加Z轴变换
        transformStyle: "preserve-3d",
        boxShadow: useTransform(
          scale,
          [0.9, 1.2],
          [
            "0 20px 50px rgba(0,0,0,0.15)",
            "0 70px 140px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.1), 0 0 20px rgba(0,128,0,0.05)"
          ]
        ),
        filter: useTransform(
          opacity, 
          [0.3, 1], 
          [
            "blur(1px) saturate(0.8)", 
            "blur(0) saturate(1.05)"
          ]
        ),
      }}
      className="w-full h-full mx-auto border-[8px] md:border-[16px] border-[#0f0f0f] p-0 bg-[#0f0f0f] rounded-[32px] md:rounded-[42px] shadow-2xl overflow-hidden transition-all duration-700"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.015, 
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } 
      }}
    >
      {/* 边框发光效果 */}
      <motion.div 
        className="absolute inset-0 rounded-[24px] md:rounded-[32px] opacity-0 pointer-events-none" 
        style={{ 
          boxShadow: "0 0 20px rgba(0,255,128,0.4), inset 0 0 20px rgba(0,255,128,0.2)",
          opacity: isHovered ? 0.5 : 0
        }}
        transition={{ duration: 0.5 }}
      />
      
      <div className="h-full w-full overflow-hidden rounded-[24px] md:rounded-[26px] bg-white dark:bg-[#0a0a0a] relative">
        {/* 添加轻微的内发光效果 */}
        <div className="absolute inset-0 pointer-events-none shadow-inner opacity-30" />
        
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    // 组件加载时从localStorage获取或生成用户ID
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = 'user_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
  }, []);

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
    
    // 关闭移动菜单(如果打开的话)
    if(isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }

    try {
      console.log("开始调用聊天API...");
      // 调用通义千问API，传递用户ID
      const response = await chatWithQianwen(inputValue, userId)
      console.log("聊天API返回结果:", response);
      
      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        time: "刚刚",
        contentType: "text",
        content: response
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("聊天API调用失败:", error);
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
    inputRef.current?.focus()
  }

  // 阻止事件冒泡
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // 处理输入框聚焦
  const handleWrapperClick = () => {
    inputRef.current?.focus()
  }
  
  // 切换分类时关闭移动菜单
  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    setIsMobileMenuOpen(false)
  }

  return (
    <div ref={ref} className={`${props.className || ''} h-full w-full`}>
      <ReversedContainer>
        <div className="flex h-full dark:bg-[#0a0a0a]">
          {/* 顶部状态栏 - 仅在小屏幕显示 */}
          <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-4 md:px-5 z-30">
            <span className="text-xs text-black/50 dark:text-white/50">23:15:31</span>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="w-6 h-6 flex items-center justify-center md:hidden"
              aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 text-black/70 dark:text-white/70" />
              ) : (
                <Menu className="w-4 h-4 text-black/70 dark:text-white/70" />
              )}
            </button>
          </div>
          
          {/* 移动端菜单覆盖层 */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className="fixed inset-0 bg-black/20 dark:bg-black/40 z-20 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
          </AnimatePresence>
          
          {/* 左侧边栏 */}
          <AnimatePresence>
            {(isMobileMenuOpen || window.innerWidth >= 768) && (
              <motion.div 
                className={`${
                  isMobileMenuOpen 
                    ? 'absolute top-0 bottom-0 left-0 z-20 w-[240px] max-w-[80vw]' 
                    : 'hidden md:flex w-[175px] min-w-[175px]'
                } border-r border-gray-100 dark:border-zinc-900 flex-col py-6 bg-white dark:bg-[#0a0a0a]`}
                initial={window.innerWidth < 768 ? { x: -240 } : false}
                animate={window.innerWidth < 768 ? { x: 0 } : {}}
                exit={window.innerWidth < 768 ? { x: -240 } : {}}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                    <Home className="w-5 h-5 md:w-6 md:h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="mt-8 md:mt-12 w-full">
                    <div className="flex flex-col items-start w-full">
                      <button 
                        className={`w-full flex items-center gap-3 py-3 px-5 md:px-7 text-left ${activeSection === "ai" ? "text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800/50 border-r-4 border-green-500" : "text-gray-500 dark:text-gray-400"}`}
                        onClick={() => handleSectionChange("ai")}
                      >
                        <Bot className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">智能助手</span>
                      </button>
                      
                      <button 
                        className={`w-full flex items-center gap-3 py-3 px-5 md:px-7 text-left ${activeSection === "mail" ? "text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800/50 border-r-4 border-green-500" : "text-gray-500 dark:text-gray-400"}`}
                        onClick={() => handleSectionChange("mail")}
                      >
                        <Mail className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">邮件</span>
                      </button>
                      
                      <button 
                        className={`w-full flex items-center gap-3 py-3 px-5 md:px-7 text-left ${activeSection === "phone" ? "text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800/50 border-r-4 border-green-500" : "text-gray-500 dark:text-gray-400"}`}
                        onClick={() => handleSectionChange("phone")}
                      >
                        <Phone className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">电话</span>
                      </button>
                      
                      <button 
                        className={`w-full flex items-center gap-3 py-3 px-5 md:px-7 text-left ${activeSection === "location" ? "text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800/50 border-r-4 border-green-500" : "text-gray-500 dark:text-gray-400"}`}
                        onClick={() => handleSectionChange("location")}
                      >
                        <MapPin className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">位置</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto px-5 md:px-7">
                  <div className="flex items-center gap-2 opacity-70">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">在线</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* 主内容区 */}
          <div className="flex-1 flex flex-col">
            {/* 顶部标题 */}
            <div className="h-14 md:h-14 flex items-center justify-between px-4 md:px-5 pt-2 md:pt-0">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-green-500" />
                <h3 className="text-base font-medium text-gray-800 dark:text-white">智能助手</h3>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            {/* 内容展示区域 */}
            <div className="flex-1 p-3 md:p-5 overflow-hidden relative">
              {activeSection === "ai" && (
                <>
                  {/* 消息区域 */}
                  <div className="h-full overflow-y-auto pb-20 md:pb-24 px-1 md:px-0">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 md:mb-5 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-2.5 md:px-5 md:py-3.5 ${
                            message.type === "user"
                              ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                              : "bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 shadow-lg shadow-gray-500/5 dark:shadow-gray-900/20"
                          }`}
                        >
                          <div className="text-[13px] md:text-sm">
                            {message.content}
                          </div>
                          <div className="text-[10px] md:text-xs mt-1.5 opacity-70 text-right">
                            {message.time}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex mb-4 md:mb-5 justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl px-4 py-3 md:px-5 md:py-4 shadow-lg shadow-gray-500/5 dark:shadow-gray-900/20">
                          <div className="flex space-x-2">
                            <motion.div
                              className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                delay: 0
                              }}
                            />
                            <motion.div
                              className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                delay: 0.15
                              }}
                            />
                            <motion.div
                              className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full"
                              animate={{ y: [0, -5, 0] }}
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
                  
                  {/* 底部输入框 - 固定在底部 */}
                  <div className="absolute bottom-4 md:bottom-6 left-3 md:left-5 right-3 md:right-5">
                    {/* 快速回复 */}
                    <div className="mb-3 md:mb-4 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                      <div className="flex gap-2 md:flex-wrap">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-[11px] md:text-xs px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 dark:bg-gray-800/70 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/70 transition-colors whitespace-nowrap md:whitespace-normal flex-shrink-0 md:flex-shrink shadow-sm"
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
                      className="relative z-10"
                    >
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full focus-within:ring-2 focus-within:ring-green-500 px-4 py-2 md:px-5 md:py-3 bg-white dark:bg-gray-900 shadow-md">
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="发送消息..."
                          className="flex-1 bg-transparent outline-none text-sm md:text-base text-gray-800 dark:text-white"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onClick={handleInputClick}
                        />
                        <button
                          type="submit"
                          className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full ${!inputValue.trim() || isTyping ? 'text-gray-400' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                          disabled={!inputValue.trim() || isTyping}
                        >
                          <Send className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
              
              {activeSection === "mail" && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Mail className="w-14 h-14 md:w-16 md:h-16 text-green-500 mb-6 md:mb-8" />
                  <h3 className="text-xl md:text-2xl font-medium mb-3 md:mb-4 text-gray-800 dark:text-white">电子邮件</h3>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">contact@example.com</p>
                </div>
              )}
              
              {activeSection === "phone" && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Phone className="w-14 h-14 md:w-16 md:h-16 text-green-500 mb-6 md:mb-8" />
                  <h3 className="text-xl md:text-2xl font-medium mb-3 md:mb-4 text-gray-800 dark:text-white">电话联系</h3>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">+86 123 4567 8910</p>
                </div>
              )}
              
              {activeSection === "location" && (
                <div className="flex flex-col items-center justify-center h-full">
                  <MapPin className="w-14 h-14 md:w-16 md:h-16 text-green-500 mb-6 md:mb-8" />
                  <h3 className="text-xl md:text-2xl font-medium mb-3 md:mb-4 text-gray-800 dark:text-white">地址</h3>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">中国，上海</p>
                </div>
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

// 隐藏滚动条的样式
if (typeof document !== "undefined") {
  // 创建样式
  const style = document.createElement('style');
  style.textContent = `
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;
  // 添加到页面
  document.head.appendChild(style);
}

