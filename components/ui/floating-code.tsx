"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface FloatingCodeWindowProps {
  snippets: string[]
}

export const FloatingCodeWindow: React.FC<FloatingCodeWindowProps> = ({ snippets }) => {
  const [currentSnippet, setCurrentSnippet] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSnippet((prev) => (prev + 1) % snippets.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [snippets.length])

  return (
    <motion.div
      className="absolute top-1/4 right-[15%] w-[360px] hidden lg:block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-background/50 backdrop-blur-xl rounded-lg border border-foreground/10 shadow-xl overflow-hidden">
        {/* 编辑器顶部栏 */}
        <div className="flex items-center justify-between px-4 py-2 bg-foreground/5 border-b border-foreground/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/20" />
            <span className="text-xs text-foreground/50 font-mono">code.tsx</span>
          </div>
          <div className="flex items-center text-[10px] text-foreground/40 font-mono">
            <span>TypeScript • UTF-8</span>
          </div>
        </div>

        {/* 编辑器内容区 */}
        <div className="p-4 flex items-start gap-4">
          {/* 行号 */}
          <div className="flex flex-col items-end gap-1 pr-4 border-r border-foreground/10">
            {snippets[currentSnippet].split('\n').map((_, i) => (
              <span key={i} className="text-xs text-foreground/30 font-mono">{i + 1}</span>
            ))}
          </div>

          {/* 代码内容 */}
          <pre className="text-sm font-mono overflow-x-auto flex-1">
            <code className="text-foreground/70">
              {snippets[currentSnippet].split('\n').map((line, i) => (
                <div key={i} className="whitespace-pre">
                  {line.split(/([{}()[\]<>="'`.]|\b(?:function|const|interface|return|true)\b)/).map((part, j) => {
                    if (part.match(/^(?:function|const|interface|return|true)$/)) {
                      return <span key={j} className="text-primary">{part}</span>
                    }
                    if (part.match(/[{}()[\]<>="'`.]/)) {
                      return <span key={j} className="text-primary/70">{part}</span>
                    }
                    return <span key={j}>{part}</span>
                  })}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </motion.div>
  )
} 