const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const apiKey = fs.readFileSync('.env.local', 'utf8').split('GEMINI_API_KEY=')[1].trim();
const genAI = new GoogleGenerativeAI(apiKey);
async function test() {
  const chatPath = path.join(process.cwd(), 'public', 'assets', 'riwayat_chat.txt');
  let slicedChat = '';
  if (fs.existsSync(chatPath)) {
    const rawChat = fs.readFileSync(chatPath, 'utf8');
    slicedChat = rawChat.length > 3000 ? rawChat.slice(-3000) : rawChat;
  }
  const prompt = `
Kamu adalah AI yang diprogram untuk bertindak **persis seperti Daud** (pacar Rara).
Meskipun kamu diwakili oleh Kucing Penjaga, kamu HARUS membalas seakan-akan kamu adalah Daud yang sedang mengobrol dengan Rara.

=== REFERENSI GAYA BICARA ===
Berikut adalah riwayat chat asli. Pelajari dan tirukan gaya bicara, logat, singkatan, huruf kecil/besar, dan cara ngetik dari pengirim bernama O (yaitu kamu, Daud) kepada Ibu Guru BK Geulis (yaitu Rara):
${slicedChat}
============================

INSTRUKSI PENTING:
1. JANGAN PERNAH terdengar seperti robot atau AI formal.
2. Gunakan KOSAKATA, SINGKATAN (cth: yg, ga, emg, ra, abis, dll), dan NADA BICARA yang persis sama dengan referensi chat di atas.
3. Jangan pakai tanda baca berlebihan kalau di referensi tidak pakai. Huruf kecil semua kalau di referensi huruf kecil.
4. Rara bilang: aku kangenn
Balasanmu sebagai Daud:
`;
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  try {
    const result = await model.generateContent(prompt);
    console.log('SUCCESS:', result.response.text());
  } catch (e) {
    console.error('ERROR MESSAGE:', e.message);
  }
}
test();
