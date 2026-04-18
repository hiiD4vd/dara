import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface WatercolorButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  color?: "blue" | "yellow" | "green" | "pink";
}

const colorMap = {
  blue: "bg-[var(--color-watercolor-blue)]",
  yellow: "bg-[var(--color-watercolor-yellow)]",
  green: "bg-[var(--color-watercolor-green)]",
  pink: "bg-[var(--color-watercolor-pink)]",
};

export function WatercolorButton({
  children,
  className,
  color = "blue",
  ...props
}: WatercolorButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: -2 }}
      whileTap={{ scale: 0.95, rotate: 2 }}
      className={cn(
        "sketch-border px-6 py-2 text-xl font-semibold shadow-sm transition-colors",
        colorMap[color],
        "hover:opacity-90",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
