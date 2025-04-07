"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence, 
  useInView, 
  useAnimation,
  useScroll,
  useTransform
} from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Code, 
  PanelRight, 
  Bot, 
  Layers,
  X,
  Zap,
  LineChart
} from "lucide-react";

// ===== 数据模型 =====
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

// 技能分类数据
const skillCategories: SkillCategory[] = [
  {
    name: "前端开发",
    description: "构建现代化、响应式、高性能的用户界面和Web应用",
    icon: <Code size={20} />,
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
    icon: <PanelRight size={20} />,
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
    icon: <Layers size={20} />,
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
    icon: <Zap size={20} />,
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
    icon: <Bot size={20} />,
    color: "from-pink-500 to-rose-500",
    items: [
      { name: "LLM集成", level: 83, description: "集成大型语言模型到应用中，增强交互功能" },
      { name: "AI辅助开发", level: 87, description: "使用AI工具加速代码生成、调试和优化" },
      { name: "数据分析", level: 85, description: "运用机器学习分析用户数据，得出有价值的结论" },
      { name: "聊天机器人", level: 82, description: "设计和实现智能客服和AI助手" },
      { name: "实时语音处理", level: 80, description: "实现语音识别和处理功能" },
      { name: "生成式AI应用", level: 84, description: "开发利用生成式AI创建内容的应用" }
    ]
  },
  {
    name: "数据可视化",
    description: "将复杂数据转化为直观、易理解的视觉呈现",
    icon: <LineChart size={20} />,
    color: "from-cyan-500 to-blue-500",
    items: [
      { name: "D3.js", level: 85, description: "使用D3.js创建动态、交互式数据可视化" },
      { name: "图表库", level: 88, description: "熟练使用Chart.js、Recharts等图表库" },
      { name: "地理数据", level: 82, description: "处理和可视化地理空间数据和地图" },
      { name: "大数据可视化", level: 80, description: "展示和分析大规模数据集" },
      { name: "实时数据", level: 84, description: "构建实时更新的数据仪表板" },
      { name: "交互式仪表板", level: 86, description: "设计用户可交互的数据分析界面" }
    ]
  }
];

// 获取技能首字母
const getSkillInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
}

// ===== 组件实现 =====
const SkillCard = ({ 
  category, 
  isActive, 
  onClick
}: {
  category: SkillCategory;
  isActive: boolean;
  onClick: () => void;
}) => {
  // 提取颜色
  const getColorClass = () => {
    const colors = category.color.split(' ');
    return colors[0].replace('from-', '');
  };
  
  const colorClass = getColorClass();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -6,
        transition: { type: "spring", stiffness: 300, damping: 15 }
      }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg cursor-pointer
        border border-gray-200/10 dark:border-gray-800/40
        ${isActive 
          ? `bg-gradient-to-br ${category.color}/10 dark:${category.color}/5` 
          : 'bg-white/5 dark:bg-gray-900/40 hover:bg-gradient-to-br hover:${category.color}/10 dark:hover:${category.color}/5'
        }
        backdrop-blur-sm
        transition-all duration-300
        group
      `}
    >
      <div className="p-6">
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-full mb-4
          bg-${colorClass}/10 text-${colorClass} 
          group-hover:bg-${colorClass}/20 group-hover:text-${colorClass}
          transform transition-all duration-300 group-hover:scale-110
        `}>
          {category.icon}
        </div>
        
        <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 group-hover:text-${colorClass}`}>{category.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {category.description}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {category.items.length} 项技能
          </span>
          
          <div className={`
            text-xs px-2 py-1 rounded transition-all duration-300
            ${isActive 
              ? `bg-${colorClass}/20 text-${colorClass}` 
              : `bg-gray-100/10 text-gray-400 group-hover:bg-${colorClass}/20 group-hover:text-${colorClass}`
            }
          `}>
            {isActive ? '已选择' : '查看详情'}
          </div>
        </div>
      </div>
      
      {/* 悬浮时的边框发光效果 */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 border-2 border-${colorClass} rounded-lg`} style={{boxShadow: `0 0 15px rgba(var(--${colorClass}-rgb), 0.3)`}}></div>
    </motion.div>
  );
};

// 技能等级组件
const SkillLevel = ({ level }: { level: number }) => {
  const labels = {
    90: '专家',
    80: '熟练',
    70: '中级',
    60: '入门'
  };
  
  const getNearestLabel = () => {
    const thresholds = Object.keys(labels).map(Number);
    const closest = thresholds.reduce((prev, curr) => 
      Math.abs(curr - level) < Math.abs(prev - level) ? curr : prev
    );
    return labels[closest as keyof typeof labels];
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>{level}%</span>
        <span>{getNearestLabel()}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// 技能详情模态窗口
const SkillDetailModal = ({ 
  skill, 
  isOpen, 
  onClose,
  onBack
}: { 
  skill: SkillItem | null; 
  isOpen: boolean; 
  onClose: () => void;
  onBack: () => void;
}) => {
  if (!skill || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 pointer-events-auto">
              <div className="flex justify-between items-center mb-4">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X size={20} />
                </button>
              </div>
              
              <h3 className="text-xl font-medium mb-4">{skill.name}</h3>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">熟练度</h4>
                <SkillLevel level={skill.level} />
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">描述</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {skill.description}
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-medium text-gray-500 mb-3">技能特点</h4>
                <div className="grid grid-cols-2 gap-3">
                  {["专业应用", "持续学习", "实践经验", "解决问题"].map((trait) => (
                    <div key={trait} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Star size={12} className="text-blue-500" />
                      <span>{trait}</span>
                    </div>
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

// 分类详情模态窗口
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
  
  // 提取颜色
  const getColorClass = () => {
    const colors = category.color.split(' ');
    return colors[0].replace('from-', '');
  };
  
  const colorClass = getColorClass();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto pointer-events-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${colorClass}/20 text-${colorClass}`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-medium">{category.name}</h3>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {category.description}
              </p>
              
              <h4 className="text-sm font-medium text-gray-500 mb-3">相关技能</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {category.items.map((skill) => (
                  <motion.button
                    key={skill.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSkillClick(skill)}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-left hover:shadow-sm transition-all"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500">
                      {getSkillInitial(skill.name)}
                    </div>
                    <div>
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-xs text-gray-500">{skill.level}% 熟练度</div>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-gray-400" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// 主组件
const SkillsShowcase = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 视差滚动效果
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const sectionOpacity = useTransform(scrollYProgress, 
    [0, 0.1, 0.9, 1], 
    [0, 1, 1, 0]
  );
  
  // 检测是否在视图中
  const isInView = useInView(containerRef, { 
    once: false, 
    amount: 0.2
  });
  
  // 分类点击处理
  const handleCategoryClick = (category: SkillCategory) => {
    setActiveCategory(category.name);
    setIsCategoryModalOpen(true);
  };

  // 技能点击处理
  const handleSkillClick = (skill: SkillItem) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
    setIsCategoryModalOpen(false);
  };

  // 返回分类详情
  const handleBackToCategory = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setIsCategoryModalOpen(true);
    }, 200);
  };

  // 关闭技能详情模态窗口
  const closeSkillModal = () => {
    setIsModalOpen(false);
  };

  // 关闭分类详情模态窗口
  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  // 当前活动分类
  const activeSkillCategory = skillCategories.find(c => c.name === activeCategory);

  return (
    <motion.div 
      ref={containerRef}
      className="py-20 bg-gray-50 dark:bg-gray-900/30"
      style={{ opacity: sectionOpacity }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              专业技能
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              多年经验积累的全栈技术栈和专业能力
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category) => (
            <SkillCard 
              key={category.name}
              category={category}
              isActive={activeCategory === category.name}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </div>

      {/* 模态窗口 */}
      <SkillDetailModal 
        skill={selectedSkill} 
        isOpen={isModalOpen} 
        onClose={closeSkillModal}
        onBack={handleBackToCategory}
      />

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