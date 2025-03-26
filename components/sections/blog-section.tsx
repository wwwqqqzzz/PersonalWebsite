"use client"

import React, { useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, type MotionValue, useAnimation, usePresence, AnimatePresence, MotionStyle } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

type BlogPost = {
  id: number
  title: string
  excerpt: string
  link: string
  thumbnail: string
  date: string
  readTime: string
  category: string
}

export const BlogParallax = ({
  posts,
}: {
  posts: BlogPost[]
}) => {
  const firstRow = posts.slice(0, 5)
  const secondRow = posts.slice(5, 10)
  const thirdRow = posts.slice(10, 15)
  const ref = React.useRef(null)
  const backgroundRef = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // 优化spring配置，降低阻尼和增加速度，提供更流畅的动画效果 - 120帧感觉
  const springConfig = { 
    stiffness: 600,   // 更高的刚度 - 更快反应
    damping: 15,      // 更低的阻尼 - 更流畅的过渡
    bounce: 0,        // 去除弹跳效果
    restDelta: 0.0005, // 非常精确的动画终点
    restSpeed: 0.005   // 更细腻的动画结束控制
  }

  // 创建动画控制器
  const controls1 = useAnimation()
  const controls2 = useAnimation()
  const controls3 = useAnimation()
  const bgControls = useAnimation()
  
  // 追踪滚动进度是否到达底部
  const [hasReachedEnd, setHasReachedEnd] = React.useState(false)
  const [autoplayActive, setAutoplayActive] = React.useState(true)
  // 添加错误跟踪状态，用于回退到CSS动画
  const [useFramerMotion, setUseFramerMotion] = React.useState(true)
  
  // 基于滚动位置的变换效果 - 增大移动距离
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1800]), springConfig)
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1800]), springConfig)
  
  // 修改旋转和透明度动画，使其更快地完成
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.12], [15, 0]), springConfig)
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.12], [0.2, 1]), springConfig)
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.12], [20, 0]), springConfig)
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.12], [-700, 200]), springConfig) // 更往下放置

  // 创建三倍长度的博客文章数组，用于实现无缝轮播
  const extendedFirstRow = [...firstRow, ...firstRow, ...firstRow, ...firstRow, ...firstRow, ...firstRow]
  const extendedSecondRow = [...secondRow, ...secondRow, ...secondRow, ...secondRow, ...secondRow, ...secondRow]
  const extendedThirdRow = [...thirdRow, ...thirdRow, ...thirdRow, ...thirdRow, ...thirdRow, ...thirdRow]

  // 自动循环播放背景
  useEffect(() => {
    const startBackgroundAnimation = () => {
      bgControls.start({
        x: [0, -1000],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear"
        }
      });
    };
    
    startBackgroundAnimation();
  }, [bgControls]);

  // 错误处理函数 - 在Framer Motion失败时回退到CSS
  const handleAnimationError = React.useCallback(() => {
    console.warn("Framer Motion动画失败，回退到CSS动画");
    setUseFramerMotion(false);
  }, []);

  // 自动轮播功能 - 无缝循环
  useEffect(() => {
    // 如果回退到CSS动画，则不执行Framer Motion的动画
    if (!useFramerMotion) return;
    
    try {
      const fullWidth = extendedFirstRow.length * 510; // 每个卡片的宽度加间距
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const safeOffset = viewportWidth * 2; // 额外的安全偏移量
      
      controls1.start({
        x: ["0%", `-${fullWidth - safeOffset}px`],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 120,  // 增加持续时间，使动画更慢更平滑
          ease: "linear",
          repeatDelay: 0
        }
      });
    } catch (error) {
      handleAnimationError();
    }
  }, [controls1, useFramerMotion, extendedFirstRow.length, handleAnimationError]);

  useEffect(() => {
    // 如果回退到CSS动画，则不执行Framer Motion的动画
    if (!useFramerMotion) return;
    
    try {
      const fullWidth = extendedSecondRow.length * 510;
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const safeOffset = viewportWidth * 2;
      
      controls2.start({
        x: ["-100%", `${fullWidth / 3}px`], // 给予更大的终点偏移
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 135,  // 更慢的速度创造差异感
          ease: "linear",
          repeatDelay: 0
        }
      });
    } catch (error) {
      handleAnimationError();
    }
  }, [controls2, useFramerMotion, extendedSecondRow.length, handleAnimationError]);

  useEffect(() => {
    // 如果回退到CSS动画，则不执行Framer Motion的动画
    if (!useFramerMotion) return;
    
    try {
      const fullWidth = extendedThirdRow.length * 510;
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const safeOffset = viewportWidth * 2;
      
      controls3.start({
        x: ["0%", `-${fullWidth - safeOffset}px`],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 150,  // 最慢的一行，增强层次感
          ease: "linear",
          repeatDelay: 0
        }
      });
    } catch (error) {
      handleAnimationError();
    }
  }, [controls3, useFramerMotion, extendedThirdRow.length, handleAnimationError]);

  // 在滚动到底部时可能会想要调整轮播速度或行为
  useEffect(() => {
    if (!useFramerMotion) return;
    
    const unsubscribe = scrollYProgress.onChange((value: number) => {
      if (value >= 0.95 && !hasReachedEnd) {
        setHasReachedEnd(true);
        // 滚动到底部时，可以选择加快轮播速度
        controls1.stop();
        controls2.stop();
        controls3.stop();
        
        // 计算动画宽度 - 与上方相同逻辑但速度更快
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
        const fullWidth1 = extendedFirstRow.length * 510;
        const fullWidth2 = extendedSecondRow.length * 510;
        const fullWidth3 = extendedThirdRow.length * 510;
        const safeOffset = viewportWidth * 2;
        
        controls1.start({
          x: ["0%", `-${fullWidth1 - safeOffset}px`],
          transition: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 80,  // 加快速度但仍保持平滑
            ease: "linear",
            repeatDelay: 0
          }
        });
        
        controls2.start({
          x: ["-100%", `${fullWidth2 / 3}px`],
          transition: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 90,  // 加快速度但仍保持平滑
            ease: "linear",
            repeatDelay: 0
          }
        });
        
        controls3.start({
          x: ["0%", `-${fullWidth3 - safeOffset}px`],
          transition: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 100,  // 加快速度但仍保持平滑
            ease: "linear",
            repeatDelay: 0
          }
        });
      }
    });
    
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [controls1, controls2, controls3, scrollYProgress, hasReachedEnd, useFramerMotion, extendedFirstRow.length, extendedSecondRow.length, extendedThirdRow.length]);

  return (
    <div
      ref={ref}
      id="blog"
      className="h-[160vh] py-60 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      {/* 自动循环播放的背景 */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-60">
        <motion.div 
          ref={backgroundRef}
          className="absolute inset-0 w-[200%] h-full"
          animate={bgControls}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mb-20">
        <BlogHeader />
      </div>
      
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="blog-parallax-container transform-3d-fix relative z-10 py-10"
      >
        {/* 第一行：自动向左滚动 - 无缝轮播 */}
        <div className="mb-36 overflow-hidden carousel-container"> 
          <motion.div 
            className={`flex space-x-16 high-performance-animation carousel-track left smooth will-change-transform ${!useFramerMotion ? 'css-fallback' : ''}`}
            animate={useFramerMotion ? controls1 : undefined}
            initial={useFramerMotion ? { x: "0%" } : undefined}
            style={{ 
              width: `${extendedFirstRow.length * 510}px`,
              transform: "translate3d(0, 0, 0)" // 启用GPU加速
            }}
            onAnimationComplete={() => {/* 循环动画回调 */}}
            onError={handleAnimationError} // 处理动画错误
          >
            {extendedFirstRow.map((post, index) => (
              <BlogCard 
                post={post} 
                key={`${post.id}-${index}`}
                className="carousel-item" 
              />
            ))}
          </motion.div>
        </div>
        
        {/* 第二行：自动向右滚动 - 无缝轮播 */}
        <div className="mb-36 overflow-hidden carousel-container"> 
          <motion.div 
            className={`flex space-x-16 high-performance-animation carousel-track right smooth will-change-transform ${!useFramerMotion ? 'css-fallback' : ''}`}
            animate={useFramerMotion ? controls2 : undefined}
            initial={useFramerMotion ? { x: "-100%" } : undefined}
            style={{ 
              width: `${extendedSecondRow.length * 510}px`,
              transform: "translate3d(0, 0, 0)" // 启用GPU加速
            }}
            onAnimationComplete={() => {/* 循环动画回调 */}}
            onError={handleAnimationError} // 处理动画错误
          >
            {extendedSecondRow.map((post, index) => (
              <BlogCard 
                post={post} 
                key={`${post.id}-${index}`}
                className="carousel-item" 
              />
            ))}
          </motion.div>
        </div>
        
        {/* 第三行：自动向左滚动 - 无缝轮播 */}
        <div className="overflow-hidden carousel-container">
          <motion.div 
            className={`flex space-x-16 high-performance-animation carousel-track left smooth will-change-transform ${!useFramerMotion ? 'css-fallback' : ''}`}
            animate={useFramerMotion ? controls3 : undefined}
            initial={useFramerMotion ? { x: "0%" } : undefined}
            style={{ 
              width: `${extendedThirdRow.length * 510}px`,
              transform: "translate3d(0, 0, 0)" // 启用GPU加速
            }}
            onAnimationComplete={() => {/* 循环动画回调 */}}
            onError={handleAnimationError} // 处理动画错误
          >
            {extendedThirdRow.map((post, index) => (
              <BlogCard 
                post={post} 
                key={`${post.id}-${index}`}
                className="carousel-item" 
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
      
      {/* 底部间距 */}
      <div className="h-40"></div>
    </div>
  )
}

export const BlogHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="max-w-7xl relative mx-auto px-4 w-full"
    >
      <div className="text-center">
        <motion.h1 
          className="text-2xl md:text-7xl font-bold dark:text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          探索 
        </motion.h1>
        <motion.h1 
          className="text-3xl md:text-8xl font-bold mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 drop-shadow-sm text-gradient-animate">
            设计与技术的边界
          </span>
        </motion.h1>
        <motion.p 
          className="max-w-2xl text-base md:text-xl mx-auto text-foreground/80 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          分享我对设计、开发和创意领域的思考与洞察，探索技术与艺术交汇处的无限可能。
        </motion.p>
      </div>
    </motion.div>
  )
}

// 生成BlogCard组件的正确props类型
interface BlogCardProps {
  post: BlogPost;
  translate?: MotionValue<number>; // 使用可选类型
  className?: string;
}

// 修改BlogCard组件接收正确的props类型
export const BlogCard = ({ post, translate, className }: BlogCardProps) => {
  // 使用动态style对象创建，这样即使translate不存在也不会报错
  const style: MotionStyle = {};
  if (translate) {
    style.x = translate;
  }
  
  return (
    <motion.div
      style={style}
      whileHover={{
        y: -15,
        scale: 1.03,
        transition: { 
          duration: 0.4, 
          ease: [0.25, 0.1, 0.25, 1.0],
          scale: { 
            duration: 0.2, 
            ease: [0.34, 1.56, 0.64, 1] 
          }
        }
      }}
      key={post.id}
      className={`group/blog h-96 w-[30rem] relative flex-shrink-0 gpu-accelerated blog-card-border-glow ${className || ''}`}
    >
      <Link href={post.link} className="block group-hover/blog:shadow-2xl h-full">
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          <Image
            src={post.thumbnail}
            height="600"
            width="600"
            className="object-cover object-center absolute h-full w-full inset-0 transform img-hover-animation"
            alt={post.title}
            priority={post.id <= 5} // 优先加载前5张图片
          />
          
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-70 group-hover/blog:opacity-90 transition-opacity duration-200"></div>
          
          {/* 文章信息 */}
          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover/blog:translate-y-0 transition-transform duration-200">
            <div className="flex items-center gap-3 mb-3 text-xs text-white/80">
              <span className="px-2 py-1 rounded-full bg-primary/50 text-white">
                {post.category}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {post.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </div>
            </div>
            
            <h2 className="text-lg font-medium text-white group-hover/blog:text-primary/90 transition-colors duration-200">
              {post.title}
            </h2>
            
            <p className="mt-2 text-sm text-white/70 line-clamp-2 opacity-0 group-hover/blog:opacity-100 transition-opacity duration-200">
              {post.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// 博客文章数据
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "设计系统如何提高团队效率",
    excerpt: "探讨设计系统如何帮助团队提高工作效率，保持设计一致性，并加速产品开发流程。",
    date: "2023-10-15",
    readTime: "5 分钟",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80",
    category: "设计",
    link: "/blog/1",
  },
  {
    id: 2,
    title: "用户体验设计的未来趋势",
    excerpt: "分析当前UX设计领域的创新趋势，探讨AI、VR等新技术对用户体验的影响。",
    date: "2023-09-28",
    readTime: "7 分钟",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2034&q=80",
    category: "技术",
    link: "/blog/2",
  },
  {
    id: 3,
    title: "如何进行有效的用户研究",
    excerpt: "分享进行用户研究的实用技巧和方法，帮助设计师更好地理解用户需求。",
    date: "2023-09-10",
    readTime: "6 分钟",
    thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "研究",
    link: "/blog/3",
  },
  {
    id: 4,
    title: "移动应用设计的最佳实践",
    excerpt: "总结移动应用设计的关键原则和最佳实践，帮助设计师创造出色的移动体验。",
    date: "2023-08-22",
    readTime: "8 分钟",
    thumbnail: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "设计",
    link: "/blog/4",
  },
  {
    id: 5,
    title: "Web性能优化策略",
    excerpt: "详解提升网站性能的关键策略，从加载时间到渲染优化的全面指南。",
    date: "2023-08-10",
    readTime: "10 分钟",
    thumbnail: "https://images.unsplash.com/photo-1551503766-ac63dfa6401c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "开发",
    link: "/blog/5",
  },
  {
    id: 6,
    title: "色彩心理学在UI设计中的应用",
    excerpt: "探索色彩如何影响用户情绪和行为，以及如何在设计中有效运用色彩心理学。",
    date: "2023-07-28",
    readTime: "6 分钟",
    thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "设计",
    link: "/blog/6",
  },
  {
    id: 7,
    title: "构建可扩展的前端架构",
    excerpt: "分享构建灵活、可维护和可扩展的前端架构的关键原则和最佳实践。",
    date: "2023-07-15",
    readTime: "9 分钟",
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "开发",
    link: "/blog/7",
  },
  {
    id: 8,
    title: "设计思维与产品创新",
    excerpt: "如何通过设计思维方法论推动产品创新，从用户需求出发创造卓越体验。",
    date: "2023-06-30",
    readTime: "7 分钟",
    thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80",
    category: "产品",
    link: "/blog/8",
  },
  {
    id: 9,
    title: "数据可视化设计原则",
    excerpt: "探讨有效数据可视化的核心原则，如何将复杂数据转化为直观易懂的视觉呈现。",
    date: "2023-06-15",
    readTime: "8 分钟",
    thumbnail: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "数据",
    link: "/blog/9",
  },
  {
    id: 10,
    title: "微交互设计的艺术",
    excerpt: "详解微交互如何提升用户体验，以及如何设计令人愉悦的细节交互。",
    date: "2023-05-28",
    readTime: "6 分钟",
    thumbnail: "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "交互",
    link: "/blog/10",
  },
  {
    id: 11,
    title: "可访问性设计指南",
    excerpt: "全面介绍Web可访问性设计的原则和实践，帮助创建人人可用的数字产品。",
    date: "2023-05-15",
    readTime: "10 分钟",
    thumbnail: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80",
    category: "设计",
    link: "/blog/11",
  },
  {
    id: 12,
    title: "WebGL创意编程入门",
    excerpt: "介绍WebGL基础知识和创意编程技巧，开启3D网页图形设计之旅。",
    date: "2023-04-30",
    readTime: "12 分钟",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "创意编程",
    link: "/blog/12",
  },
  {
    id: 13,
    title: "设计系统组件库构建策略",
    excerpt: "分享构建一致性强、可复用性高的设计系统组件库的方法和策略。",
    date: "2023-04-15",
    readTime: "9 分钟",
    thumbnail: "https://images.unsplash.com/photo-1548407260-da850faa41e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80",
    category: "系统设计",
    link: "/blog/13",
  },
  {
    id: 14,
    title: "情感化设计实践指南",
    excerpt: "探讨如何通过设计唤起用户情感共鸣，创造难忘的数字体验。",
    date: "2023-03-28",
    readTime: "7 分钟",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80",
    category: "情感设计",
    link: "/blog/14",
  },
  {
    id: 15,
    title: "设计师的AI工具箱",
    excerpt: "盘点当下最实用的AI辅助设计工具，提升设计效率与创造力。",
    date: "2023-03-15",
    readTime: "8 分钟",
    thumbnail: "https://images.unsplash.com/photo-1524577915743-0586480f57fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80",
    category: "工具",
    link: "/blog/15",
  },
];

// 默认导出博客组件示例
export default function BlogSection() {
  return <BlogParallax posts={blogPosts} />
}

