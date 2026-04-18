"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Modal } from "../ui/Modal";
import { WatercolorButton } from "../ui/WatercolorButton";
import { SketchContainer } from "../ui/SketchContainer";
import { Send } from "lucide-react";
import { AnimatedCat } from "../ui/AnimatedCat";

export function CatChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id?: string, role: "user" | "cat"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("cat_chats")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (!error && data) {
      if (data.length === 0) {
        setMessages([{ role: "cat", text: "Meow~ Halo Rara, aku di sini jagain rumah. Ada apa hari ini?" }]);
      } else {
        setMessages(data);
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setIsLoading(true);

    const newMessages = [...messages, { role: "user" as const, text: userMessage }];
    setMessages(newMessages);

    // Simpan pesan user ke Supabase
    await supabase.from("cat_chats").insert([{ role: "user", text: userMessage }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      
      // Simpan balasan AI ke Supabase
      await supabase.from("cat_chats").insert([{ role: "cat", text: data.reply }]);

      setMessages([...newMessages, { role: "cat", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "cat", text: "Meow... (koneksi terputus)" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        className="cursor-pointer group flex flex-col items-center justify-center transform transition-transform hover:scale-105"
        onClick={() => setIsOpen(true)}
      >
        <div className="inline-block group-hover:rotate-6 transition-all duration-300">
          <AnimatedCat className="w-40 h-40 md:w-48 md:h-48" />
        </div>
        <p className="mt-2 text-xl md:text-2xl font-bold bg-white/70 px-4 py-1 sketch-border -rotate-2 backdrop-blur-[2px]">
          Kucing Penjaga
        </p>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="😸 Kucing Penjaga">
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 sketch-border bg-white/50 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <SketchContainer 
                  className={`max-w-[80%] p-3 ${
                    msg.role === "user" 
                      ? "bg-[var(--color-watercolor-blue)]/50" 
                      : "bg-[var(--color-watercolor-yellow)]/50"
                  }`}
                >
                  <p className="text-lg">{msg.text}</p>
                </SketchContainer>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <SketchContainer className="bg-[var(--color-watercolor-yellow)]/50 p-3 flex items-center gap-3">
                  <AnimatedCat isMeowing={true} className="w-10 h-10" />
                  <p className="text-lg animate-pulse">Meow sedang mikir...</p>
                </SketchContainer>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Cerita ke kucing..."
              className="flex-1 sketch-border px-4 py-2 bg-white/80 focus:outline-none text-xl font-hand"
            />
            <WatercolorButton color="pink" onClick={sendMessage} disabled={isLoading} className="px-4">
              <Send size={20} />
            </WatercolorButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
