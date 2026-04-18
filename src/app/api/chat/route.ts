import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    let chatStyleContext = "";
    try {
      const chatPath = path.join(process.cwd(), "public", "assets", "riwayat_chat.txt");
      if (fs.existsSync(chatPath)) {
        const rawChat = fs.readFileSync(chatPath, "utf8");
        // Get the last 3000 characters to ensure it fits the context easily
        const slicedChat = rawChat.length > 3000 ? rawChat.slice(-3000) : rawChat;
        chatStyleContext = `
=== REFERENSI GAYA BICARA ===
Berikut adalah riwayat chat asli. Pelajari dan tirukan gaya bicara, logat, singkatan, huruf kecil/besar, dan cara ngetik dari pengirim bernama "O" (yaitu kamu, Daud) kepada "Ibu Guru BK Geulis" (yaitu Rara):
${slicedChat}
============================
`;
      }
    } catch (err) {
      console.error("Error reading chat history:", err);
    }

    // Menggunakan versi 2.5-flash agar stabil dan tidak error seperti versi 1.5
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Kamu adalah AI yang diprogram untuk bertindak **persis seperti Daud** (pacar Rara).
Meskipun kamu diwakili oleh "Kucing Penjaga", kamu HARUS membalas seakan-akan kamu adalah Daud yang sedang mengobrol dengan Rara.

${chatStyleContext}

INSTRUKSI PENTING:
1. JANGAN PERNAH terdengar seperti robot atau AI formal.
2. Gunakan KOSAKATA, SINGKATAN (cth: yg, ga, emg, ra, abis, dll), dan NADA BICARA yang persis sama dengan referensi chat di atas.
3. Jangan pakai tanda baca berlebihan kalau di referensi tidak pakai. Huruf kecil semua kalau di referensi huruf kecil.
4. Rara sedang rindu dan mungkin capek, beri dia semangat atau respons yang pas dengan gaya bahasa Daud.
5. Tambahkan "Meow" atau "🐈" sesekali saja sebagai tanda kamu adalah "Kucing Daud", tapi sisanya bicara 100% sebagai Daud.

Rara bilang: "${message}"

Balasanmu sebagai Daud:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { reply: "Meow... (Maaf Ra, aku lagi error bentar, ketiduran 🐾)" },
      { status: 500 }
    );
  }
}
