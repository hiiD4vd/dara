"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedCatProps {
  isMeowing?: boolean;
  className?: string;
}

export function AnimatedCat({ isMeowing = false, className = "" }: AnimatedCatProps) {
  const [bubbles, setBubbles] = useState<number[]>([]);

  // Generate floating "Meow" bubbles when isMeowing is true
  useEffect(() => {
    if (!isMeowing) return;
    
    const interval = setInterval(() => {
      setBubbles((prev) => [...prev, Date.now()].slice(-3)); // Keep max 3 bubbles
    }, 600);

    return () => clearInterval(interval);
  }, [isMeowing]);

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* Floating Meow Bubbles */}
      <AnimatePresence>
        {isMeowing && bubbles.map((id) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-0 right-0 font-hand text-lg font-bold text-[var(--color-sketch-black)] bg-white/80 px-2 rounded-full sketch-border z-10"
            style={{ pointerEvents: 'none' }}
          >
            Meow!
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        animate={
          isMeowing
            ? { 
                scaleY: [1, 0.9, 1.05, 1], // Squash and stretch
                y: [0, 5, -5, 0], // Bobbing head/body
              }
            : {
                scaleY: [1, 1.02, 1], // Breathing
                y: [0, -2, 0],
              }
        }
        transition={
          isMeowing
            ? { duration: 0.4, repeat: Infinity }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
        className="w-full h-full relative"
      >
        <img 
          src="/assets/kucing.png" 
          alt="Kucing Penjaga"
          className="w-full h-full object-contain drop-shadow-lg"
          style={{ 
            filter: "contrast(1.1) brightness(1.05)"
          }}
        />
      </motion.div>
    </div>
  );
}
