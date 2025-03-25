import { TimelineDemo } from "@/components/blocks/timeline-demo";
import { Container } from "@/components/ui/container";

export default function TimelinePage() {
  return (
    <main className="flex flex-col items-center justify-between w-full min-h-screen">
      <Container className="mt-12 mb-24">
        <div className="flex flex-col items-start mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            项目历程
          </h1>
          <p className="text-muted-foreground mt-4 max-w-[85%] md:max-w-[65%]">
            我的技术探索与工程实践之旅，多年来专注于构建高性能系统和优质用户体验
          </p>
        </div>
        
        <div className="h-[20px]" />
        
        <div className="w-full pb-32">
          <TimelineDemo />
        </div>
      </Container>
    </main>
  );
} 