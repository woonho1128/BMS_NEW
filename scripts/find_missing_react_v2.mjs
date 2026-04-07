import fs from 'fs';
import path from 'path';

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'backups' && file !== 'dist') {
        walk(fullPath, callback);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      callback(fullPath);
    }
  });
};

const problematicFiles = [];

walk('src', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Remove block comments
  let cleanContent = content.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove line comments
  cleanContent = cleanContent.replace(/\/\/.*/g, '');
  
  const hasReactUsage = /React\.[a-zA-Z]+/.test(cleanContent);
  const hasReactImport = /import\s+React/.test(content);
  
  if (hasReactUsage && !hasReactImport) {
    problematicFiles.push(filepath);
  }
});

console.log('Files with React. usage in CODE but no React import:');
console.log(problematicFiles.length > 0 ? problematicFiles.join('\n') : 'None found!');
