"use client";

import React, { useRef, useState, useEffect, forwardRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { gsap } from "gsap";

// 技能数据结构
interface Skill {
  name: string;
  level: number;
  icon: string;
}

interface SkillCategory {
  name: string;
  color: string;
  gradient: string;
  icon: string;
  description: string;
  skills: Skill[];
}

// 定义技能数据
const skillsData: SkillCategory[] = [
  {
    name: "前端开发",
    color: "rgb(56, 189, 248)",
    gradient: "from-blue-500 to-cyan-400",
    icon: "🌐",
    description: "构建交互性强、性能卓越的用户界面",
    skills: [
      { name: "React", level: 95, icon: "⚛️" },
      { name: "TypeScript", level: 90, icon: "📘" },
      { name: "Next.js", level: 92, icon: "⚡" },
      { name: "Tailwind CSS", level: 88, icon: "🎨" },
      { name: "Framer Motion", level: 85, icon: "🎬" },
    ],
  },
  {
    name: "后端开发",
    color: "rgb(74, 222, 128)",
    gradient: "from-emerald-500 to-green-400",
    icon: "🖥️",
    description: "搭建高性能、可扩展的服务端系统",
    skills: [
      { name: "Node.js", level: 88, icon: "🟢" },
      { name: "Python", level: 85, icon: "🐍" },
      { name: "数据库设计", level: 90, icon: "💾" },
      { name: "RESTful API", level: 92, icon: "🔌" },
      { name: "微服务架构", level: 86, icon: "🧩" },
    ],
  },
  {
    name: "UI/UX设计",
    color: "rgb(251, 113, 133)",
    gradient: "from-purple-500 to-violet-400",
    icon: "🎨",
    description: "设计优雅、直观、引人入胜的用户体验",
    skills: [
      { name: "交互设计", level: 90, icon: "🤝" },
      { name: "响应式设计", level: 95, icon: "📱" },
      { name: "动效设计", level: 88, icon: "✨" },
      { name: "可访问性", level: 85, icon: "♿" },
      { name: "用户测试", level: 82, icon: "🔍" },
    ],
  },
  {
    name: "DevOps",
    color: "rgb(251, 191, 36)",
    gradient: "from-orange-500 to-amber-400",
    icon: "🔄",
    description: "自动化开发、测试、部署流程",
    skills: [
      { name: "CI/CD", level: 85, icon: "🔄" },
      { name: "Docker", level: 88, icon: "🐳" },
      { name: "Kubernetes", level: 80, icon: "⚙️" },
      { name: "监控与日志", level: 82, icon: "📊" },
      { name: "云服务", level: 86, icon: "☁️" },
    ],
  },
];

// 计算环形布局的位置函数
const calculatePosition = (index: number, total: number, radius: number) => {
  const angle = (index / total) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  return { x, y, angle: (angle * 180) / Math.PI };
};

// 计算两点之间连线的属性
const getLineProps = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  return {
    x1: startX,
    y1: startY,
    x2: endX,
    y2: endY,
  };
};

// 检查是否为移动设备
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      const updateMatches = () => setMatches(media.matches);
      updateMatches();
      media.addEventListener("change", updateMatches);
      return () => media.removeEventListener("change", updateMatches);
    }
    return undefined;
  }, [query]);

  return matches;
};

interface SkillsSpectrumProps {
  className?: string;
}

// 合并多个ref的辅助函数
function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | null | undefined>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

const SkillsSpectrum = forwardRef<HTMLDivElement, SkillsSpectrumProps>((props, ref) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const spectrumRef = useRef<HTMLDivElement>(null);
  
  // 使用 IntersectionObserver 进行动画触发
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  
  // 滚动动画
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  // 检测移动设备
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 计算环形大小
  const baseRadius = isMobile ? 120 : 220;
  const radius = useTransform(scrollYProgress, [0, 0.5, 1], [baseRadius * 0.8, baseRadius, baseRadius * 0.9]);
  
  // 动画效果
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.8, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0.8]);
  
  // 背景动画
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 0.8, 0.8, 0]);
  
  // 处理触摸事件（移动端）
  const handleTouch = (category: string) => {
    if (isMobile) {
      setActiveCategory(activeCategory === category ? null : category);
    }
  };
  
  // 与项目模块和博客模块的视觉衔接
  useEffect(() => {
    const projectsSection = document.querySelector("#projects");
    const blogSection = document.querySelector("#blog");
    
    // 观察项目模块，进行过渡动画
    const projectsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && spectrumRef.current) {
            gsap.to(".skill-node", {
              scale: 0.8,
              opacity: 0.5,
              duration: 0.8,
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // 观察博客模块，进行过渡动画
    const blogObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && spectrumRef.current) {
            gsap.to(".spectrum-ring", {
              opacity: 0.2,
              scale: 1.2,
              duration: 0.8,
            });
            
            gsap.to(".skill-node", {
              y: 20,
              opacity: 0,
              stagger: 0.03,
              duration: 0.5,
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (projectsSection) projectsObserver.observe(projectsSection);
    if (blogSection) blogObserver.observe(blogSection);
    
    return () => {
      projectsObserver.disconnect();
      blogObserver.disconnect();
    };
  }, []);
  
  // 使用辅助函数合并refs
  const handleRef = mergeRefs([containerRef, inViewRef, ref]);
  
  // 计算光谱中心点
  const centerX = 0;
  const centerY = 0;
  
  // 渲染技能详情卡片
  const renderSkillDetails = () => {
    if (!activeCategory) return null;
    
    const category = skillsData.find((c) => c.name === activeCategory);
    if (!category) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-12 md:bottom-20 w-[90%] max-w-md p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{category.icon}</span>
          <h3 className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${category.gradient}`}>
            {category.name}
          </h3>
        </div>
        
        <p className="text-sm text-white/70 mb-4">{category.description}</p>
        
        <div className="space-y-3">
          {category.skills.map((skill) => (
            <div 
              key={skill.name}
              className={`transition-all duration-300 ${hoveredSkill === skill.name ? 'scale-105' : ''}`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{skill.icon}</span>
                  <span className="text-sm font-medium">{skill.name}</span>
                </div>
                <span className="text-xs text-white/70">{skill.level}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${category.gradient}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      ref={handleRef}
      id="skills"
      className={cn("min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-10", props.className)}
    >
      {/* 动态背景 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-blue-900/10"
        style={{ opacity: bgOpacity }}
      />
      
      {/* 背景粒子效果 */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* 标题 */}
      <motion.div
        className="text-center mb-16 md:mb-12 relative z-10"
        style={{ opacity }}
      >
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          技能光谱
        </h2>
        <p className="mt-4 text-white/60 max-w-md mx-auto">
          多年技术积累形成的互联技能网络
        </p>
      </motion.div>
      
      {/* 核心光谱展示 */}
      <motion.div
        ref={spectrumRef}
        className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] mx-auto"
        style={{
          scale,
          opacity,
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
        }}
      >
        {/* 环形 */}
        {skillsData.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            className="spectrum-ring absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 opacity-30 transition-all duration-500"
            style={{
              borderColor: category.color,
              width: useTransform(radius, (r) => `${r * 2 * ((categoryIndex + 1) / skillsData.length)}px`),
              height: useTransform(radius, (r) => `${r * 2 * ((categoryIndex + 1) / skillsData.length)}px`),
              opacity: activeCategory === category.name ? 0.7 : 0.15,
            }}
          />
        ))}
        
        {/* SVG 连接线 */}
        <svg className="absolute inset-0 w-full h-full">
          {/* 径向连接线 */}
          {activeCategory && (
            <g>
              {skillsData
                .find((c) => c.name === activeCategory)
                ?.skills.map((skill, i) => {
                  const category = skillsData.find((c) => c.name === activeCategory);
                  if (!category) return null;
                  
                  const categoryIndex = skillsData.findIndex((c) => c.name === activeCategory);
                  const totalSkills = category.skills.length;
                  const position = calculatePosition(i, totalSkills, baseRadius * ((categoryIndex + 1) / skillsData.length));
                  
                  return (
                    <motion.line
                      key={`line-${skill.name}`}
                      x1={centerX}
                      y1={centerY}
                      x2={position.x}
                      y2={position.y}
                      stroke={category.color}
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      className="connection-line"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredSkill === skill.name ? 0.8 : 0.3 }}
                      transition={{ duration: 0.3 }}
                    />
                  );
                })}
            </g>
          )}
          
          {/* 技能间连接线 */}
          {activeCategory && hoveredSkill && (
            <g>
              {skillsData
                .find((c) => c.name === activeCategory)
                ?.skills.map((skill, i) => {
                  if (skill.name === hoveredSkill) return null;
                  
                  const category = skillsData.find((c) => c.name === activeCategory);
                  if (!category) return null;
                  
                  const categoryIndex = skillsData.findIndex((c) => c.name === activeCategory);
                  const totalSkills = category.skills.length;
                  
                  const hoveredIndex = category.skills.findIndex((s) => s.name === hoveredSkill);
                  const hoveredPosition = calculatePosition(
                    hoveredIndex,
                    totalSkills,
                    baseRadius * ((categoryIndex + 1) / skillsData.length)
                  );
                  
                  const position = calculatePosition(
                    i,
                    totalSkills,
                    baseRadius * ((categoryIndex + 1) / skillsData.length)
                  );
                  
                  const lineProps = getLineProps(
                    hoveredPosition.x,
                    hoveredPosition.y,
                    position.x,
                    position.y
                  );
                  
                  return (
                    <motion.line
                      key={`connection-${skill.name}`}
                      {...lineProps}
                      stroke={category.color}
                      strokeWidth="1"
                      className="connection-line"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.6 }}
                      transition={{ duration: 0.6 }}
                    />
                  );
                })}
            </g>
          )}
        </svg>
        
        {/* 技能节点 */}
        {skillsData.map((category, categoryIndex) =>
          category.skills.map((skill, skillIndex) => {
            const totalSkills = category.skills.length;
            const position = calculatePosition(
              skillIndex,
              totalSkills,
              baseRadius * ((categoryIndex + 1) / skillsData.length)
            );
            
            const isActive = activeCategory === category.name;
            const isHovered = hoveredSkill === skill.name;
            
            return (
              <motion.div
                key={`${category.name}-${skill.name}`}
                className={`skill-node absolute left-1/2 top-1/2 cursor-pointer transition-all duration-300 flex items-center justify-center z-10`}
                style={{
                  x: position.x,
                  y: position.y,
                  opacity: isActive || !activeCategory ? 1 : 0.3,
                  scale: isHovered ? 1.3 : isActive ? 1.1 : 0.9,
                }}
                whileHover={{ scale: 1.3 }}
                onHoverStart={() => {
                  setHoveredSkill(skill.name);
                }}
                onHoverEnd={() => {
                  setHoveredSkill(null);
                }}
                onClick={() => handleTouch(category.name)}
              >
                <motion.div 
                  className="relative"
                  animate={{ 
                    rotate: isHovered ? [0, 45, 0, -45, 0] : 0
                  }}
                  transition={{ 
                    duration: isHovered ? 1.5 : 0.3,
                    repeat: isHovered ? Infinity : 0,
                    repeatType: "loop"
                  }}
                >
                  <div 
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-300 ${
                      isActive ? 'bg-white text-gray-800' : 'bg-white/20 text-white'
                    }`}
                  >
                    {skill.icon}
                  </div>
                  
                  {/* 技能名称标签 */}
                  <div 
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-70'
                    }`}
                  >
                    {skill.name}
                  </div>
                  
                  {/* 发光效果 */}
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: `0 0 15px 5px ${category.color}`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })
        )}
      </motion.div>
      
      {/* 类别选择栏 */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mt-10 px-4"
        style={{ opacity }}
      >
        {skillsData.map((category) => (
          <motion.button
            key={category.name}
            className={`px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              activeCategory === category.name
                ? "bg-white/20 border-white/40"
                : "bg-white/5 border-white/10"
            } border`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(
              activeCategory === category.name ? null : category.name
            )}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </span>
          </motion.button>
        ))}
      </motion.div>
      
      {/* 技能详情 */}
      <AnimatePresence>
        {renderSkillDetails()}
      </AnimatePresence>
    </div>
  );
});

SkillsSpectrum.displayName = "SkillsSpectrum";

export default SkillsSpectrum; 