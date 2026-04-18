const fs = require('fs');
const path = require('path');

function cleanChat() {
  const inputPath = path.join(process.cwd(), 'public', 'assets', 'riwayat_chat.txt');
  const outputPath = path.join(process.cwd(), 'public', 'assets', 'clean_chat.json');

  if (!fs.existsSync(inputPath)) {
    console.error("riwayat_chat.txt tidak ditemukan!");
    return;
  }

  const rawText = fs.readFileSync(inputPath, 'utf8');
  const lines = rawText.split('\n');

  const cleanLines = [];
  const regex = /^\[(.*?)\] (.*?): (.*)$/;

  let userA = null;
  let userB = null;

  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      const sender = match[2].trim();
      let message = match[3].trim();

      // Skip system messages
      if (message.includes('Pesan ini diedit')) continue;
      if (message.includes('gambar tidak disertakan') || message.includes('dokumen tidak disertakan') || message.includes('stiker tidak disertakan')) continue;
      if (message.includes('Panggilan video') || message.includes('Panggilan suara')) continue;
      if (message.includes('Pesan dan panggilan terenkripsi')) continue;

      if (!message) continue;

      // Identify Daud and Rara
      // Daud is usually "O" or "ج" or something, Rara is "Ibu Guru BK Geulis"
      // Since Daud is the one whose name is NOT Rara, we can just map it.
      let role = "Rara";
      if (!sender.includes("Ibu Guru") && !sender.includes("Geulis")) {
        role = "Daud";
      }

      cleanLines.push(`${role}: ${message}`);
    }
  }

  // Get the last 200 lines to form a solid context of recent chat
  const recentLines = cleanLines.slice(-200);

  fs.writeFileSync(outputPath, JSON.stringify({ dialogs: recentLines }, null, 2));
  console.log("Chat berhasil dibersihkan dan disimpan ke clean_chat.json");
}

cleanChat();
