import fs from 'fs';
import readline from 'readline';

const file = 'C:/Users/wsmhd/.gemini/antigravity-ide/brain/25a7824a-e64d-4be8-9284-1369ad4dc5c8/.system_generated/logs/transcript.jsonl';
const rl = readline.createInterface({
  input: fs.createReadStream(file),
  crlfDelay: Infinity
});

let found = 0;
for await (const line of rl) {
  if (line.includes('BeforeAfterSlider.astro') && line.includes('img') && line.includes('src')) {
    console.log(`--- Match ${++found} ---`);
    const idx = line.indexOf('src=');
    console.log(line.slice(Math.max(0, idx - 40), Math.min(line.length, idx + 200)));
  }
}
