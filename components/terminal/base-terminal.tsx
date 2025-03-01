import { useState, useEffect, useRef, forwardRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Command } from "lucide-react"
import { cn } from "@/lib/utils"

export type CommandType = "system" | "command" | "error" | "success" | "info"

export interface CommandEntry {
  type: CommandType
  content: string
}

interface BaseTerminalProps {
  title?: string
  commands: Record<string, string>
  onCommand: (command: string) => void
  commandHistory: CommandEntry[]
  className?: string
}

export const BaseTerminal = forwardRef<HTMLDivElement, BaseTerminalProps>((props, ref) => {
  const { title = "terminal", commands, onCommand, commandHistory, className } = props
  
  const [commandSuggestions, setSuggestions] = useState<string[]>([])
  const [inputHistory, setInputHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const [typedCommand, setTypedCommand] = useState("")
  
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  // 命令处理
  const handleCommand = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.querySelector('input')
    if (!input) return
    const command = input.value.trim().toLowerCase()
    
    if (command) {
      setInputHistory(prev => [command, ...prev])
      setHistoryIndex(-1)
      onCommand(command)
      input.value = ""
      setSuggestions([])
      
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      }, 10)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        navigateHistory(-1)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        navigateHistory(1)
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [historyIndex, inputHistory])

  return (
    <div ref={ref} className={cn("flex flex-col h-full bg-black/20 backdrop-blur-2xl rounded-xl border border-white/10 shadow-[0_0_30px_10px_rgba(99,102,241,0.05)]", className)}>
      {/* 终端头部 */}
      <div className="bg-black/30 px-4 py-2 flex items-center justify-between border-b border-white/10 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-primary/70" />
          <span className="text-sm font-mono text-primary/70">{title}</span>
        </div>
      </div>

      {/* 终端内容 */}
      <div className="flex-1 flex flex-col">
        <div
          ref={terminalRef}
          className="flex-1 p-4 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-2"
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
                  entry.type === "command" && "text-primary/90",
                  entry.type === "error" && "text-red-400/90",
                  entry.type === "system" && "text-blue-400/90",
                  entry.type === "success" && "text-green-400/90",
                  entry.type === "info" && "text-yellow-400/90",
                )}
              >
                <pre className="whitespace-pre-wrap font-mono">{entry.content}</pre>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 命令输入区 */}
        <div className="border-t border-white/10 bg-black/30 p-4 rounded-b-xl">
          <div className="relative">
            {/* 命令提示 */}
            <AnimatePresence>
              {isFocused && commandSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-black/40 backdrop-blur-xl rounded-lg p-2 shadow-xl border border-white/10 z-50"
                >
                  {commandSuggestions.map((cmd, i) => (
                    <motion.button
                      key={cmd}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="w-full p-2 text-sm font-mono hover:bg-primary/20 rounded-md cursor-pointer flex items-center space-x-2 text-left"
                      onClick={() => {
                        if (inputRef.current) {
                          inputRef.current.value = cmd
                          inputRef.current.focus()
                          const form = inputRef.current.form
                          if (form) {
                            form.dispatchEvent(new Event('submit', { cancelable: true }))
                          }
                        }
                        setSuggestions([])
                      }}
                    >
                      <Command className="h-3 w-3 text-primary/60" />
                      <span>{cmd}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleCommand} className="flex items-center space-x-3">
              <div className="text-primary/70">{">"}</div>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-primary/90 placeholder-primary/30 focus:ring-0"
                placeholder="输入命令..."
                spellCheck={false}
                autoComplete="off"
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setTimeout(() => setIsFocused(false), 200)
                }}
                onChange={(e) => {
                  setTypedCommand(e.target.value)
                  updateSuggestions(e.target.value)
                }}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
})

BaseTerminal.displayName = "BaseTerminal" 