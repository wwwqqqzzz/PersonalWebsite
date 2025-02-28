"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoLink?: string;
  githubLink?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "AI驱动的智能助手",
    description: "基于最新的人工智能技术，开发的智能对话助手系统。整合了GPT-4模型，支持多轮对话和上下文理解。",
    image: "/projects/ai-assistant.jpg",
    tags: ["React", "TypeScript", "OpenAI", "TailwindCSS"],
    demoLink: "https://demo.example.com",
    githubLink: "https://github.com/example/project"
  },
  {
    id: 2,
    title: "3D可视化数据平台",
    description: "使用Three.js开发的3D数据可视化平台，支持实时数据展示和交互式操作。",
    image: "/projects/3d-vis.jpg",
    tags: ["Three.js", "WebGL", "React", "D3.js"],
    demoLink: "https://demo.example.com",
    githubLink: "https://github.com/example/project"
  },
  {
    id: 3,
    title: "区块链DApp",
    description: "基于以太坊开发的去中心化应用，实现智能合约交互和数字资产管理。",
    image: "/projects/blockchain.jpg",
    tags: ["Solidity", "Web3.js", "React", "Ethereum"],
    demoLink: "https://demo.example.com",
    githubLink: "https://github.com/example/project"
  }
];

export default function ProjectsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + projects.length) % projects.length);
  };

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        paginate(1);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isHovered]);

  const currentProject = projects[currentIndex];

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-20" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center">
        <h2 className="text-3xl font-bold mb-2">精选项目</h2>
        <p className="text-foreground/60">探索我的最新作品</p>
      </div>

      <div className="relative h-[600px] overflow-hidden rounded-2xl bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            ref={slideRef}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="relative overflow-hidden rounded-xl group">
                <Image
                  src={currentProject.image}
                  alt={currentProject.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="flex flex-col justify-center">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold mb-4"
                >
                  {currentProject.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-foreground/70 mb-6"
                >
                  {currentProject.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-2 mb-8"
                >
                  {currentProject.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-4"
                >
                  {currentProject.demoLink && (
                    <Link href={currentProject.demoLink} target="_blank" rel="noopener noreferrer">
                      <Button className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        查看演示
                      </Button>
                    </Link>
                  )}
                  {currentProject.githubLink && (
                    <Link href={currentProject.githubLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        源代码
                      </Button>
                    </Link>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors z-10"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors z-10"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-foreground/20'
              }`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

