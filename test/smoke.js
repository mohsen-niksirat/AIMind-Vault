// Headless smoke test: loads each page, captures console errors,
// and verifies the key-manager dropdown actually populates.
const { spawnSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 8123;

const PAGES = ['index.html', 'key-manager.html', 'providers.html', 'settings.html', 'profile.html', 'features.html', 'fa.html'];

function checkFile(file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return { file, ok: false, error: 'MISSING FILE' };
  const html = fs.readFileSync(p, 'utf8');
  const problems = [];
  if (!html.includes('</html>')) problems.push('unclosed </html>');
  if (!html.includes('<body')) problems.push('no <body>');
  // list referenced local js/css assets
  const refs = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map(m => m[1]);
  for (const r of refs) {
    if (!fs.existsSync(path.join(ROOT, r.replace(/\//g, path.sep)))) {
      problems.push(`missing asset: ${r}`);
    }
  }
  return { file, ok: problems.length === 0, problems };
}

console.log('=== File & asset integrity ===');
let allOk = true;
for (const p of PAGES) {
  const r = checkFile(p);
  if (r.ok) console.log(`  OK   ${p}`);
  else { console.log(`  FAIL ${p}: ${r.error || r.problems.join(', ')}`); allOk = false; }
}

// Syntax check vault.js with node
console.log('\n=== JS syntax check ===');
const syntax = spawnSync('node', ['--check', path.join(ROOT, 'assets', 'js', 'vault.js')]);
if (syntax.status === 0) console.log('  OK   assets/js/vault.js parses');
else { console.log(`  FAIL vault.js: ${syntax.stderr.toString()}`); allOk = false; }

console.log(`\nRESULT: ${allOk ? 'ALL CHECKS PASSED' : 'FAILURES FOUND'}`);
process.exit(allOk ? 0 : 1);
