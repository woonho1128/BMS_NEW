import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INCLUDE_DIRS = ['src', 'scripts'];
const TARGET_EXTS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.md', '.json', '.cjs', '.mjs']);

// Observed mojibake tokens from broken sessions.
const MOJIBAKE_TOKENS = [
  '濡쒓렇',
  '議곗쭅',
  '怨듭옣',
  '諛섏쁺',
  '嫄곕옒泥',
  '留ㅼ텧',
  '異쒓퀬',
];

function walk(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'backups' || entry.name === 'customers-edit') {
        continue;
      }
      walk(full, out);
      continue;
    }
    if (!TARGET_EXTS.has(path.extname(entry.name))) continue;
    out.push(full);
  }
}

function checkFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
  if (text.includes('\uFFFD')) {
    issues.push('contains replacement character (U+FFFD)');
  }
  if (relPath === 'scripts/check-encoding.mjs') {
    return issues;
  }
  for (const token of MOJIBAKE_TOKENS) {
    if (text.includes(token)) {
      issues.push(`contains suspicious mojibake token: "${token}"`);
    }
  }
  return issues;
}

const files = [];
for (const rel of INCLUDE_DIRS) {
  const abs = path.join(ROOT, rel);
  if (fs.existsSync(abs)) walk(abs, files);
}

const results = [];
for (const file of files) {
  const issues = checkFile(file);
  if (issues.length > 0) {
    results.push({
      file: path.relative(ROOT, file).replace(/\\/g, '/'),
      issues,
    });
  }
}

if (results.length > 0) {
  console.error('[encoding-check] Failed: suspicious encoding artifacts found.');
  for (const r of results) {
    for (const issue of r.issues) {
      console.error(`- ${r.file}: ${issue}`);
    }
  }
  process.exit(1);
}

console.log(`[encoding-check] OK (${files.length} files scanned)`);
