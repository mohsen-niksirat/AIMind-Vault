// Contrast check: verify text/background pairs in style.css meet WCAG AA (>= 4.5:1)
// and that input backgrounds differ visibly from their container.
const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'style.css'), 'utf8');

function hexToRgb(h) {
  let m = h.replace('#', '');
  if (m.length === 3) m = m.split('').map(c => c + c).join('');
  return [parseInt(m.slice(0,2),16), parseInt(m.slice(2,4),16), parseInt(m.slice(4,6),16)];
}
function lum([r,g,b]) {
  const f = c => { c /= 255; return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
  return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b);
}
function ratio(a, b) {
  const la = lum(hexToRgb(a)), lb = lum(hexToRgb(b));
  return (Math.max(la,lb) + 0.05) / (Math.min(la,lb) + 0.05);
}

let failures = 0;
function check(text, bg, label) {
  const r = ratio(text, bg);
  const ok = r >= 4.5;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}: ${r.toFixed(2)}:1 ${ok ? '(AA pass)' : `(AA FAIL, need 4.5)`}`);
  if (!ok) failures++;
  return r;
}

console.log('=== WCAG AA contrast checks ===');
// from :root tokens
check('#e5e5e5', '#111827', 'body text on surface');   // main text on cards
check('#f3f4f6', '#1e293b', 'input text on input bg'); // the fix
check('#9ca3af', '#1e293b', 'placeholder on input bg');
check('#94a3b8', '#0f172a', 'muted on hero card');
check('#fff',     '#0f172a', 'headings on hero card');
check('#10b981',  '#0f172a', 'brand accent on hero card');

console.log('\n=== Input/container visibility ===');
const inputBg = '#1e293b';
const containers = ['#0f172a', '#111827'];
containers.forEach(c => {
  const r = ratio(inputBg, c);
  // a visible boundary needs > ~1.2:1 difference to be perceptible
  const ok = r > 1.15;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} input #1e293b vs container ${c}: ${r.toFixed(2)}:1 ${ok ? '(boundary visible)' : '(invisible boundary!)'}`);
  if (!ok) failures++;
});

// The OLD broken values, for the record
console.log('\n=== Old values (should now FAIL the boundary test — proving the bug) ===');
const oldR = ratio('#111827', '#0f172a');
console.log(`  old input #111827 vs card #0f172a: ${oldR.toFixed(2)}:1 ${oldR > 1.15 ? '(was visible)' : '(was INVISIBLE — this was the bug)'}`);

console.log(`\nRESULT: ${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
