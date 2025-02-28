import { motion } from "framer-motion"

interface TechRadarProps {
  data: { name: string; level: number }[]
}

export function TechRadar({ data }: TechRadarProps) {
  const maxRadius = 100
  const centerX = maxRadius
  const centerY = maxRadius

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${maxRadius * 2} ${maxRadius * 2}`}
        className="w-full h-full transform rotate-180"
      >
        {/* 背景圆环 */}
        {[0.25, 0.5, 0.75, 1].map((radius, i) => (
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={maxRadius * radius}
            fill="none"
            stroke="currentColor"
            className="text-foreground/5"
            strokeWidth="1"
          />
        ))}

        {/* 数据多边形 */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={data
            .map((tech, i) => {
              const angle = (i / data.length) * Math.PI * 2
              const radius = tech.level * maxRadius
              const x = centerX + radius * Math.cos(angle)
              const y = centerY + radius * Math.sin(angle)
              return `${i === 0 ? "M" : "L"} ${x} ${y}`
            })
            .concat(["Z"])
            .join(" ")}
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth="2"
        />

        {/* 数据点 */}
        {data.map((tech, i) => {
          const angle = (i / data.length) * Math.PI * 2
          const radius = tech.level * maxRadius
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)

          return (
            <motion.circle
              key={i}
              initial={{ r: 0, opacity: 0 }}
              animate={{ r: 4, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              cx={x}
              cy={y}
              className="fill-primary"
            />
          )
        })}
      </svg>

      {/* 标签 */}
      {data.map((tech, i) => {
        const angle = (i / data.length) * Math.PI * 2
        const radius = (tech.level * maxRadius) + 20
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-xs font-mono text-foreground/70"
            style={{
              left: x,
              top: y,
              transform: `translate(-50%, -50%) rotate(${180 + (angle * 180) / Math.PI}deg)`
            }}
          >
            {tech.name}
          </motion.div>
        )
      })}
    </div>
  )
} 