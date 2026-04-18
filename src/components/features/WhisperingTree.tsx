"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Modal } from "../ui/Modal";
import { WatercolorButton } from "../ui/WatercolorButton";
import { PenLine } from "lucide-react";
import { motion } from "framer-motion";

interface TreeMessage {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

export function WhisperingTree() {
  const [messages, setMessages] = useState<TreeMessage[]>([]);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("Rara");
  const [selectedMessage, setSelectedMessage] = useState<TreeMessage | null>(null);

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel("tree_messages_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tree_messages" }, () => fetchMessages())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase.from("tree_messages").select("*").order("created_at", { ascending: false });
    if (!error && data) setMessages(data);
  };

  const submitMessage = async () => {
    if (!newContent.trim()) return;
    await supabase.from("tree_messages").insert([{ content: newContent, author: newAuthor }]);
    setNewContent("");
    setIsWriteModalOpen(false);
  };

  const deleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter(m => m.id !== id));
    await supabase.from("tree_messages").delete().eq("id", id);
    setSelectedMessage(null);
  };

  // Generate note positions using percentages for responsive layout
  const notePositions = useMemo(() => {
    const nPos: {top: number, left: number, color: string, rotate: number}[] = [];
    const colors = ["#fef08a", "#fde047", "#fef9c3", "#e9d5ff"]; // yellow and purple sticky notes
    
    // Generate deterministic positions
    for (let i = 0; i < 100; i++) {
      nPos.push({
        top: 10 + (Math.sin(i * 13) * 30 + 30), // 10% to 70%
        left: 20 + (Math.cos(i * 17) * 35 + 35), // 20% to 90%
        color: colors[i % colors.length],
        rotate: (Math.random() - 0.5) * 20
      });
    }
    return nPos;
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-xl relative">
      <div className="relative w-full mb-8 flex justify-center items-center rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Animated Tree GIF */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/assets/Природа(флора).gif" 
          alt="Whispering Tree" 
          className="w-full h-auto object-contain"
        />

        {/* Overlay HTML divs for interactive notes */}
        <div className="absolute inset-0 z-10">
          {messages.map((msg, i) => {
            const pos = notePositions[i % notePositions.length];
            return (
              <motion.div
                key={msg.id}
                className="absolute flex items-center justify-center cursor-pointer shadow-md rounded-sm"
                style={{ 
                  top: `${pos.top}%`, 
                  left: `${pos.left}%`,
                  backgroundColor: pos.color,
                  width: '40px',
                  height: '45px',
                  transformOrigin: 'top center'
                }}
                initial={{ scale: 0, y: -20 }}
                animate={{ 
                  scale: 1, 
                  y: 0,
                  rotate: [pos.rotate - 3, pos.rotate + 3, pos.rotate - 3]
                }}
                transition={{
                  scale: { type: "spring", bounce: 0.5 },
                  rotate: { duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: (i % 2) }
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent slider from consuming click
                  setSelectedMessage(msg);
                }}
                whileHover={{ scale: 1.2, zIndex: 50, rotate: 0 }}
              >
                {/* Pin at the top */}
                <div className="absolute -top-1 w-2 h-2 rounded-full bg-red-400 shadow-sm" />
                {/* Scribble detail */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 opacity-60 mt-1">
                  <path d="M4 6c3 0 4-2 7-2s4 2 7 2" />
                  <path d="M4 12c3 0 4-2 7-2s4 2 7 2" />
                  <path d="M4 18c3 0 4-2 7-2s4 2 7 2" />
                </svg>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-4 md:bottom-8 z-20">
        <WatercolorButton color="yellow" onClick={() => setIsWriteModalOpen(true)} className="flex items-center gap-2 shadow-xl hover:scale-110">
          <PenLine size={24} /> Gantung Surat
        </WatercolorButton>
      </div>

      {/* Write Note Modal */}
      <Modal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)} title="Tulis Surat">
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            value={newAuthor} 
            onChange={(e) => setNewAuthor(e.target.value)} 
            placeholder="Nama..."
            className="sketch-border px-4 py-2 bg-transparent text-xl font-hand w-full md:w-1/2"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Tulis pesanmu di sini..."
            className="sketch-border p-4 bg-transparent min-h-[150px] text-xl font-hand resize-none"
          />
          <WatercolorButton color="green" onClick={submitMessage} className="self-end">
            Simpan
          </WatercolorButton>
        </div>
      </Modal>

      {/* Read Note Modal */}
      <Modal isOpen={!!selectedMessage} onClose={() => setSelectedMessage(null)}>
        {selectedMessage && (
          <div className="flex flex-col items-center text-center p-4 relative">
            <button 
              onClick={() => deleteMessage(selectedMessage.id)}
              className="absolute top-0 left-0 text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
              title="Hapus pesan ini"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
            <div className="w-16 h-16 bg-[var(--color-watercolor-yellow)] rounded-full mb-4 flex items-center justify-center sketch-border shadow-sm mt-4">
              <PenLine size={24} className="text-[var(--color-sketch-black)]" />
            </div>
            <p className="text-3xl mb-6 font-hand">&ldquo;{selectedMessage.content}&rdquo;</p>
            <p className="text-xl text-gray-500 font-hand">- {selectedMessage.author}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
