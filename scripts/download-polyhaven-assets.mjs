import fs from 'fs';
import path from 'path';

const ASSETS_TO_DOWNLOAD = [
  'brass_pot_01',
  'painted_wooden_bench',
  'Lantern_01',
  'planter_pot_clay',
  'potted_plant_01',
];

const BASE_OUT_DIR = path.resolve('public/assets/models');
if (!fs.existsSync(BASE_OUT_DIR)) {
  fs.mkdirSync(BASE_OUT_DIR, { recursive: true });
}

async function downloadFile(url, destPath) {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
  console.log(`  ✓ Saved: ${destPath} (${(arrayBuffer.byteLength / 1024).toFixed(1)} KB)`);
}

async function downloadAsset(assetId) {
  console.log(`\n📦 Sourcing Poly Haven Asset: ${assetId}...`);
  const metaRes = await fetch(`https://api.polyhaven.com/files/${assetId}`);
  if (!metaRes.ok) {
    console.error(`  ❌ Failed to get files for ${assetId}`);
    return null;
  }
  const files = await metaRes.json();

  const gltfInfo = files.gltf?.['1k'] || files.gltf?.['2k'];
  if (!gltfInfo) {
    console.warn(`  ⚠️ No 1k/2k gltf found for ${assetId}`);
    return null;
  }

  const assetDir = path.join(BASE_OUT_DIR, assetId);
  if (!fs.existsSync(assetDir)) {
    fs.mkdirSync(assetDir, { recursive: true });
  }

  // 1. Download glTF manifest
  const gltfUrl = gltfInfo.gltf.url;
  const gltfPath = path.join(assetDir, `${assetId}.gltf`);
  await downloadFile(gltfUrl, gltfPath);

  // 2. Download include files (.bin, textures)
  if (gltfInfo.gltf.include) {
    for (const [relPath, inc] of Object.entries(gltfInfo.gltf.include)) {
      const outPath = path.join(assetDir, relPath);
      await downloadFile(inc.url, outPath);
    }
  }

  console.log(`  🎉 Successfully downloaded ${assetId}!`);
}

async function run() {
  for (const id of ASSETS_TO_DOWNLOAD) {
    try {
      await downloadAsset(id);
    } catch (err) {
      console.error(`Error downloading ${id}:`, err);
    }
  }
}

run();
