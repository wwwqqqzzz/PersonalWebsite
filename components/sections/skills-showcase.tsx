"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { gsap } from "gsap";
import SVGPathAnimation, { createConnectionPath, createCircularPath, pathPresets } from "@/components/ui/svg-path-animation";

// 技能数据结构
interface SkillNode {
  name: string;
  level: number;
  color: string;
  pos: [number, number];
  icon: string;
  description: string;
  tags: string[];
}

// 技能分类结构
interface SkillCategory {
  name: string;
  color: string;
  skills: SkillNode[];
}

// 技能数据
const skillsData: SkillCategory[] = [
  {
    name: "前端开发",
    color: "#61DAFB",
    skills: [
      { name: "React", level: 95, color: "#61DAFB", icon: "⚛️", pos: [0.2, 0.3], 
        description: "构建高效、可复用的UI组件，掌握React Hooks、Context API和性能优化技巧",
        tags: ["组件开发", "状态管理", "性能优化"] },
      { name: "TypeScript", level: 90, color: "#3178C6", icon: "📘", pos: [0.7, 0.2], 
        description: "使用强类型系统提升代码质量，构建可维护的大型应用",
        tags: ["类型系统", "接口设计", "泛型"] },
      { name: "Next.js", level: 92, color: "#000000", icon: "⚡", pos: [0.5, 0.5], 
        description: "开发高性能的React应用，包括SSR、SSG和ISR渲染策略",
        tags: ["SSR", "路由系统", "API Routes"] },
      { name: "Tailwind", level: 88, color: "#38B2AC", icon: "🎨", pos: [0.8, 0.6], 
        description: "使用实用优先的CSS框架快速构建现代网站，无需离开HTML",
        tags: ["响应式设计", "暗色模式", "自定义主题"] },
      { name: "Framer Motion", level: 85, color: "#FF4154", icon: "✨", pos: [0.3, 0.7], 
        description: "实现流畅的动画和交互效果，提升用户体验",
        tags: ["动画", "手势", "过渡效果"] }
    ]
  },
  {
    name: "后端开发",
    color: "#8CC84B",
    skills: [
      { name: "Node.js", level: 88, color: "#8CC84B", icon: "🟢", pos: [0.3, 0.3], 
        description: "构建高性能的服务器应用，熟练使用Express和各种中间件",
        tags: ["API开发", "中间件", "异步编程"] },
      { name: "Python", level: 85, color: "#3776AB", icon: "🐍", pos: [0.7, 0.4], 
        description: "使用Python构建后端服务、数据处理和自动化脚本",
        tags: ["Flask", "数据处理", "自动化"] },
      { name: "数据库", level: 90, color: "#336791", icon: "💾", pos: [0.5, 0.7], 
        description: "设计高效的数据库架构，优化查询性能",
        tags: ["SQL", "NoSQL", "性能优化"] },
      { name: "微服务", level: 86, color: "#FF4088", icon: "🧩", pos: [0.2, 0.6], 
        description: "设计和实现基于微服务的系统架构，提高可扩展性和容错性",
        tags: ["服务拆分", "API网关", "服务发现"] },
      { name: "Docker", level: 82, color: "#2496ED", icon: "🐳", pos: [0.8, 0.2], 
        description: "使用容器技术简化部署和环境管理",
        tags: ["容器化", "CI/CD", "编排"] }
    ]
  },
  {
    name: "UI/UX设计",
    color: "#A259FF",
    skills: [
      { name: "Figma", level: 90, color: "#A259FF", icon: "🎭", pos: [0.4, 0.2], 
        description: "使用Figma创建界面设计、原型和设计系统",
        tags: ["界面设计", "原型", "协作"] },
      { name: "UI设计", level: 85, color: "#FF7262", icon: "🎨", pos: [0.7, 0.5], 
        description: "创建美观、现代的用户界面设计",
        tags: ["视觉设计", "布局", "色彩理论"] },
      { name: "UX设计", level: 88, color: "#38B2AC", icon: "🤝", pos: [0.2, 0.5], 
        description: "以用户为中心，设计直观、易用的交互体验",
        tags: ["用户研究", "信息架构", "可用性测试"] },
      { name: "动效设计", level: 80, color: "#FF4154", icon: "✨", pos: [0.5, 0.8], 
        description: "设计增强用户体验的平滑动画和过渡效果",
        tags: ["微交互", "状态转换", "注意力引导"] },
      { name: "设计系统", level: 85, color: "#6E56CF", icon: "🧰", pos: [0.8, 0.7], 
        description: "构建一致、可复用的设计系统和组件库",
        tags: ["风格指南", "组件库", "设计标准"] }
    ]
  }
];

const SkillsShowcase: React.FC = () => {
  // 使用单一 ref 引用
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("前端开发");
  const [activeSkill, setActiveSkill] = useState<SkillNode | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  
  // 滚动动画配置 - 使用 sectionRef
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // 分阶段动画参数
  const phase1 = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const phase2 = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);
  const phase3 = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  // 平滑参数
  const springConfig = { stiffness: 100, damping: 30, bounce: 0 };
  const smoothPhase1 = useSpring(phase1, springConfig);
  const smoothPhase2 = useSpring(phase2, springConfig);
  const smoothPhase3 = useSpring(phase3, springConfig);

  // 获取当前分类的技能
  const activeSkills = skillsData.find(c => c.name === activeCategory)?.skills || [];
  
  // 监听滚动速度
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      
      // 根据滚动速度调整动态效果
      gsap.to(".skill-node", {
        x: `+=${scrollVelocity * 0.05}`,
        y: `+=${scrollVelocity * 0.02}`,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.02,
        overwrite: true
      });
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // 与其他部分的模块衔接
  useEffect(() => {
    const projectsSection = document.querySelector("#projects");
    const blogSection = document.querySelector("#blog");
    
    // 观察项目模块，进行过渡动画
    const projectsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(".skill-node", {
              scale: 0.8,
              opacity: 0.5,
              stagger: 0.03,
              duration: 0.8,
              ease: "power2.out"
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
          if (entry.isIntersecting) {
            gsap.to(".skill-node", {
              y: 100,
              opacity: 0,
              stagger: 0.05,
              duration: 0.5,
              ease: "power2.out"
            });
            
            gsap.to(".skill-lines", {
              opacity: 0,
              duration: 0.3
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
  
  // 动态布局计算
  const calculateLayout = (skill: SkillNode, index: number) => {
    const baseX = skill.pos[0] * 100;
    const baseY = skill.pos[1] * 100;
    const delay = index * 0.05;
    
    return {
      x: useTransform(smoothPhase2, (p) => `${baseX + Math.sin((p + delay) * Math.PI * 2) * 5}%`),
      y: useTransform(smoothPhase2, (p) => `${baseY + Math.cos((p + delay) * Math.PI * 2) * 5}%`),
      scale: useTransform(smoothPhase1, [0, 1], [0.5, 1]),
      opacity: useTransform(
        smoothPhase1, 
        [0, 0.2, 0.8, 1], 
        [0, 1, 1, activeSkill ? (activeSkill.name === skill.name ? 1 : 0.3) : 1]
      ),
      rotate: useTransform(smoothPhase2, [0, 1], [-10, 10]),
      filter: useTransform(
        smoothPhase3,
        [0, 1],
        ["brightness(1) blur(0px)", "brightness(0.9) blur(1px)"]
      )
    };
  };
  
  // 生成SVG连接路径
  const generatePaths = useCallback(() => {
    if (!activeSkills || activeSkills.length <= 1) return [];
    
    const paths = [];
    // 创建中心环形路径
    paths.push({
      type: "center",
      path: createCircularPath(30, 8),
      color: `${skillsData.find(c => c.name === activeCategory)?.color || "#6366f1"}80`
    });
    
    // 创建技能之间的连接路径
    for (let i = 0; i < activeSkills.length - 1; i++) {
      const start = activeSkills[i];
      const end = activeSkills[i + 1];
      
      const startX = start.pos[0] * 100;
      const startY = start.pos[1] * 100;
      const endX = end.pos[0] * 100;
      const endY = end.pos[1] * 100;
      
      paths.push({
        type: "connection",
        path: createConnectionPath(startX, startY, endX, endY, 0.3),
        color: `${start.color}80`
      });
    }
    
    // 创建最后一个技能到第一个技能的连接，形成闭环
    const first = activeSkills[0];
    const last = activeSkills[activeSkills.length - 1];
    
    paths.push({
      type: "connection",
      path: createConnectionPath(
        last.pos[0] * 100,
        last.pos[1] * 100,
        first.pos[0] * 100,
        first.pos[1] * 100,
        0.3
      ),
      color: `${last.color}80`
    });
    
    return paths;
  }, [activeCategory, activeSkills]);
  
  return (
    <section 
      ref={sectionRef}
      id="skills"
      className="min-h-[200vh] relative"
    >
      {/* 标题区域 - 类似关于模块的风格 */}
      <div className="w-full flex justify-center items-center py-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="relative z-10"
        >
          <motion.h2
            className="text-5xl md:text-6xl font-mono font-bold text-foreground relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "circOut" }}
          >
            <span className="relative">
              技能宇宙
              <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-foreground/50 to-transparent" />
            </span>
          </motion.h2>
        </motion.div>
      </div>
    
      {/* 分类选择器 */}
      <div className="sticky top-0 z-10 pt-10 pb-5 bg-gradient-to-b from-background via-background to-transparent">
        <div className="flex justify-center">
          <div className="flex gap-4 px-6 py-3 rounded-full backdrop-blur-lg bg-background/10 border border-foreground/10 shadow-xl">
            {skillsData.map((category) => (
              <motion.button
                key={category.name}
                onClick={() => {
                  setActiveCategory(category.name);
                  setActiveSkill(null);
                  setActiveIndex(-1);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transform transition-all duration-300 ${
                  activeCategory === category.name 
                    ? "bg-white/10 text-white shadow-lg scale-110" 
                    : "text-white/60 hover:text-white/90"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  boxShadow: activeCategory === category.name ? `0 0 15px ${category.color}50` : 'none',
                  borderColor: activeCategory === category.name ? `${category.color}70` : 'transparent',
                  borderWidth: activeCategory === category.name ? '1px' : '0px',
                }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 固定定位的星云容器 */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden" ref={ref}>
        {/* 背景动态图案 */}
        <motion.div 
          className="absolute inset-0 bg-pattern-grid opacity-20"
          style={{
            scale: useTransform(smoothPhase2, [0, 1], [1, 1.2]),
            opacity: useTransform(smoothPhase3, [0, 1], [0.2, 0.1])
          }}
        />
        
        <motion.div 
          className="absolute inset-0 bg-pattern-dots opacity-10"
          style={{
            scale: useTransform(smoothPhase2, [0, 1], [1.2, 1]),
            opacity: useTransform(smoothPhase3, [0, 1], [0.15, 0.05])
          }}
        />
        
        {/* 背景渐变 */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-purple-900/10 to-blue-900/10"
          style={{
            opacity: useTransform(smoothPhase1, [0, 0.5], [0, 0.6])
          }}
        />
        
        {/* SVG路径动画 - 使用新组件 */}
        <div className="absolute inset-0 w-full h-full">
          {generatePaths().map((pathData, index) => (
            <SVGPathAnimation
              key={`path-${index}`}
              pathData={pathData.path}
              pathColor={pathData.color}
              pathWidth={pathData.type === "center" ? 1.5 : 2}
              scrollTriggerRef={sectionRef}
              startOffset="top 80%"
              endOffset="bottom 20%"
              duration={1.5 + index * 0.2}
              className="absolute inset-0"
            />
          ))}
        </div>
        
        {/* 核心标题 */}
        <motion.h2
          className="absolute top-28 left-1/2 -translate-x-1/2 text-4xl md:text-5xl font-bold text-center"
          style={{
            opacity: useTransform(smoothPhase1, [0, 0.1, 0.8, 1], [0, 1, 1, 0]),
            y: useTransform(smoothPhase1, [0, 0.1, 0.8, 1], [20, 0, 0, -20])
          }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-red-500">
            技能星云
          </span>
        </motion.h2>
        
        {/* 星云节点连线 - SVG */}
        <svg 
          className="absolute inset-0 w-full h-full skill-lines"
          style={{
            opacity: smoothPhase2.get() > 0.1 ? 0.3 : 0,
          }}
        >
          {activeSkill && activeSkills.map((skill) => {
            if (skill.name !== activeSkill.name) {
              // 计算两点之间的连线
              const x1 = activeSkill.pos[0] * 100;
              const y1 = activeSkill.pos[1] * 100;
              const x2 = skill.pos[0] * 100;
              const y2 = skill.pos[1] * 100;
              
              return (
                <motion.line
                  key={`line-${activeSkill.name}-${skill.name}`}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke={activeSkill.color}
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  strokeDasharray="5,5"
                  className="connection-line"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              );
            }
            return null;
          })}
        </svg>
        
        {/* 核心星云布局 */}
        <motion.div 
          className="relative w-full h-full"
          style={{
            scale: useTransform(smoothPhase1, [0, 1], [0.8, 1]),
            rotate: useTransform(smoothPhase2, [0, 1], [-5, 5])
          }}
        >
          {activeSkills.map((skill, i) => {
            const layout = calculateLayout(skill, i);
            
            return (
              <motion.div
                key={skill.name}
                className="skill-node absolute cursor-pointer origin-center will-change-transform"
                style={{
                  x: layout.x,
                  y: layout.y,
                  scale: layout.scale,
                  opacity: layout.opacity,
                  rotate: layout.rotate,
                  filter: layout.filter
                }}
                whileHover={{ scale: 1.15, rotate: 0 }}
                onClick={() => {
                  setActiveSkill(activeSkill?.name === skill.name ? null : skill);
                  setActiveIndex(activeSkill?.name === skill.name ? -1 : i);
                }}
              >
                <motion.div 
                  className="relative flex flex-col items-center justify-center"
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3 + i * 0.5,
                    ease: "easeInOut"
                  }}
                >
                  {/* 发光节点 - 增强视觉效果 */}
                  <div 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white font-medium shadow-xl z-10 backdrop-blur-sm transform-gpu"
                    style={{ 
                      backgroundColor: `${skill.color}40`,
                      boxShadow: `0 0 30px ${skill.color}60`,
                      border: `2px solid ${skill.color}80`
                    }}
                  >
                    <span className="text-2xl">{skill.icon}</span>
                  </div>
                  
                  {/* 外发光环 */}
                  <motion.div
                    className="absolute w-full h-full rounded-full"
                    style={{ 
                      boxShadow: `0 0 40px ${skill.color}30`,
                    }}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* 名称标签 */}
                  <div 
                    className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-sm font-medium text-white whitespace-nowrap px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm z-10"
                    style={{
                      opacity: activeSkill?.name === skill.name ? 1 : 0.8,
                      border: `1px solid ${skill.color}40`,
                    }}
                  >
                    {skill.name}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* 滚动指示器 */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center flex-col gap-2"
          style={{
            opacity: useTransform(smoothPhase3, [0, 0.5], [1, 0])
          }}
        >
          <div className="text-white/60 text-sm">继续滚动探索</div>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
            <motion.div 
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ 
                y: [0, 3, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* 解说文案层 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        <AnimatePresence>
          {activeSkill && (
            <motion.div
              className="absolute w-64 md:w-72 p-5 backdrop-blur-lg bg-black/20 rounded-xl border border-white/10 text-white"
              style={{
                left: `calc(${activeSkill.pos[0] * 100}% + 60px)`,
                top: `${activeSkill.pos[1] * 100}%`,
                transform: `translate(-50%, -50%)`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span>{activeSkill.icon}</span>
                <span>{activeSkill.name}</span>
              </h3>
              
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span>掌握程度</span>
                  <span>{activeSkill.level}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: activeSkill.color,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${activeSkill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
              
              <p className="text-sm text-white/80 mb-3">
                {activeSkill.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5">
                {activeSkill.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs px-2 py-0.5 rounded-full bg-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 技能路径动画指示区 */}
      <div className="relative w-full h-[50vh] overflow-hidden bg-gradient-to-b from-transparent to-background/50 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto p-6">
          <motion.div 
            className="bg-card/10 backdrop-blur border border-primary/10 rounded-lg p-6 shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-center mb-6">技能进阶路径</h3>
            <div className="relative h-24">
              {/* 路径SVG动画 */}
              <SVGPathAnimation
                pathData={pathPresets.wave}
                pathColor="#6366f1"
                pathWidth={2}
                scrollTriggerRef={sectionRef}
                duration={2}
                className="absolute inset-0"
              >
                {/* 路径上的技能节点 */}
                <div className="relative w-full h-full">
                  {['入门', '进阶', '专业', '精通', '专家'].map((level, i) => (
                    <motion.div 
                      key={level}
                      className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                      style={{ left: `${i * 25}%` }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center 
                                    ${i <= activeIndex ? 'bg-indigo-500' : 'bg-indigo-500/20'} 
                                    transition-all duration-500`}
                      >
                        <span className="text-xs font-bold text-white">{i + 1}</span>
                      </div>
                      <span className="text-xs mt-2 text-foreground">{level}</span>
                    </motion.div>
                  ))}
                </div>
              </SVGPathAnimation>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillsShowcase; 