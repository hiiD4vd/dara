"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SketchContainer } from "../ui/SketchContainer";
import { Settings, Check, X } from "lucide-react";

export function SpotifyRadio() {
  const [playlistId, setPlaylistId] = useState("PLHVO1jSts1a_xsFvvlKMr8o4vQJdAe-dG");
  const [isEditing, setIsEditing] = useState(false);
  const [tempInput, setTempInput] = useState("");

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const fetchPlaylist = async () => {
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "youtube_playlist_id")
      .single();

    if (data && data.value) {
      setPlaylistId(data.value);
    }
  };

  const handleSave = async () => {
    // Ekstrak ID dari URL jika user memasukkan full URL
    let newId = tempInput.trim();
    if (newId.includes("list=")) {
      newId = newId.split("list=")[1].split("&")[0];
    }

    if (!newId) {
      setIsEditing(false);
      return;
    }

    setPlaylistId(newId);
    setIsEditing(false);

    // Simpan ke Supabase (Upsert)
    await supabase.from("app_settings").upsert({ 
      key: "youtube_playlist_id", 
      value: newId 
    });
  };

  return (
    <SketchContainer className="bg-[var(--color-watercolor-blue)]/20 p-4 max-w-sm w-full mx-auto transform -rotate-1 relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-bold">📻 Playlist Kita</h3>
        <button 
          onClick={() => { setIsEditing(!isEditing); setTempInput(playlistId); }}
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      {isEditing ? (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            value={tempInput}
            onChange={(e) => setTempInput(e.target.value)}
            placeholder="Link YouTube Playlist..."
            className="flex-1 sketch-border px-2 py-1 bg-white/80 focus:outline-none text-sm font-sans"
          />
          <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-100 rounded">
            <Check size={20} />
          </button>
          <button onClick={() => setIsEditing(false)} className="p-1 text-red-600 hover:bg-red-100 rounded">
            <X size={20} />
          </button>
        </div>
      ) : null}

      <div className="sketch-border overflow-hidden bg-white/50 aspect-video flex items-center justify-center">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </SketchContainer>
  );
}
