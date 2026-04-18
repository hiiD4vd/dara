import { CatChatModal } from "@/components/features/CatChatModal";
import { SpotifyRadio } from "@/components/features/SpotifyRadio";
import { SketchContainer } from "@/components/ui/SketchContainer";

export default function Home() {
  return (
    <main 
      className="relative flex min-h-screen flex-col items-center justify-center p-4 md:p-8 pb-32 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/rumah.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full flex flex-col items-center gap-8 md:gap-12 mt-12 md:mt-0">
        <SketchContainer className="max-w-4xl w-full text-center transform md:rotate-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-[var(--color-sketch-black)]">
            Ruang Tamu
          </h1>
          <p className="text-xl md:text-2xl text-gray-700">
            Selamat datang di rumah mungil kita. Tempat istirahat Rara. 🛋️
          </p>
        </SketchContainer>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-4xl">
          <SpotifyRadio />
          <CatChatModal />
        </div>
      </div>
    </main>
  );
}
