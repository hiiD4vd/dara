"use client";

import React, { useState } from "react";
import { WatercolorButton } from "../ui/WatercolorButton";
import { SketchContainer } from "../ui/SketchContainer";
import { Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    q: "Orang berjalan di atas air biasanya?",
    a: "MENGKHAYAL",
    hint: "Gak mungkin beneran jalan",
    explanation: "Ya kan orang biasa gak bisa jalan di air, makanya dia mengkhayal.",
  },
  {
    q: "Benda yang kalau ditutup kelihatan, kalau dibuka malah gak kelihatan?",
    a: "PINTUKERETA",
    hint: "Aduh susah jelasinnya",
    explanation: "Pintu kereta kalau ditutup keretanya kelihatan jalan, kalau dibuka keretanya berhenti jadi yang kelihatan dalemnya.",
  },
  {
    q: "Hewan apa yang bersaudara?",
    a: "KATAKBERADIK",
    hint: "Katak",
    explanation: "Katak beradik (Kakak beradik). Gitu deh pokoknya.",
  }
];

export function AbsurdCrossword() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentQ = questions[currentIdx];
  const [inputs, setInputs] = useState<string[]>(Array(currentQ.a.length).fill(""));
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleInput = (index: number, val: string) => {
    const newInputs = [...inputs];
    newInputs[index] = val.toUpperCase().slice(-1); // Only keep last typed char
    setInputs(newInputs);

    // Auto focus next
    if (val && index < currentQ.a.length - 1) {
      const nextInput = document.getElementById(`tts-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const checkAnswer = () => {
    const answer = inputs.join("");
    if (answer === currentQ.a) {
      setIsCorrect(true);
    } else {
      alert("Salah! Coba pikir lagi yang absurd.");
    }
  };

  const nextQuestion = () => {
    const nextIdx = (currentIdx + 1) % questions.length;
    setCurrentIdx(nextIdx);
    setInputs(Array(questions[nextIdx].a.length).fill(""));
    setShowHint(false);
    setIsCorrect(false);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-8">
      <SketchContainer className="w-full bg-[var(--color-watercolor-blue)]/20 transform -rotate-1">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold">Soal #{currentIdx + 1}</h2>
          <WatercolorButton 
            color="yellow" 
            className="px-4 py-1 text-sm flex items-center gap-2"
            onClick={() => setShowHint(true)}
          >
            <Lightbulb size={16} /> Bantuan
          </WatercolorButton>
        </div>
        
        <p className="text-2xl mb-8 leading-relaxed font-hand">{currentQ.q}</p>

        {showHint && (
          <p className="text-xl text-gray-600 mb-8 italic">Clue: {currentQ.hint}</p>
        )}

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {Array.from({ length: currentQ.a.length }).map((_, i) => (
            <input
              key={i}
              id={`tts-input-${i}`}
              type="text"
              value={inputs[i]}
              onChange={(e) => handleInput(i, e.target.value)}
              disabled={isCorrect}
              className="w-12 h-14 sketch-border text-center text-2xl font-bold bg-white/80 focus:bg-white focus:outline-none uppercase"
            />
          ))}
        </div>

        {!isCorrect ? (
          <div className="flex justify-center">
            <WatercolorButton color="pink" onClick={checkAnswer}>
              Cek Jawaban
            </WatercolorButton>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 sketch-border bg-[var(--color-watercolor-green)]/30 text-center transform rotate-1"
            >
              <h3 className="text-3xl font-bold text-green-700 mb-2">BENAAAR! 🎉</h3>
              <p className="text-xl mb-6">{currentQ.explanation}</p>
              <WatercolorButton color="blue" onClick={nextQuestion}>
                Lanjut Soal
              </WatercolorButton>
            </motion.div>
          </AnimatePresence>
        )}
      </SketchContainer>
    </div>
  );
}
