"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TextGenerateEffectProps {
  words: string
  className?: string
}

export const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({
  words,
  className = "",
}) => {
  const [complete, setComplete] = useState(false)
  const characters = words.split("")
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setComplete(true)
    }, 1500)
    
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={complete ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.2,
            delay: complete ? index * 0.1 : 0,
            ease: "easeOut",
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  )
} 