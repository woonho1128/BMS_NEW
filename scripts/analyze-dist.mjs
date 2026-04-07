import fs from 'fs';
import path from 'path';

const distAssetsDir = path.resolve(process.cwd(), 'dist', 'assets');

if (!fs.existsSync(distAssetsDir)) {
  console.error('dist/assets not found. Run `npm run build` first.');
  process.exit(1);
}

const files = fs
  .readdirSync(distAssetsDir)
  .map((name) => {
    const fullPath = path.join(distAssetsDir, name);
    const stat = fs.statSync(fullPath);
    return {
      name,
      bytes: stat.size,
      kb: stat.size / 1024,
    };
  })
  .sort((a, b) => b.bytes - a.bytes);

const top = files.slice(0, 20);
const totalKb = files.reduce((sum, f) => sum + f.kb, 0);
const jsKb = files.filter((f) => f.name.endsWith('.js')).reduce((sum, f) => sum + f.kb, 0);
const cssKb = files.filter((f) => f.name.endsWith('.css')).reduce((sum, f) => sum + f.kb, 0);

console.log('=== Bundle Summary (dist/assets) ===');
console.log(`Total files: ${files.length}`);
console.log(`Total size : ${totalKb.toFixed(2)} KB`);
console.log(`JS total   : ${jsKb.toFixed(2)} KB`);
console.log(`CSS total  : ${cssKb.toFixed(2)} KB`);
console.log('');
console.log('=== Top 20 Largest Files ===');
top.forEach((file, index) => {
  console.log(`${String(index + 1).padStart(2, '0')}. ${file.name} - ${file.kb.toFixed(2)} KB`);
});
