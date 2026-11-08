import fs from 'fs';
import path from 'path';

async function main() {
  const dir = path.resolve('public/assets/models/hands');
  fs.mkdirSync(dir, { recursive: true });

  for (const hand of ['right', 'left']) {
    const url = `https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles/generic-hand/${hand}.glb`;
    console.log(`Downloading ${url}...`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const dest = path.join(dir, `${hand}.glb`);
    fs.writeFileSync(dest, buf);
    console.log(`Saved ${dest} (${buf.length} bytes)`);
  }
}

main().catch(console.error);
