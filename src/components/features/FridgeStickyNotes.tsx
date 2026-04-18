"use client";

import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { supabase } from "@/lib/supabase";
import { WatercolorButton } from "../ui/WatercolorButton";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { Modal } from "../ui/Modal";

interface StickyNote {
  id: string;
  type: "text" | "polaroid";
  content: string;
  image_url: string;
  x_pos: number;
  y_pos: number;
}

export function FridgeStickyNotes() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newType, setNewType] = useState<"text" | "polaroid">("text");
  const [newContent, setNewContent] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    fetchNotes();

    const channel = supabase
      .channel("sticky_notes_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sticky_notes" },
        () => fetchNotes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotes = async () => {
    const { data, error } = await supabase.from("sticky_notes").select("*");
    if (!error && data) {
      setNotes(data);
    }
  };

  const handleStop = async (id: string, x: number, y: number) => {
    // Update local state optimistically
    setNotes((prev) => prev.map(n => n.id === id ? { ...n, x_pos: x, y_pos: y } : n));
    // Update db
    await supabase.from("sticky_notes").update({ x_pos: x, y_pos: y }).eq("id", id);
  };

  const handleDelete = async (id: string) => {
    setNotes((prev) => prev.filter(n => n.id !== id));
    await supabase.from("sticky_notes").delete().eq("id", id);
  };

  const handleAdd = async () => {
    if (newType === "text" && !newContent.trim()) return;
    if (newType === "polaroid" && !newImageUrl.trim()) return;

    await supabase.from("sticky_notes").insert([
      {
        type: newType,
        content: newContent,
        image_url: newImageUrl,
        x_pos: Math.floor(Math.random() * 100),
        y_pos: Math.floor(Math.random() * 100),
      },
    ]);

    setNewContent("");
    setNewImageUrl("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full relative min-h-[60vh] bg-white/40 sketch-border overflow-hidden">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <WatercolorButton color="yellow" onClick={() => { setNewType("text"); setIsAddModalOpen(true); }} className="p-2">
          <Plus size={24} />
        </WatercolorButton>
        <WatercolorButton color="blue" onClick={() => { setNewType("polaroid"); setIsAddModalOpen(true); }} className="p-2">
          <ImageIcon size={24} />
        </WatercolorButton>
      </div>

      <div className="absolute inset-0 p-8">
        {notes.map((note) => (
          <DraggableNote 
            key={note.id} 
            note={note} 
            handleStop={handleStop} 
            handleDelete={handleDelete} 
          />
        ))}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={`Tambah ${newType === 'text' ? 'Catatan' : 'Polaroid'}`}>
        <div className="flex flex-col gap-4">
          {newType === "text" ? (
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Isi catatan..."
              className="sketch-border p-4 bg-transparent min-h-[150px] text-xl font-hand resize-none"
            />
          ) : (
            <>
              <input 
                type="url" 
                value={newImageUrl} 
                onChange={(e) => setNewImageUrl(e.target.value)} 
                placeholder="URL Gambar..."
                className="sketch-border px-4 py-2 bg-transparent text-xl font-hand"
              />
              <input 
                type="text" 
                value={newContent} 
                onChange={(e) => setNewContent(e.target.value)} 
                placeholder="Caption (opsional)..."
                className="sketch-border px-4 py-2 bg-transparent text-xl font-hand"
              />
            </>
          )}
          <WatercolorButton color="yellow" onClick={handleAdd} className="self-end">
            Tempel
          </WatercolorButton>
        </div>
      </Modal>
    </div>
  );
}

function DraggableNote({ note, handleStop, handleDelete }: { 
  note: StickyNote; 
  handleStop: (id: string, x: number, y: number) => void; 
  handleDelete: (id: string) => void;
}) {
  const nodeRef = React.useRef(null);
  
  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: note.x_pos, y: note.y_pos }}
      onStop={(e, data) => handleStop(note.id, data.x, data.y)}
      bounds="parent"
    >
      <div ref={nodeRef} className="absolute cursor-move inline-block">
        {note.type === "text" ? (
          <div className="w-48 h-48 bg-[var(--color-watercolor-yellow)] p-4 shadow-md rotate-2 transition-transform hover:z-20 flex flex-col relative group">
            <button onClick={() => handleDelete(note.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
            <p className="text-xl font-hand leading-tight flex-1 overflow-hidden overflow-wrap break-words">{note.content}</p>
          </div>
        ) : (
          <div className="w-56 bg-white p-3 shadow-md -rotate-2 transition-transform hover:z-20 relative group">
            <button onClick={() => handleDelete(note.id)} className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <X size={16} />
            </button>
            <div className="w-full h-48 bg-gray-200 mb-2 overflow-hidden flex items-center justify-center sketch-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={note.image_url} alt="Polaroid" className="w-full h-full object-cover pointer-events-none" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/200?text=Error")} />
            </div>
            <p className="text-center font-hand text-lg px-2 truncate">{note.content}</p>
          </div>
        )}
      </div>
    </Draggable>
  );
}
