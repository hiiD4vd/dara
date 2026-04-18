import { SketchContainer } from "@/components/ui/SketchContainer";
import { FridgeStickyNotes } from "@/components/features/FridgeStickyNotes";

export default function Kitchen() {
  return (
    <main 
      className="relative flex min-h-screen flex-col items-center p-4 md:p-8 pb-32 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/dapur.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      <div className="relative z-10 w-full flex flex-col items-center gap-8 md:gap-12 mt-12 md:mt-0">
        <SketchContainer className="max-w-4xl w-full text-center transform md:rotate-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-[var(--color-sketch-black)]">
            Dapur
          </h1>
          <p className="text-xl md:text-2xl text-gray-800">
            Kulkas tempat kita tempel foto dan catatan. 冰箱 🍎
          </p>
        </SketchContainer>

        <div className="w-full max-w-5xl">
          <FridgeStickyNotes />
        </div>
      </div>
    </main>
  );
}
