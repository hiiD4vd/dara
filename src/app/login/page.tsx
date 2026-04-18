"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { SketchContainer } from "@/components/ui/SketchContainer";
import { WatercolorButton } from "@/components/ui/WatercolorButton";
import { Heart } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Ups! Email atau passwordnya salah. Coba lagi ya!");
      setIsLoading(false);
    }
    // Jika sukses, AuthProvider akan otomatis melempar user ke halaman utama ("/")
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SketchContainer className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <Heart size={48} className="text-red-400 mb-4 fill-red-400 animate-pulse" />
          <h1 className="text-5xl text-center mb-2">Rumah Mungil LDR</h1>
          <p className="text-xl text-gray-500 text-center">Silakan masuk untuk melihat kenangan kita</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-2xl mb-2">Siapa ini?</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email kamu"
              className="w-full sketch-border px-4 py-3 bg-white/50 focus:outline-none focus:bg-white text-xl font-sans"
              required
            />
          </div>

          <div>
            <label className="block text-2xl mb-2">Kata Sandi Rahasia</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full sketch-border px-4 py-3 bg-white/50 focus:outline-none focus:bg-white text-xl font-sans"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-xl text-center">{error}</p>
          )}

          <div className="pt-4">
            <WatercolorButton
              type="submit"
              color="blue"
              className="w-full py-4 text-2xl flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? "Sedang Membuka Pintu..." : "Buka Pintu"}
            </WatercolorButton>
          </div>
        </form>
      </SketchContainer>
    </div>
  );
}
