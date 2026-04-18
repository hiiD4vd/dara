import React from "react";
import { SketchContainer } from "../ui/SketchContainer";

export function SpotifyRadio() {
  return (
    <SketchContainer className="bg-[var(--color-watercolor-blue)]/20 p-4 max-w-sm w-full mx-auto transform -rotate-1">
      <h3 className="text-2xl font-bold mb-2 text-center">📻 Playlist Kita</h3>
      <div className="sketch-border overflow-hidden bg-white/50 aspect-video flex items-center justify-center">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/videoseries?list=PLHVO1jSts1a_xsFvvlKMr8o4vQJdAe-dG"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </SketchContainer>
  );
}
