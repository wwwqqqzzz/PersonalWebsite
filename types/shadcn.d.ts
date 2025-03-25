import 'framer-motion';

declare module "@/components/ui/container-scroll-animation" {
  export const ContainerScroll: React.FC<{
    titleComponent: React.ReactNode;
    children: React.ReactNode;
  }>;
} 