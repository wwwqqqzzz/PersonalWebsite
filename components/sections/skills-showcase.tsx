"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence, 
  useInView, 
  useAnimation, 
  useMotionValue, 
  useSpring, 
  useTransform,
  useScroll,
  stagger
} from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  LucideIcon, 
  Zap, 
  Code, 
  PanelRight, 
  Bot, 
  Layers,
  Award,
  LineChart,
  X,
  Maximize2,
  Minimize2
} from "lucide-react";

// 使用Framer Motion变体系统定义动画
const containerVariants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.6
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: 0.4
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.6
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const bgElementVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 0.8, 
    scale: 1,
    transition: { 
      duration: 1.2,
      ease: "easeOut" 
    }
  }
};

const particleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 0.6,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.8
    }
  })
};

// 获取技能图标的函数
const getSkillInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
}

// 获取技能图标的背景颜色
const getSkillColor = (name: string) => {
  const colors = {
    "React": "bg-blue-500",
    "Next.js": "bg-black",
    "TypeScript": "bg-blue-600",
    "JavaScript": "bg-yellow-400",
    "HTML/CSS": "bg-orange-500",
    "Tailwind CSS": "bg-cyan-500",
    "Node.js": "bg-green-600",
    "Express": "bg-gray-800",
    "Python": "bg-blue-800",
    "数据库": "bg-red-600",
    "微服务": "bg-purple-500",
    "Docker": "bg-blue-400",
    "Figma": "bg-purple-400",
    "交互设计": "bg-pink-500", 
    "视觉设计": "bg-indigo-500",
    "动效设计": "bg-orange-400",
    "可用性测试": "bg-green-500",
    "响应式设计": "bg-yellow-500",
    "前端性能": "bg-red-500",
    "SEO优化": "bg-green-400",
    "Core Web Vitals": "bg-blue-500",
    "代码分割": "bg-amber-500",
    "缓存策略": "bg-indigo-400",
    "性能监控": "bg-teal-500",
    "LLM集成": "bg-violet-500",
    "AI辅助开发": "bg-emerald-500",
    "数据分析": "bg-blue-700",
    "聊天机器人": "bg-pink-600",
    "实时语音处理": "bg-cyan-600",
    "生成式AI应用": "bg-purple-600"
  };
  
  return colors[name as keyof typeof colors] || "bg-gray-500";
}

// 技能分类及项目数据
interface SkillItem {
  name: string;
  level: number;
  description: string;
  logo?: string;
}

interface SkillCategory {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string; 
  items: SkillItem[];
}

// 定义技能分类数据
const skillCategories: SkillCategory[] = [
  {
    name: "前端开发",
    description: "构建现代化、响应式、高性能的用户界面和Web应用",
    icon: <Code size={24} />,
    color: "from-blue-500 to-cyan-400",
    items: [
      { name: "React", level: 95, description: "使用React构建复杂的单页应用，包括Hooks、Context、Redux等状态管理方案" },
      { name: "Next.js", level: 90, description: "使用Next.js开发SSR/SSG应用，优化页面加载性能和SEO" },
      { name: "TypeScript", level: 92, description: "使用TypeScript进行类型安全的开发，提高代码质量和可维护性" },
      { name: "HTML/CSS", level: 95, description: "深入理解HTML语义化和CSS布局技术，包括Flexbox和Grid" },
      { name: "Tailwind CSS", level: 88, description: "使用Tailwind CSS快速构建现代UI，定制主题系统" },
      { name: "JavaScript", level: 94, description: "精通现代JavaScript (ES6+)，异步编程，函数式编程" }
    ]
  },
  {
    name: "后端开发",
    description: "设计和构建可扩展、高性能的服务端应用和API",
    icon: <PanelRight size={24} />,
    color: "from-emerald-500 to-green-500",
    items: [
      { name: "Node.js", level: 88, description: "使用Node.js构建高性能服务器应用，REST和GraphQL API" },
      { name: "Express", level: 86, description: "使用Express框架快速开发Web服务和中间件" },
      { name: "Python", level: 85, description: "使用Python进行数据处理、自动化和后端开发" },
      { name: "数据库", level: 83, description: "设计和优化SQL和NoSQL数据库架构，MongoDB, PostgreSQL" },
      { name: "微服务", level: 80, description: "设计和实现基于微服务的系统架构" },
      { name: "Docker", level: 82, description: "容器化应用部署和环境管理" }
    ]
  },
  {
    name: "UI/UX设计",
    description: "创造直观、美观、易用的用户界面和体验",
    icon: <Layers size={24} />,
    color: "from-purple-500 to-violet-500",
    items: [
      { name: "Figma", level: 90, description: "使用Figma创建界面设计、原型和设计系统" },
      { name: "交互设计", level: 85, description: "设计用户友好的交互模式和流程" },
      { name: "视觉设计", level: 82, description: "应用色彩理论、排版和视觉层次原则创建吸引人的界面" },
      { name: "动效设计", level: 80, description: "通过动画和过渡效果增强用户体验" },
      { name: "可用性测试", level: 78, description: "进行用户测试并根据反馈迭代改进设计" },
      { name: "响应式设计", level: 88, description: "为各种设备尺寸创建无缝体验" }
    ]
  },
  {
    name: "性能优化",
    description: "提升应用性能，优化加载速度和用户体验",
    icon: <Zap size={24} />,
    color: "from-amber-500 to-orange-500",
    items: [
      { name: "前端性能", level: 87, description: "优化加载时间、运行时性能和流畅度" },
      { name: "SEO优化", level: 84, description: "提高网站在搜索引擎中的可见性和排名" },
      { name: "Core Web Vitals", level: 85, description: "优化LCP、FID和CLS等关键性能指标" },
      { name: "代码分割", level: 86, description: "实现按需加载和智能代码分割" },
      { name: "缓存策略", level: 82, description: "设计有效的缓存机制提高响应速度" },
      { name: "性能监控", level: 80, description: "实现性能监测和报告系统" }
    ]
  },
  {
    name: "人工智能",
    description: "应用AI技术增强应用功能，优化用户体验",
    icon: <Bot size={24} />,
    color: "from-pink-500 to-rose-500",
    items: [
      { name: "LLM集成", level: 83, description: "集成大型语言模型到应用中，增强交互功能" },
      { name: "AI辅助开发", level: 87, description: "使用AI工具加速代码生成、调试和优化" },
      { name: "数据分析", level: 85, description: "运用机器学习分析用户数据，得出有价值的结论" },
      { name: "聊天机器人", level: 82, description: "设计和实现智能客服和AI助手" },
      { name: "实时语音处理", level: 80, description: "实现语音识别和处理功能" },
      { name: "生成式AI应用", level: 84, description: "开发利用生成式AI创建内容的应用" }
    ]
  }
];

const SkillCard = ({ 
  category, 
  isActive, 
  onClick, 
  index, 
  totalCards 
}: {
  category: SkillCategory;
  isActive: boolean;
  onClick: () => void;
  index: number;
  totalCards: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const springConfig = { stiffness: 300, damping: 30 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;
    x.set(xPct * 50);
    y.set(yPct * 50);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // 自定义入场动画的延迟，基于卡片在网格中的位置
  const customDelay = index * 0.08;

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      custom={customDelay}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d"
      }}
      className={`
        group relative rounded-2xl overflow-hidden cursor-pointer transition-all
        ${isActive 
          ? "border-2 border-primary/40 shadow-xl shadow-primary/10" 
          : "border border-foreground/10 hover:border-foreground/20"
        }
        p-5 bg-background/60 backdrop-blur-sm
      `}
    >
      {/* 卡片背景渐变效果 */}
      <motion.div 
        className={`absolute inset-0 opacity-0 transition-opacity duration-700 ${isActive ? 'opacity-10' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0.1 : 0 }}
        whileHover={{ opacity: 0.2 }}
        style={{
          background: `linear-gradient(135deg, ${category.color.split(' ')[0].replace('from-', '')} 0%, ${category.color.split(' ')[1].replace('to-', '')} 100%)`,
        }}
      />
      
      {/* 闪光效果 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ backgroundPosition: "-100% 100%" }}
        whileHover={{
          backgroundPosition: ["200% 100%", "-100% 100%"],
          opacity: [0, 0.5, 0],
        }}
        transition={{ duration: 1.5, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 2 }}
      />
      
      <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: customDelay + 0.2, duration: 0.5 }}
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${category.color} text-white`}
        >
          {category.icon}
        </motion.div>
        
        <motion.h3 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: customDelay + 0.3, duration: 0.4 }}
          className="text-lg md:text-xl font-semibold mb-2"
        >
          {category.name}
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: customDelay + 0.4, duration: 0.4 }}
          className="text-sm text-foreground/70 mb-4 line-clamp-2"
        >
          {category.description}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: customDelay + 0.5, duration: 0.4 }}
          className="flex gap-1.5 items-center text-primary"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          <span className="text-xs font-medium">{category.items.length} 项技能</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

const SkillLevel = ({ level }: { level: number }) => {
  const levelDescriptions: Record<number, string> = {
    90: "专家",
    80: "熟练",
    70: "中级",
    60: "入门"
  };

  // 找到最接近的等级描述
  const nearestKey = Object.keys(levelDescriptions)
    .map(Number)
    .reduce((prev, curr) => (
      Math.abs(curr - level) < Math.abs(prev - level) ? curr : prev
    ));

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-foreground/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ 
            duration: 1.5, 
            delay: 0.2,
            ease: [0.33, 1, 0.68, 1]  // cubic-bezier easing
          }}
          className={`h-full rounded-full bg-primary`}
        />
      </div>
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="text-xs font-medium text-foreground/60 min-w-10 text-right"
      >
        {levelDescriptions[nearestKey as keyof typeof levelDescriptions]}
      </motion.span>
    </div>
  );
};

// 装饰性粒子组件
const Particle = ({ 
  index, 
  top, 
  left, 
  size, 
  color, 
  delay 
}: { 
  index: number; 
  top: string; 
  left: string; 
  size: number; 
  color: string; 
  delay: number;
}) => {
  return (
    <motion.div
      custom={index}
      variants={particleVariants}
      initial="hidden"
      animate="visible"
      className="absolute rounded-full"
      style={{
        top,
        left,
        width: size,
        height: size,
        backgroundColor: color,
      }}
    />
  );
};

// 技能详情弹窗组件
const SkillDetailModal = ({ 
  skill, 
  isOpen, 
  onClose 
}: { 
  skill: SkillItem | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  if (!skill || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩层 */}
          <motion.div 
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* 底部弹出抽屉 */}
          <motion.div 
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="bg-white dark:bg-zinc-900 rounded-t-3xl overflow-auto max-h-[90vh]">
              {/* 顶部滑动条示意 */}
              <div className="py-2 flex justify-center">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              </div>
              
              {/* 操作按钮区 */}
              <div className="px-4 flex justify-between items-center">
                <button 
                  onClick={() => {
                    onClose();
                    // 这里延迟一下再打开分类模态框，避免动画冲突
                    setTimeout(() => {
                      document.dispatchEvent(new CustomEvent('openCategoryModal'));
                    }, 200);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <ChevronLeft size={20} />
                  <span className="text-sm">返回</span>
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* 内容头部 */}
              <div className="px-5 pt-2 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-medium ${getSkillColor(skill.name)}`}>
                    {getSkillInitial(skill.name)}
                  </div>
                  <h3 className="text-xl font-semibold">{skill.name}</h3>
                </div>
              </div>
              
              {/* 内容主体 */}
              <div className="px-5 pb-8">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-foreground/70 mb-2">熟练度</h4>
                  <SkillLevel level={skill.level} />
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-foreground/70 mb-2">描述</h4>
                  <p className="text-sm leading-relaxed">{skill.description}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-medium text-foreground/70 mb-3">技能特性</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {["专业应用", "持续学习", "实践经验", "解决问题"].map((trait) => (
                      <div key={trait} className="flex items-center gap-2 text-sm text-foreground/70">
                        <Star size={14} className="text-primary" />
                        <span>{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// 分类详情模态窗口组件
const CategoryDetailModal = ({ 
  category, 
  isOpen, 
  onClose,
  onSkillClick 
}: { 
  category: SkillCategory | null; 
  isOpen: boolean; 
  onClose: () => void;
  onSkillClick: (skill: SkillItem) => void;
}) => {
  if (!category || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩层 */}
          <motion.div 
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* 底部弹出抽屉 */}
          <motion.div 
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="bg-white dark:bg-zinc-900 rounded-t-3xl overflow-auto max-h-[90vh]">
              {/* 顶部滑动条示意 */}
              <div className="py-2 flex justify-center">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              </div>
              
              {/* 操作按钮区 */}
              <div className="px-4 flex justify-end items-center">
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* 内容头部 */}
              <div className="px-5 pt-2 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${category.color.split(' ')[0].replace('from-', 'bg-')}`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>
              </div>
              
              {/* 内容主体 */}
              <div className="px-5 pb-8">
                <p className="text-sm mb-6 text-foreground/80">{category.description}</p>
                
                <h4 className="text-sm font-medium mb-4">专业技能</h4>
                <div className="space-y-3">
                  {category.items.map((skill) => (
                    <motion.button
                      key={skill.name}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSkillClick(skill)}
                      className="flex items-center gap-3 p-3 w-full rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-left transition-colors"
                    >
                      <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white text-lg ${getSkillColor(skill.name)}`}>
                        {getSkillInitial(skill.name)}
                      </div>
                      <div>
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-xs text-foreground/60">点击查看详情</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SkillsShowcase = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // 增强滚动触发的动画控制
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // 视差滚动效果
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const sectionOpacity = useTransform(scrollYProgress, 
    [0, 0.1, 0.9, 1], 
    [0, 1, 1, 0]
  );
  const sectionScale = useTransform(scrollYProgress, 
    [0, 0.1, 0.9, 1], 
    [0.95, 1, 1, 0.95]
  );
  
  // 使用inView钩子精确控制入场动画
  const isInView = useInView(containerRef, { 
    once: false, 
    amount: 0.2,
    margin: "-100px 0px"
  });
  
  // 检测设备类型和设置事件监听
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 检测设备类型
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 添加事件监听器，处理从技能详情返回到分类详情的功能
    const handleOpenCategoryModal = () => {
      if (activeCategory) {
        setIsCategoryModalOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    document.addEventListener('openCategoryModal', handleOpenCategoryModal);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('openCategoryModal', handleOpenCategoryModal);
    };
  }, [activeCategory]);

  const handleCategoryClick = (category: SkillCategory) => {
    setActiveCategory(category.name);
    setIsCategoryModalOpen(true);
  };

  const handleSkillClick = (skill: SkillItem) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
    setIsCategoryModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setActiveCategory(null);
  };

  const activeSkillCategory = skillCategories.find(c => c.name === activeCategory);
  
  // 生成随机粒子数据
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 6 + 2,
    color: `hsla(${Math.random() * 360}, 70%, 70%, 0.4)`,
    delay: Math.random() * 2
  }));

  return (
    <motion.div 
      ref={containerRef}
      className="min-h-screen w-full relative py-20 overflow-hidden"
      style={{
        opacity: sectionOpacity,
        scale: sectionScale
      }}
    >
      {/* 背景效果 */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <motion.div 
          className="absolute right-0 top-1/4 w-96 h-96 rounded-full blur-3xl"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={bgElementVariants}
          style={{ 
            y: bgY,
            background: activeSkillCategory 
              ? `linear-gradient(135deg, ${activeSkillCategory.color.split(' ')[0].replace('from-', '')} 0%, ${activeSkillCategory.color.split(' ')[1].replace('to-', '')} 100%)`
              : 'linear-gradient(135deg, var(--primary) 0%, hsl(var(--primary-foreground)) 100%)'
          }}
        />
        <motion.div 
          className="absolute left-0 bottom-1/4 w-96 h-96 rounded-full blur-3xl"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={bgElementVariants}
          style={{ 
            y: useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]),
            background: activeSkillCategory 
              ? `linear-gradient(135deg, ${activeSkillCategory.color.split(' ')[1].replace('to-', '')} 0%, ${activeSkillCategory.color.split(' ')[0].replace('from-', '')} 100%)`
              : 'linear-gradient(135deg, hsl(var(--primary-foreground)) 0%, var(--primary) 100%)'
          }}
        />
        
        {/* 装饰性粒子 */}
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            index={particle.id}
            top={particle.top}
            left={particle.left}
            size={particle.size}
            color={particle.color}
            delay={particle.delay}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 标题部分 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-red-500">
              专业技能
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {activeCategory 
              ? `深入了解我的${activeSkillCategory?.name}技能与专长` 
              : "探索我的跨领域专业技能与技术栈"}
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* 技能卡片网格 */}
          <motion.div 
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:col-span-12"
            layout
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 100,
              duration: 0.6
            }}
          >
            {skillCategories.map((category, index) => (
              <SkillCard 
                key={category.name}
                category={category}
                isActive={activeCategory === category.name}
                onClick={() => handleCategoryClick(category)}
                index={index}
                totalCards={skillCategories.length}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* 技能详情弹窗 */}
      <SkillDetailModal 
        skill={selectedSkill} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />

      {/* 分类详情弹窗 */}
      <CategoryDetailModal 
        category={activeSkillCategory || null}
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        onSkillClick={handleSkillClick}
      />
    </motion.div>
  );
};

export default SkillsShowcase; 