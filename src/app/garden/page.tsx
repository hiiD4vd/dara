"use client";

import { useState } from "react";
import { SketchContainer } from "@/components/ui/SketchContainer";
import { WhisperingTree } from "@/components/features/WhisperingTree";
import { WateringFlower } from "@/components/features/WateringFlower";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Garden() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? 1 : 0));

  return (
    <main 
      className="relative flex min-h-screen flex-col items-center p-4 md:p-8 pb-32 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/assets/taman.jpeg')" }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />

      <div className="relative z-10 w-full flex flex-col items-center mt-4 md:mt-0 h-full flex-grow">
        <SketchContainer className="max-w-4xl w-full text-center transform md:-rotate-1 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-[var(--color-sketch-black)]">
            Taman Belakang
          </h1>
          <p className="text-xl md:text-2xl text-gray-800">
            {currentSlide === 0 
              ? "Tinggalkan pesan di dahan Pohon Surat. 🌳" 
              : "Siram Bunga Biru kita agar terus tumbuh. 💧"}
          </p>
        </SketchContainer>

        <div className="relative w-full max-w-lg md:max-w-4xl flex items-center justify-center flex-grow">
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 md:-left-12 z-20 p-2 bg-white/70 rounded-full sketch-border hover:scale-110 transition-transform"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="w-full h-full flex justify-center items-center min-h-[500px]">
            <AnimatePresence mode="wait">
              {currentSlide === 0 ? (
                <motion.div
                  key="tree"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-full flex justify-center"
                >
                  <WhisperingTree />
                </motion.div>
              ) : (
                <motion.div
                  key="flower"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-full flex justify-center"
                >
                  <WateringFlower />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={nextSlide}
            className="absolute right-0 md:-right-12 z-20 p-2 bg-white/70 rounded-full sketch-border hover:scale-110 transition-transform"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex gap-4 mt-8">
          <div className={`w-3 h-3 rounded-full transition-colors ${currentSlide === 0 ? 'bg-[var(--color-sketch-black)]' : 'bg-gray-400'}`} />
          <div className={`w-3 h-3 rounded-full transition-colors ${currentSlide === 1 ? 'bg-[var(--color-sketch-black)]' : 'bg-gray-400'}`} />
        </div>
      </div>
    </main>
  );
}
