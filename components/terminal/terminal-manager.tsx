import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal as TerminalIcon, Command, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TerminalApp {
  id: string
  title: string
  component: React.ReactNode
  icon?: React.ReactNode
}

interface TerminalManagerProps {
  className?: string
}

export const TerminalManager = ({ className }: TerminalManagerProps) => {
  const [apps, setApps] = useState<TerminalApp[]>([])
  const [activeAppId, setActiveAppId] = useState<string | null>(null)

  const addApp = (app: TerminalApp) => {
    setApps(prev => [...prev, app])
    setActiveAppId(app.id)
  }

  const removeApp = (id: string) => {
    setApps(prev => prev.filter(app => app.id !== id))
    if (activeAppId === id) {
      const remaining = apps.filter(app => app.id !== id)
      setActiveAppId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-black/40 backdrop-blur-xl rounded-xl border border-primary/20", className)}>
      {/* 标签栏 */}
      <div className="bg-black/50 px-2 py-1 flex items-center border-b border-primary/20">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
          {apps.map(app => (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => setActiveAppId(app.id)}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                activeAppId === app.id
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-primary/10 text-primary/60"
              )}
            >
              {app.icon || <TerminalIcon className="h-3.5 w-3.5" />}
              <span>{app.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeApp(app.id)
                }}
                className="hover:bg-primary/20 rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 应用内容区 */}
      <div className="flex-1">
        {apps.map(app => (
          <div
            key={app.id}
            className={cn(
              "h-full",
              activeAppId === app.id ? "block" : "hidden"
            )}
          >
            {app.component}
          </div>
        ))}
      </div>
    </div>
  )
}

export const createTerminalApp = (
  id: string,
  title: string,
  component: React.ReactNode,
  icon?: React.ReactNode
): TerminalApp => ({
  id,
  title,
  component,
  icon
}) 