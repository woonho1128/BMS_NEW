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

walk('src', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let originalContent = content;
  
  // 1. If it uses React.Fragment (with key), use named Fragment import
  if (content.includes('React.Fragment')) {
    // Replace React.Fragment with Fragment
    content = content.replace(/React\.Fragment/g, 'Fragment');
    
    // Ensure Fragment is imported
    if (!content.includes('import {') && !content.includes('import React, {')) {
        // No destructured import yet
        content = content.replace(/import React from 'react';/, "import React, { Fragment } from 'react';");
        content = content.replace(/import {/, "import { Fragment,");
    } else if (content.includes('import {') && !content.includes('Fragment')) {
        content = content.replace(/import {/, "import { Fragment,");
    } else if (content.includes('import React, {') && !content.includes('Fragment')) {
        content = content.replace(/import React, {/, "import React, { Fragment,");
    }
    
    // If no React import at all, add it
    if (!/import.*from 'react'/.test(content)) {
        content = "import React, { Fragment } from 'react';\n" + content;
    }
  }

  // 2. If it uses other React.xxx common hooks, fix them
  ['useRef', 'useEffect', 'useState', 'useCallback', 'useMemo', 'createContext'].forEach(hook => {
      const reactHook = `React.${hook}`;
      if (content.includes(reactHook)) {
          content = content.replace(new RegExp(`React\\.${hook}`, 'g'), hook);
          if (content.includes('import {') && !content.includes(hook)) {
              content = content.replace(/import {/, `import { ${hook},`);
          } else if (content.includes('import React, {') && !content.includes(hook)) {
              content = content.replace(/import React, {/, `import React, { ${hook},`);
          } else if (!/import.*from 'react'/.test(content)) {
              content = `import React, { ${hook} } from 'react';\n` + content;
          } else if (!content.includes('{')) {
               content = content.replace(/import React from 'react';/, `import React, { ${hook} } from 'react';`);
          }
      }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated: ${filepath}`);
  }
});
