import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "container px-4 md:px-6 mx-auto max-w-7xl w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 