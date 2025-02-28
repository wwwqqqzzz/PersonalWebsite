"use client"

import { useState, useEffect, useRef, forwardRef } from "react"
import { motion } from "framer-motion"
import { Terminal, Circle, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

const skills = [
  {
    category: "设计",
    items: [
      { name: "UI/UX设计", level: 95 },
      { name: "交互设计", level: 90 },
      { name: "原型设计", level: 92 },
      { name: "用户研究", level: 85 },
      { name: "设计系统", level: 88 },
    ],
  },
  {
    category: "开发",
    items: [
      { name: "HTML/CSS", level: 90 },
      { name: "JavaScript", level: 85 },
      { name: "React", level: 80 },
      { name: "Next.js", level: 75 },
      { name: "Tailwind CSS", level: 85 },
    ],
  },
  {
    category: "工具",
    items: [
      { name: "Figma", level: 95 },
      { name: "Adobe XD", level: 90 },
      { name: "Photoshop", level: 85 },
      { name: "Illustrator", level: 80 },
      { name: "After Effects", level: 70 },
    ],
  },
  {
    category: "软技能",
    items: [
      { name: "团队协作", level: 95 },
      { name: "沟通能力", level: 90 },
      { name: "项目管理", level: 85 },
      { name: "解决问题", level: 90 },
      { name: "创新思维", level: 88 },
    ],
  },
]

interface SkillsSectionProps {
  className?: string
}

const SkillsSection = forwardRef<HTMLDivElement, SkillsSectionProps>((props, ref) => {
  const [activeCategory, setActiveCategory] = useState("设计")
  const [typedCommand, setTypedCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState([
    { type: "system", content: "欢迎来到王起哲的技能终端 v1.0.0" },
    { type: "system", content: "输入 'help' 查看可用命令" },
    { type: "system", content: "正在加载技能数据..." },
    { type: "system", content: "技能数据加载完成！" },
    { type: "system", content: "输入 'list' 查看所有技能类别" },
  ])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  const handleCommand = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const input = e.currentTarget.querySelector('input')
      if (!input) return
      const command = input.value.trim().toLowerCase()
      
      if (command) {
        const newHistory = [...commandHistory, { type: "command", content: `> ${command}` }]

        if (command === "help") {
          newHistory.push({
            type: "response",
            content:
              "可用命令：\n- list：列出所有技能类别\n- show [类别]：显示指定类别的技能\n- clear：清除终端\n- help：显示帮助信息",
          })
        } else if (command === "list") {
          newHistory.push({
            type: "response",
            content: `可用技能类别：\n${skills.map((s) => `- ${s.category}`).join("\n")}`,
          })
        } else if (command.startsWith("show ")) {
          const category = command.replace("show ", "")
          const foundCategory = skills.find((s) => s.category.toLowerCase() === category)

          if (foundCategory) {
            setActiveCategory(foundCategory.category)
            newHistory.push({ type: "response", content: `显示 ${foundCategory.category} 技能...` })
          } else {
            newHistory.push({ type: "error", content: `错误：找不到类别 "${category}"` })
          }
        } else if (command === "clear") {
          setCommandHistory([{ type: "system", content: "终端已清除" }])
          setTypedCommand("")
          return
        } else {
          newHistory.push({ type: "error", content: `错误：未知命令 "${command}"` })
        }

        setCommandHistory(newHistory)
        setTypedCommand("")

        // Auto scroll to bottom
        setTimeout(() => {
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
          }
        }, 10)
      }
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commandHistory])

  // Simulate typing effect
  const typeCommand = async (command: string) => {
    setIsTyping(true)
    setTypedCommand("")

    for (let i = 0; i < command.length; i++) {
      setTypedCommand((prev) => prev + command[i])
      await new Promise((r) => setTimeout(r, 50 + Math.random() * 50))
    }

    setIsTyping(false)
  }

  useEffect(() => {
    if (activeCategory && !isTyping) {
      typeCommand(`show ${activeCategory.toLowerCase()}`)
    }
  }, [activeCategory, isTyping]) // Added isTyping to dependencies

  return (
    <motion.div
      ref={ref}
      id="skills"
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={cn(
          "w-full bg-black/90 backdrop-blur-md rounded-xl overflow-hidden border border-primary/20 shadow-xl transition-all duration-500",
          isExpanded ? "fixed inset-4 z-50" : "relative",
        )}
      >
        {/* Terminal header */}
        <div className="bg-muted/30 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-sm font-mono">skills.terminal</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-muted/20 rounded">
              {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </button>
            <div className="flex space-x-1">
              <Circle className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <Circle className="h-3 w-3 text-green-500 fill-green-500" />
              <Circle className="h-3 w-3 text-red-500 fill-red-500" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-5">
          {/* Terminal sidebar */}
          <div className="md:col-span-1 bg-black/50 border-r border-primary/10 p-4 hidden md:block">
            <h3 className="text-primary text-sm font-mono mb-4">技能类别</h3>
            <div className="space-y-2">
              {skills.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setActiveCategory(category.category)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded text-sm font-mono transition-colors",
                    activeCategory === category.category
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-muted/10 text-foreground/70",
                  )}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal content */}
          <div className="md:col-span-4 flex flex-col h-[500px] md:h-[600px]">
            {/* Terminal output */}
            <div
              ref={terminalRef}
              className="flex-1 p-4 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
            >
              {commandHistory.map((entry, i) => (
                <div
                  key={i}
                  className={cn(
                    "mb-2",
                    entry.type === "command" ? "text-primary" : "",
                    entry.type === "error" ? "text-red-400" : "",
                    entry.type === "system" ? "text-blue-400" : "",
                    entry.type === "response" ? "text-green-400" : "",
                  )}
                >
                  <pre className="whitespace-pre-wrap font-mono">{entry.content}</pre>
                </div>
              ))}

              {/* Active category visualization */}
              {activeCategory && (
                <div className="mt-4 border border-primary/20 rounded-lg p-4 bg-black/50">
                  <div className="text-primary mb-3">{activeCategory} 技能评估：</div>
                  <div className="space-y-4">
                    {skills
                      .find((s) => s.category === activeCategory)
                      ?.items.map((skill, i) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="space-y-1"
                        >
                          <div className="flex justify-between">
                            <span>{skill.name}</span>
                            <span>{skill.level}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                              className="h-full bg-primary rounded-full"
                            ></motion.div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Terminal input */}
            <form onKeyDown={handleCommand} className="border-t border-primary/20 p-4 flex items-center">
              <span className="text-primary mr-2 font-mono">{">"}</span>
              <input
                type="text"
                value={typedCommand}
                onChange={(e) => setTypedCommand(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-mono text-foreground"
                placeholder="输入命令..."
                disabled={isTyping}
              />
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
})

SkillsSection.displayName = "SkillsSection"

export default SkillsSection

