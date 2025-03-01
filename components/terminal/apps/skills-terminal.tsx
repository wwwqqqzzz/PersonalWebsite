import { useState, useEffect } from 'react'
import { BaseTerminal, CommandEntry } from '../base-terminal'

const commands = {
  help: "显示帮助信息",
  list: "列出所有技能类别",
  clear: "清除终端",
  about: "关于作者",
}

type SkillColor = "🔴" | "🟣" | "🔵" | "🟢" | "🟡" | "🟠"

interface Skill {
  name: string
  level: number
  icon: string
  color: SkillColor
}

interface SkillCategories {
  design: Skill[]
  frontend: Skill[]
  tools: Skill[]
}

const skills: SkillCategories = {
  "design": [
    { "name": "UI/UX 设计", "level": 95, "icon": "✏️", "color": "🟣" },
    { "name": "Figma", "level": 95, "icon": "🎨", "color": "🟡" },
    { "name": "响应式设计", "level": 90, "icon": "📱", "color": "🔵" },
    { "name": "交互设计", "level": 88, "icon": "🤝", "color": "🟢" },
    { "name": "无障碍设计", "level": 75, "icon": "👀", "color": "🟠" }
  ],
  "frontend": [
    { "name": "HTML/CSS", "level": 90, "icon": "🌐", "color": "🔴" },
    { "name": "JavaScript", "level": 85, "icon": "📜", "color": "🟡" },
    { "name": "React", "level": 90, "icon": "⚛️", "color": "🔵" },
    { "name": "TypeScript", "level": 80, "icon": "📘", "color": "🟣" },
    { "name": "动画", "level": 85, "icon": "✨", "color": "🟢" }
  ],
  "tools": [
    { "name": "Git", "level": 88, "icon": "📂", "color": "🟠" },
    { "name": "Node.js", "level": 75, "icon": "🟢", "color": "🟢" },
    { "name": "性能优化", "level": 80, "icon": "⚡", "color": "🟡" },
    { "name": "VS Code", "level": 95, "icon": "📝", "color": "🔵" },
    { "name": "Terminal", "level": 85, "icon": "💻", "color": "🟣" }
  ]
}

const colorMap: Record<SkillColor, string> = {
  "🔴": "text-red-500",
  "🟣": "text-purple-500",
  "🔵": "text-blue-500",
  "🟢": "text-green-500",
  "🟡": "text-yellow-500",
  "🟠": "text-orange-500"
}

export const SkillsTerminal = () => {
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([])

  useEffect(() => {
    const showSkills = async () => {
      // 显示欢迎信息
      setCommandHistory([
        { type: "system", content: "正在加载技能数据..." },
      ])

      await new Promise(resolve => setTimeout(resolve, 500))

      // 显示设计技能
      setCommandHistory(prev => [
        ...prev,
        { type: "info", content: "\n🎨 设计技能" }
      ])

      for (const skill of skills.design) {
        const barLength = 20
        const filledLength = Math.floor(skill.level / 100 * barLength)
        const filled = `<span class="${colorMap[skill.color]}">━</span>`.repeat(filledLength)
        const empty = "─".repeat(barLength - filledLength)
        const sparkles = "✨".repeat(Math.floor(skill.level / 20))
        
        setCommandHistory(prev => [
          ...prev,
          { type: "success", content: `${skill.icon} ${skill.name.padEnd(12)} [${filled}${empty}] ${skill.level}% ${sparkles}` }
        ])
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // 显示前端技能
      setCommandHistory(prev => [
        ...prev,
        { type: "info", content: "\n💻 前端技能" }
      ])

      for (const skill of skills.frontend) {
        const barLength = 20
        const filledLength = Math.floor(skill.level / 100 * barLength)
        const filled = `<span class="${colorMap[skill.color]}">━</span>`.repeat(filledLength)
        const empty = "─".repeat(barLength - filledLength)
        const sparkles = "✨".repeat(Math.floor(skill.level / 20))
        
        setCommandHistory(prev => [
          ...prev,
          { type: "success", content: `${skill.icon} ${skill.name.padEnd(12)} [${filled}${empty}] ${skill.level}% ${sparkles}` }
        ])
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // 显示工具技能
      setCommandHistory(prev => [
        ...prev,
        { type: "info", content: "\n🛠️ 工具技能" }
      ])

      for (const skill of skills.tools) {
        const barLength = 20
        const filledLength = Math.floor(skill.level / 100 * barLength)
        const filled = `<span class="${colorMap[skill.color]}">━</span>`.repeat(filledLength)
        const empty = "─".repeat(barLength - filledLength)
        const sparkles = "✨".repeat(Math.floor(skill.level / 20))
        
        setCommandHistory(prev => [
          ...prev,
          { type: "success", content: `${skill.icon} ${skill.name.padEnd(12)} [${filled}${empty}] ${skill.level}% ${sparkles}` }
        ])
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // 显示完成信息
      setCommandHistory(prev => [
        ...prev,
        { type: "info", content: "\n✨ 技能加载完成!" },
        { type: "info", content: "输入 'help' 查看可用命令" }
      ])
    }

    showSkills()
  }, [])

  const handleCommand = (command: string) => {
    const newHistory: CommandEntry[] = [...commandHistory, { type: "command", content: `> ${command}` }]

    switch (command) {
      case "help":
        newHistory.push({
          type: "info",
          content: Object.entries(commands)
            .map(([cmd, desc]) => `${cmd.padEnd(10)} - ${desc}`)
            .join("\n"),
        })
        break
      case "list":
        newHistory.push({
          type: "success",
          content: "🎨 设计\n💻 开发\n🛠️ 工具",
        })
        break
      case "about":
        newHistory.push({
          type: "info",
          content: "👨‍💻 王起哲\n🚀 全栈开发者 & UI设计师\n✨ 热爱创造优秀的用户体验\n🌟 永远保持学习的激情",
        })
        break
      case "clear":
        setCommandHistory([{ type: "system", content: "终端已清除" }])
        return
      default:
        newHistory.push({ type: "error", content: `未知命令: ${command}` })
    }

    setCommandHistory(newHistory)
  }

  return (
    <div className="h-full">
      <BaseTerminal
        title="skills.terminal"
        commands={commands}
        onCommand={handleCommand}
        commandHistory={commandHistory}
        className="h-full"
      />
    </div>
  )
}