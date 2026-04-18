"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { WatercolorButton } from "../ui/WatercolorButton";
import { Droplet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WateringFlower() {
  const [streak, setStreak] = useState(0);
  const [lastWatered, setLastWatered] = useState<string | null>(null);
  const [isWatering, setIsWatering] = useState(false);
  const [waterDrops, setWaterDrops] = useState<number[]>([]);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    const { data, error } = await supabase.from("flower_streak").select("*").limit(1).single();
    if (!error && data) {
      setStreak(data.streak_count);
      setLastWatered(data.last_watered_date);
    } else if (!data) {
      await supabase.from("flower_streak").insert([{ streak_count: 0 }]);
    }
  };

  const waterFlower = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (lastWatered === today) return;

    setIsWatering(true);
    
    // Create water drop animations
    for (let i = 0; i < 5; i++) {
      setTimeout(() => setWaterDrops((prev) => [...prev, Date.now() + i]), i * 200);
    }

    const newStreak = streak + 1;
    await supabase.from("flower_streak").update({ streak_count: newStreak, last_watered_date: today }).neq("streak_count", -1); 

    setStreak(newStreak);
    setLastWatered(today);

    setTimeout(() => {
      setIsWatering(false);
      setWaterDrops([]);
    }, 2000);
  };

  const today = new Date().toISOString().split("T")[0];
  const canWater = lastWatered !== today;
  const growthScale = Math.min(1 + streak * 0.05, 1.8);

  // Generate petals
  const petals = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30) * (Math.PI / 180);
    petals.push(
      <motion.path
        key={i}
        d="M 50 50 C 60 20, 80 20, 50 5"
        fill="url(#petalGradient)"
        stroke="#4a6b8c"
        strokeWidth="0.5"
        style={{ originX: "50px", originY: "50px" }}
        animate={{ rotate: i * 30 }}
        whileHover={{ scale: 1.1, fill: "url(#petalGradientHover)" }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      <div className="relative w-full aspect-square flex justify-center items-end pb-8">
        <motion.div
          animate={{ scale: growthScale }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-48 h-64 relative"
        >
          <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-md overflow-visible">
            <defs>
              <linearGradient id="stemGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#558055" />
                <stop offset="100%" stopColor="#2d4d2d" />
              </linearGradient>
              <radialGradient id="petalGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#cce0ff" />
                <stop offset="100%" stopColor="#6699cc" />
              </radialGradient>
              <radialGradient id="petalGradientHover" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#e6f0ff" />
                <stop offset="100%" stopColor="#80b3ff" />
              </radialGradient>
              <radialGradient id="centerGradient" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ffe699" />
                <stop offset="100%" stopColor="#cc9900" />
              </radialGradient>
            </defs>

            {/* Stem */}
            <path d="M 50 50 Q 60 100 45 150" fill="none" stroke="url(#stemGradient)" strokeWidth="4" strokeLinecap="round" />
            
            {/* Leaves */}
            <path d="M 55 100 Q 80 90 75 70 Q 60 85 55 100 Z" fill="url(#stemGradient)" />
            <path d="M 47 120 Q 20 110 25 90 Q 40 105 47 120 Z" fill="url(#stemGradient)" />

            {/* Petals */}
            <motion.g
              animate={isWatering ? { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: isWatering ? Infinity : 0 }}
              style={{ originX: "50px", originY: "50px" }}
            >
              {petals}
              {/* Flower Center */}
              <circle cx="50" cy="50" r="12" fill="url(#centerGradient)" stroke="#806000" strokeWidth="1" />
              {/* Center texture dots */}
              <circle cx="47" cy="47" r="1.5" fill="#664d00" />
              <circle cx="53" cy="49" r="1.5" fill="#664d00" />
              <circle cx="50" cy="54" r="1.5" fill="#664d00" />
              <circle cx="45" cy="52" r="1.5" fill="#664d00" />
              <circle cx="54" cy="44" r="1.5" fill="#664d00" />
            </motion.g>
          </svg>
        </motion.div>

        {/* Water Drops Animation */}
        <AnimatePresence>
          {waterDrops.map((id) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: -100, x: (Math.random() - 0.5) * 40 }}
              animate={{ opacity: 1, y: 50 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.6, ease: "easeIn" }}
              className="absolute top-0 text-blue-400 z-10"
            >
              <Droplet className="fill-current" size={24} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-center bg-white/50 sketch-border p-4 w-full backdrop-blur-[2px]">
        <p className="text-2xl mb-4 font-bold text-[var(--color-sketch-black)]">Streak: {streak} hari</p>
        <WatercolorButton 
          color="blue" 
          onClick={waterFlower} 
          disabled={!canWater || isWatering}
          className={`flex items-center justify-center gap-2 w-full ${!canWater ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          <Droplet size={20} />
          {canWater ? "Siram Bunga" : "Sudah Disiram Hari Ini"}
        </WatercolorButton>
      </div>
    </div>
  );
}
