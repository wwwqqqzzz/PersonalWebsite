"use client"

import { useState, useEffect, useRef, forwardRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Circle, Maximize2, Minimize2, Command, Box } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHotkeys } from 'react-hotkeys-hook'
import { Particles } from "@/components/ui/particles"

// 类型定义
type SkillVisualMode = "terminal" | "tree" | "radar"
type CommandType = "system" | "command" | "error" | "success" | "info"

interface CommandEntry {
  type: CommandType
  content: string
}

interface SkillItem {
  name: string
  level: number
  icon: string
}

interface SkillCategory {
  category: string
  icon: string
  description: string
  items: SkillItem[]
}

// 效果常量
const GRADIENT_COLORS = ["#6366f1", "#3b82f6", "#10b981"]
const PARTICLE_CONFIG = {
  quantity: 40,
  staticity: 50,
  colorVar: "--primary"
}

const skills = [
  {
    category: "设计",
    icon: "🎨",
    description: "用设计创造优秀的用户体验",
    items: [
      { name: "响应式设计", level: 95, icon: "📱" },
      { name: "交互设计", level: 90, icon: "🤝" },
      { name: "动效设计", level: 92, icon: "✨" },
      { name: "用户研究", level: 85, icon: "🔍" },
      { name: "设计系统", level: 88, icon: "🎯" },
    ],
  },
  {
    category: "开发",
    icon: "💻",
    description: "构建高性能的现代化应用",
    items: [
      { name: "Next.js", level: 90, icon: "⚡" },
      { name: "React", level: 88, icon: "⚛️" },
      { name: "TypeScript", level: 85, icon: "📘" },
      { name: "Tailwind", level: 92, icon: "🎨" },
      { name: "Framer Motion", level: 85, icon: "🎬" },
    ],
  },
  {
    category: "工具",
    icon: "🛠️",
    description: "掌握效率工具和开发环境",
    items: [
      { name: "VS Code", level: 95, icon: "📝" },
      { name: "Git", level: 90, icon: "🌳" },
      { name: "Figma", level: 88, icon: "🎨" },
      { name: "Docker", level: 82, icon: "🐳" },
      { name: "Terminal", level: 85, icon: "⌨️" },
    ],
  },
]

interface SkillsSectionProps {
  className?: string
}

const SkillsSection = forwardRef<HTMLDivElement, SkillsSectionProps>((props, ref) => {
  const [activeCategory, setActiveCategory] = useState("设计")
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewMode, setViewMode] = useState<SkillVisualMode>("terminal")
  const [commandSuggestions, setSuggestions] = useState<string[]>([])
  const [inputHistory, setInputHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const [typedCommand, setTypedCommand] = useState("")
  
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = {
    help: "显示帮助信息",
    list: "列出所有技能类别",
    clear: "清除终端",
    tree: "切换到技能树视图",
    radar: "切换到雷达图视图",
    terminal: "切换到终端视图",
    about: "关于作者",
    load: "模拟加载进度",
  }

  // 键盘快捷键
  useHotkeys('ctrl+k', () => setViewMode(m => m === "terminal" ? "tree" : "terminal"))
  useHotkeys('up', () => navigateHistory(-1))
  useHotkeys('down', () => navigateHistory(1))
  useHotkeys('esc', () => setIsExpanded(false))

  // 命令历史导航
  const navigateHistory = (direction: number) => {
    if (inputHistory.length === 0) return
    const newIndex = Math.min(Math.max(historyIndex + direction, -1), inputHistory.length - 1)
    setHistoryIndex(newIndex)
    if (inputRef.current) {
      inputRef.current.value = newIndex === -1 ? '' : inputHistory[newIndex]
    }
  }

  // 命令自动补全
  const updateSuggestions = (input: string) => {
    const matches = Object.keys(commands)
      .filter(cmd => cmd.startsWith(input.toLowerCase()))
      .slice(0, 5)
    setSuggestions(matches)
  }

  // 增强的命令处理
  const handleCommand = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.querySelector('input')
    if (!input) return
    const command = input.value.trim().toLowerCase()
    
    if (command) {
      setInputHistory(prev => [command, ...prev])
      setHistoryIndex(-1)
      
      const newHistory: CommandEntry[] = [...commandHistory, { type: "command" as CommandType, content: `> ${command}` }]

      switch (command) {
        case "help":
          newHistory.push({
            type: "info" as CommandType,
            content: Object.entries(commands)
              .map(([cmd, desc]) => `${cmd.padEnd(10)} - ${desc}`)
              .join("\n"),
          })
          break
        case "list":
      newHistory.push({
            type: "success",
            content: skills.map(s => `${s.icon} ${s.category}`).join("\n"),
          })
          break
        case "load":
          setCommandHistory(newHistory)
          simulateLoading()
          return
        case "tree":
          setViewMode("tree")
          newHistory.push({ type: "system", content: "切换到技能树视图" })
          break
        case "radar":
          setViewMode("radar")
          newHistory.push({ type: "system", content: "切换到雷达图视图" })
          break
        case "terminal":
          setViewMode("terminal")
          newHistory.push({ type: "system", content: "切换到终端视图" })
          break
        case "about":
      newHistory.push({
            type: "info",
            content: "👨‍💻 王起哲\n🚀 全栈开发者 & UI设计师\n✨ 热爱创造优秀的用户体验\n🌟 永远保持学习的激情",
          })
          break
        case "clear":
      setCommandHistory([{ type: "system", content: "终端已清除" }])
          break
        default:
          newHistory.push({ type: "error", content: `未知命令: ${command}` })
    }

    setCommandHistory(newHistory)
      input.value = ""
      setSuggestions([])

    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 10)
    }
  }

  const simulateLoading = async () => {
    const stages = [
      { text: "正在连接到远程服务器...", time: 2000 },
      { text: "正在验证访问权限...", time: 1500 },
      { text: "正在加载系统组件...", time: 2500 },
      { text: "正在初始化数据库...", time: 2000 },
      { text: "正在配置环境变量...", time: 1500 },
    ]

    const newHistory: CommandEntry[] = []
    
    for (const stage of stages) {
      newHistory.push({ type: "system", content: stage.text })
      // 添加进度条
      for (let i = 0; i <= 10; i++) {
        const filled = "━".repeat(i)
        const empty = "─".repeat(10 - i)
        const percentage = Math.floor((i / 10) * 100)
        const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"][i % 10]
        
        newHistory.push({
          type: "system",
          content: `${spinner} [${filled}${empty}] ${percentage}% ${stage.text}`
        })
        setCommandHistory(prev => [...prev.slice(0, -1), ...newHistory])
        await new Promise(resolve => setTimeout(resolve, stage.time / 10))
      }
      // 完成当前阶段
      newHistory.push({ type: "success", content: `✓ ${stage.text}` })
      setCommandHistory(prev => [...prev.slice(0, -1), ...newHistory])
    }

    // 最终完成消息
    newHistory.push({ type: "success", content: "⭐ 所有任务加载完成！" })
    newHistory.push({ type: "info", content: "系统已准备就绪，可以开始使用。" })
    setCommandHistory(prev => [...prev, ...newHistory])
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false)
      }
      if (inputRef.current && !isExpanded) {
        inputRef.current.focus()
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isExpanded])

  useEffect(() => {
    const showLoadingAnimation = async () => {
      const stages = [
        { text: "正在连接到远程服务器...", time: 1000 },
        { text: "正在验证访问权限...", time: 800 },
        { text: "正在加载系统组件...", time: 1200 },
      ]

      for (const stage of stages) {
        for (let i = 0; i <= 10; i++) {
          const filled = "━".repeat(i)
          const empty = "─".repeat(10 - i)
          const percentage = Math.floor((i / 10) * 100)
          const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"][i % 10]
          
          setCommandHistory(prev => [
            ...prev.slice(0, -1),
            { type: "system", content: `${spinner} [${filled}${empty}] ${percentage}% ${stage.text}` }
          ])
          await new Promise(resolve => setTimeout(resolve, stage.time / 10))
        }
        setCommandHistory(prev => [
          ...prev,
          { type: "success", content: `✓ ${stage.text}` }
        ])
      }

      setCommandHistory(prev => [
        ...prev,
        { type: "success", content: "⭐ 系统初始化完成！" },
        { type: "info", content: "输入 'help' 查看可用命令" }
      ])
    }

    showLoadingAnimation()
  }, [])

  // 添加技能树视图组件
  const SkillTreeView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full p-6 bg-black/20"
    >
      <div className="grid grid-cols-3 gap-6 h-full">
        {skills.map((category, i) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative group"
          >
            <motion.div
              className="absolute inset-0 bg-primary/5 rounded-xl blur-xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative h-full border border-primary/20 rounded-xl p-4 bg-black/40 backdrop-blur-sm overflow-hidden group-hover:border-primary/40 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <span className="text-lg font-semibold text-primary">{category.category}</span>
              </div>
              <p className="text-sm text-foreground/70 mb-6">{category.description}</p>
              <div className="space-y-4">
                {category.items.map((skill, j) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + j * 0.05 }}
                    className="group/skill"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span>{skill.icon}</span>
                        <span className="text-sm">{skill.name}</span>
                      </div>
                      <span className="text-xs text-primary">{skill.level}%</span>
                    </div>
                    <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full group-hover/skill:from-primary group-hover/skill:to-primary/50"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  // 添加雷达图视图组件
  const SkillRadarView = () => {
    const radarData = skills.map(category => ({
      category: category.category,
      score: Math.max(...category.items.map(i => i.level)),
      items: category.items
    }))
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-full grid grid-cols-3 gap-6 p-6"
      >
        {radarData.map((data, i) => (
          <motion.div 
            key={data.category}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative bg-black/40 rounded-xl p-6 border border-primary/20"
          >
            <div className="absolute -top-3 left-4 px-3 py-1 bg-primary/20 rounded-full text-xs text-primary">
              {data.category}
            </div>
            <div className="h-full flex flex-col">
              <div className="flex-1 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold text-primary/80">{data.score}%</div>
                </div>
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-primary/10"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={`${data.score * 2.83} 283`}
                    className="text-primary"
                    initial={{ strokeDasharray: "0 283" }}
                    animate={{ strokeDasharray: `${data.score * 2.83} 283` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                </svg>
              </div>
              <div className="space-y-2 mt-4">
                {data.items.map((item, j) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + j * 0.05 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-primary">{item.level}%</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  // 更新渲染逻辑
  const renderContent = () => {
    switch (viewMode) {
      case "radar":
        return <SkillRadarView />
      case "tree":
        return <SkillTreeView />
      default:
        return (
          <>
            <div
              ref={terminalRef}
              className="flex-1 p-6 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent space-y-2"
            >
              <AnimatePresence mode="popLayout">
                {commandHistory.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "space-y-1",
                      entry.type === "command" && "text-primary",
                      entry.type === "error" && "text-red-400",
                      entry.type === "system" && "text-blue-400",
                      entry.type === "success" && "text-green-400",
                      entry.type === "info" && "text-yellow-400",
                    )}
                  >
                    <pre className="whitespace-pre-wrap font-mono">{entry.content}</pre>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 命令输入区 */}
            <div className="border-t border-primary/20 bg-black/40 p-4">
              <div className="relative">
                {/* 命令提示 */}
                <AnimatePresence>
                  {isFocused && commandSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-0 right-0 mb-2 bg-black/80 backdrop-blur-lg rounded-lg p-2 shadow-xl border border-primary/20 z-50"
                    >
                      {commandSuggestions.map((cmd, i) => (
                        <motion.div
                          key={cmd}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-2 text-sm font-mono hover:bg-primary/20 rounded-md cursor-pointer flex items-center space-x-2"
                          onClick={() => {
                            if (inputRef.current) {
                              inputRef.current.value = cmd;
                              inputRef.current.focus();
                              const form = inputRef.current.form;
                              if (form) {
                                form.dispatchEvent(new Event('submit', { cancelable: true }));
                              }
                            }
                            setSuggestions([]);
                          }}
                        >
                          <Command className="h-3 w-3 text-primary/60" />
                          <span>{cmd}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleCommand} className="flex items-center space-x-3">
                  <div className="text-primary">{">"}</div>
                  <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-primary placeholder-primary/30"
                    placeholder="输入命令..."
                    spellCheck={false}
                    autoComplete="off"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      setTimeout(() => setIsFocused(false), 200)
                    }}
                    onChange={(e) => {
                      setTypedCommand(e.target.value);
                      updateSuggestions(e.target.value);
                    }}
                  />
                </form>
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <motion.div
      ref={ref}
      id="skills"
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 md:py-32"
    >
      {/* 增强背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/30">
        <Particles {...PARTICLE_CONFIG} className="opacity-30" />
        <motion.div 
          className="absolute inset-0 bg-[url('/circuit.svg')] opacity-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto">
        {/* 标题 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
            专业技能
          </h2>
          <p className="mt-4 text-foreground/60">
            多年积累的设计与开发技能
          </p>
        </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={cn(
        "w-full bg-black/20 backdrop-blur-3xl rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-500",
        isExpanded ? "fixed inset-4 z-50 max-w-none" : "relative"
      )}
    >
          {/* 终端头部 */}
          <div className="bg-black/30 px-6 py-3 flex items-center justify-between border-b border-white/[0.08]">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-primary/70" />
                <span className="text-sm font-mono bg-gradient-to-r from-primary/80 to-purple-400/80 bg-clip-text text-transparent">skills.terminal</span>
              </div>
              <div className="h-4 w-[1px] bg-white/[0.08]" />
              <div className="flex items-center space-x-2 text-xs text-white/30">
                <Command className="h-3 w-3" />
                <span>按 ESC 退出全屏</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* 视图切换按钮组 */}
              <div className="flex items-center space-x-1 bg-black/30 rounded-lg p-1 border border-white/[0.08]">
                <button
                  onClick={() => setViewMode("terminal")}
                  className={cn(
                    "p-1.5 rounded-md transition-all duration-200 relative group",
                    viewMode === "terminal" 
                      ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(99,102,241,0.1)]" 
                      : "hover:bg-white/5 text-white/40 hover:text-white/60"
                  )}
                  title="终端视图"
                >
                  <Terminal className="h-3.5 w-3.5 relative z-10" />
                  {viewMode === "terminal" && (
                    <motion.div
                      layoutId="activeView"
                      className="absolute inset-0 bg-primary/20 rounded-md -z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setViewMode("tree")}
                  className={cn(
                    "p-1.5 rounded-md transition-all duration-200 relative group",
                    viewMode === "tree" 
                      ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(99,102,241,0.1)]" 
                      : "hover:bg-white/5 text-white/40 hover:text-white/60"
                  )}
                  title="树形视图"
                >
                  <Box className="h-3.5 w-3.5 relative z-10" />
                  {viewMode === "tree" && (
                    <motion.div
                      layoutId="activeView"
                      className="absolute inset-0 bg-primary/20 rounded-md -z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setViewMode("radar")}
                  className={cn(
                    "p-1.5 rounded-md transition-all duration-200 relative group",
                    viewMode === "radar" 
                      ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(99,102,241,0.1)]" 
                      : "hover:bg-white/5 text-white/40 hover:text-white/60"
                  )}
                  title="雷达图"
                >
                  <Circle className="h-3.5 w-3.5 relative z-10" />
                  {viewMode === "radar" && (
                    <motion.div
                      layoutId="activeView"
                      className="absolute inset-0 bg-primary/20 rounded-md -z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-white/5 rounded-md transition-all duration-200 text-white/40 hover:text-white/60"
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>

              <div className="flex space-x-2">
                <button className="h-3 w-3 rounded-full bg-[#FF5F57] ring-1 ring-[#FF5F57]/20 hover:bg-[#FF5F57]/80 transition-colors duration-200" />
                <button className="h-3 w-3 rounded-full bg-[#FFBD2E] ring-1 ring-[#FFBD2E]/20 hover:bg-[#FFBD2E]/80 transition-colors duration-200" />
                <button className="h-3 w-3 rounded-full bg-[#28C840] ring-1 ring-[#28C840]/20 hover:bg-[#28C840]/80 transition-colors duration-200" />
              </div>
            </div>
          </div>

          {/* 主内容区 */}
          <div className="h-[600px] md:h-[700px] flex flex-col bg-black/10 backdrop-blur-3xl">
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
})

SkillsSection.displayName = "SkillsSection"

export default SkillsSection

