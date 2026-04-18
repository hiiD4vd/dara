import React from "react";
import { cn } from "@/lib/utils";

interface SketchContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SketchContainer({
  children,
  className,
  ...props
}: SketchContainerProps) {
  return (
    <div
      className={cn(
        "sketch-border bg-white/80 backdrop-blur-sm p-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
