import fs from 'fs';
import path from 'path';

const root = process.cwd();
const targetDir = path.join(root, 'src', 'modules');

function walk(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, acc);
      return;
    }
    if (/\.(jsx|js)$/.test(entry.name)) acc.push(full);
  });
  return acc;
}

function parseAntdImport(content) {
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]antd['"]/g;
  const parts = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const names = match[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    parts.push(...names);
  }
  return parts;
}

const files = walk(targetDir);
const rows = [];
const componentCount = new Map();

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const names = parseAntdImport(content);
  if (!names.length) return;
  names.forEach((name) => {
    componentCount.set(name, (componentCount.get(name) || 0) + 1);
  });
  rows.push({
    file: path.relative(root, file).replace(/\\/g, '/'),
    count: names.length,
    components: names,
  });
});

rows.sort((a, b) => b.count - a.count);
const topComponents = [...componentCount.entries()].sort((a, b) => b[1] - a[1]);

console.log('=== AntD Usage by File (Top 20) ===');
rows.slice(0, 20).forEach((row, index) => {
  console.log(
    `${String(index + 1).padStart(2, '0')}. ${row.file} - ${row.count} imports :: ${row.components.join(', ')}`
  );
});

console.log('');
console.log('=== Most Used AntD Components ===');
topComponents.slice(0, 30).forEach(([name, count], index) => {
  console.log(`${String(index + 1).padStart(2, '0')}. ${name} - ${count} files`);
});

console.log('');
console.log(`Files using AntD: ${rows.length}`);
