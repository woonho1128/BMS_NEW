import fs from 'fs';
import path from 'path';

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'backups') {
        walk(fullPath, callback);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      callback(fullPath);
    }
  });
};

const problematicFiles = [];

walk('src', (filepath) => {
  const content = fs.readFileSync(filepath, 'utf8');
  // Check for React. usage (not in comments or strings if possible, but simple check first)
  // Let's look for React. followed by Alphanumeric
  const hasReactUsage = /React\.[a-zA-Z]+/.test(content);
  const hasReactImport = /import\s+React/.test(content);
  
  if (hasReactUsage && !hasReactImport) {
    problematicFiles.push(filepath);
  }
});

console.log('Files with React. usage but no React import:');
console.log(problematicFiles.length > 0 ? problematicFiles.join('\n') : 'None found!');
