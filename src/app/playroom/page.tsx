import { SketchContainer } from "@/components/ui/SketchContainer";
import { AbsurdCrossword } from "@/components/features/AbsurdCrossword";

export default function Playroom() {
  return (
    <main 
      className="relative flex min-h-screen flex-col items-center p-4 md:p-8 pb-32 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/kamar.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full flex flex-col items-center gap-8 md:gap-12 mt-12 md:mt-0">
        <SketchContainer className="max-w-4xl w-full text-center transform md:-rotate-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-[var(--color-sketch-black)]">
            Ruang Bermain
          </h1>
          <p className="text-xl md:text-2xl text-gray-800">
            Main tebak-tebakan garing buat ngilangin penat. 🎮
          </p>
        </SketchContainer>

        <AbsurdCrossword />
      </div>
    </main>
  );
}
