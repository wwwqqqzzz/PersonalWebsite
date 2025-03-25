"use client";

import React, { forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";

// 项目数据
const timelineItems = [
  {
    year: "2023",
    title: "AI驱动的分布式系统监控平台",
    description: "基于Rust和机器学习构建的新一代系统监控平台，能够自动检测异常并进行根因分析。该系统采用高性能架构，单节点处理能力达50万QPS，支持横向扩展。通过对历史数据的智能分析，系统能预测潜在故障并提供修复建议，有效减少了90%的人工干预。",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2034&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1580982330746-bd3d6449320d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1585079542156-2755d9c8a094?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
    ]
  },
  {
    year: "2022",
    title: "企业级低代码平台引擎",
    description: "开发了一套完整的低代码开发平台，支持拖拽式界面设计、自定义组件、工作流引擎和数据集成能力。该平台已经服务于50+企业客户，帮助其IT部门提升了300%的应用开发效率。平台采用微前端架构，支持多团队协作和组件复用，大幅降低了企业应用开发的技术门槛和维护成本。",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80",
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    ]
  },
  {
    year: "2021",
    title: "基于机器学习的智能设计系统",
    description: "构建了一套AI驱动的设计系统，能够根据品牌识别和用户需求自动生成符合设计规范的UI方案。系统整合了大量设计资源和最佳实践，通过深度学习算法分析设计趋势和用户喜好，为设计师提供智能建议和自动化工具。该系统在多个大型项目中应用，平均将设计效率提升了500%。",
    images: [
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80",
      "https://images.unsplash.com/photo-1626544827763-d516dce335e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80"
    ]
  },
  {
    year: "2020",
    title: "大数据实时可视化平台",
    description: "设计并实现了一个高性能的数据可视化平台，支持亿级数据秒级渲染和多维度分析。该平台采用WebGL技术进行图形渲染，结合流式数据处理架构实现了复杂数据集的实时更新和交互式探索。系统已应用于金融、电商、能源等多个领域的数据监控和分析场景，保持60FPS的流畅渲染性能。",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1551503766-ac63dfa6401c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1548407260-da850faa41e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80"
    ]
  },
  {
    year: "2019",
    title: "全栈电子商务解决方案",
    description: "开发了一套完整的电子商务平台，包括响应式前端、微服务后端架构、支付集成和智能推荐系统。该平台采用了前沿的技术栈和最佳实践，支持高并发访问和复杂的业务逻辑。系统上线后成功支持了多次大型促销活动，峰值订单处理能力达5000单/秒，系统可用性达到99.99%。",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1524577915743-0586480f57fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80",
      "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
    ]
  }
];

interface ProjectsTimelineProps {
  className?: string;
}

const ProjectsTimeline = forwardRef<HTMLDivElement, ProjectsTimelineProps>((props, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 格式化数据以传递给Timeline组件
  const timelineData = timelineItems.map(item => ({
    title: item.year,
    content: (
      <div className="space-y-6">
        {/* 项目标题 - 渐变文字效果 */}
        <h3 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">
          {item.title}
        </h3>
        
        {/* 描述文字 - 优化行距与透明度 */}
        <p className="text-foreground/80 text-sm lg:text-base leading-relaxed">
          {item.description}
        </p>
        
        {/* 图片网格 - 交互增强版 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {item.images.map((src, imgIndex) => (
            <motion.div 
              key={`${item.year}-img-${imgIndex}`} 
              className="group relative overflow-hidden rounded-lg aspect-video will-change-transform"
              whileHover={{ 
                scale: 1.05,
                y: -8,
                transition: { 
                  type: "spring", 
                  stiffness: 300 
                }
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: imgIndex * 0.1,
                  duration: 0.5
                }
              }}
              viewport={{ once: true, margin: "-10%" }}
            >
              <Image
                src={src}
                alt={`${item.title} - 图片 ${imgIndex + 1}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
              
              {/* 交互遮罩层 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* 底部发光效果 */}
              <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* 悬停时的微光效果 */}
              <motion.div
                className="absolute inset-0 opacity-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent"
                initial={false}
                whileHover={{
                  opacity: 0.6,
                  backgroundPosition: ["0% 0%", "100% 100%"],
                  transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    )
  }));

  return (
    <div
      ref={ref}
      id="projects"
      className={`w-full bg-background/60 backdrop-blur-sm ${props.className || ''}`}
    >
      <div ref={sectionRef} className="py-12 md:py-20">
        <Timeline data={timelineData} />
      </div>
    </div>
  );
});

ProjectsTimeline.displayName = "ProjectsTimeline";

export default ProjectsTimeline; 


