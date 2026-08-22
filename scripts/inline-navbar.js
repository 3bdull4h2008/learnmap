/**
 * Inline Navbar Script
 * 
 * Reads components/navbar.html and injects it into all HTML files,
 * replacing the fetch()-based loading pattern.
 * 
 * Usage: node scripts/inline-navbar.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NAVBAR_PATH = path.join(ROOT, 'components', 'navbar.html');

// Read the navbar HTML
const navbarHtml = fs.readFileSync(NAVBAR_PATH, 'utf-8');

// Pattern 1: <div id="navbar"></div> followed by fetch script (multi-line)
// Pattern 2: <div id="navbar"></div><script>fetch(...)</script> (one-liner)
const patterns = [
  // Multi-line pattern
  /<div id="navbar"><\/div>\s*<script>\s*fetch\("\/components\/navbar\.html"\)[\s\S]*?<\/script>/g,
  // One-liner pattern  
  /<div id="navbar"><\/div>\s*<script>fetch\("\/components\/navbar\.html"\)[^<]*<\/script>/g,
];

// Find all HTML files (exclude components/ directory and this script)
function findHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'components') {
      findHtmlFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html') && !fullPath.includes('components')) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = findHtmlFiles(ROOT);
let updated = 0;
let skipped = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let found = false;

  for (const pattern of patterns) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0;
    if (pattern.test(content)) {
      content = content.replace(pattern, navbarHtml);
      found = true;
    }
  }

  if (found) {
    fs.writeFileSync(filePath, content, 'utf-8');
    updated++;
    console.log(`✓ ${path.relative(ROOT, filePath)}`);
  } else {
    skipped++;
  }
}

console.log(`\nDone: ${updated} files updated, ${skipped} files skipped (no navbar fetch found)`);
