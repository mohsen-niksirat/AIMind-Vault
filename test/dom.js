// DOM-level test: verifies the key-manager dropdown actually populates
// with built-in + free + custom providers, using a minimal DOM shim.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// --- Minimal DOM shim ---
const elements = new Map();
let localStorageStore = {};

function makeEl(id) {
  return {
    id,
    _innerHTML: '',
    value: '',
    placeholder: '',
    required: false,
    dataset: {},
    options: [],
    selectedIndex: 0,
    style: {},
    textContent: '',
    set innerHTML(v) { this._innerHTML = v; this._parseOptions(); },
    get innerHTML() { return this._innerHTML; },
    _parseOptions() {
      this.options = [];
      const re = /<option value="([^"]*)"[^>]*data-type="([^"]*)"[^>]*>(.*?)<\/option>/g;
      let m;
      while ((m = re.exec(this._innerHTML)) !== null) {
        this.options.push({ value: m[1], dataset: { type: m[2] }, textContent: m[3] });
      }
    },
    addEventListener() {},
    appendChild() {},
    dispatchEvent() { return true; }
  };
}

global.document = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, makeEl(id));
    return elements.get(id);
  },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  createElement() { return makeEl('dynamic'); },
  addEventListener(event, cb) { if (event === 'DOMContentLoaded') this._cb = cb; },
  head: { appendChild() {} },
  body: { appendChild() {} }
};
global.localStorage = {
  getItem: (k) => localStorageStore[k] ?? null,
  setItem: (k, v) => { localStorageStore[k] = String(v); }
};
global.crypto = {
  getRandomValues: (arr) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256); return arr; },
  subtle: {}
};
global.navigator = { clipboard: { writeText() {} } };
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.window = global;

// Load vault.js
const code = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'vault.js'), 'utf8');
eval(code);

// Fire DOMContentLoaded to construct the vault
document._cb();

let failures = 0;
function assert(cond, msg) {
  if (cond) console.log(`  OK   ${msg}`);
  else { console.log(`  FAIL ${msg}`); failures++; }
}

console.log('=== Provider dropdown test ===');

// Simulate what key-manager.html does on DOMContentLoaded
const providerSelect = document.getElementById('provider');
const options = vault.getProviderOptionsForForm();
providerSelect.innerHTML = options.map(o =>
  `<option value="${o.id}" data-type="${o.type}">${o.name}</option>`
).join('');

const ids = options.map(o => o.id);
assert(options.length >= 8, `dropdown has ${options.length} providers (>= 8 expected)`);
assert(ids.includes('openai'), 'includes OpenAI (builtin)');
assert(ids.includes('deepseek'), 'includes DeepSeek (builtin)');
assert(ids.includes('anthropic'), 'includes Anthropic (builtin)');
assert(ids.includes('google'), 'includes Google (builtin)');
assert(ids.includes('qwen-free'), 'includes Qwen free');
assert(ids.includes('gemini-free'), 'includes Gemini free');
assert(ids.includes('glm-free'), 'includes GLM free');
assert(ids.includes('deepseek-v4-flash'), 'includes DeepSeek v4.1 free');

console.log('\n=== Custom provider round-trip test ===');
vault.addCustomProvider({
  name: 'Cohere',
  baseUrl: 'https://api.cohere.ai/v1',
  models: 'command-r, command-r-plus',
  icon: ''
});
const custom = vault.getCustomProviders();
assert(custom.length === 1, 'custom provider saved');
assert(custom[0].name === 'Cohere', 'name preserved');
assert(custom[0].baseUrl === 'https://api.cohere.ai/v1', 'baseUrl preserved');
assert(JSON.stringify(custom[0].models) === JSON.stringify(['command-r', 'command-r-plus']), 'models parsed to array');

// Verify the custom provider now appears in the form options
const opts2 = vault.getProviderOptionsForForm();
assert(opts2.some(o => o.name.includes('Cohere')), 'custom provider appears in form options');

// Verify getProviderConfig resolves the custom provider
const cfg = vault.getProviderConfig(custom[0].id);
assert(cfg.name === 'Cohere', 'getProviderConfig resolves custom provider');
assert(cfg.type === 'custom', 'config type is custom');

console.log('\n=== Encrypt/decrypt round-trip test ===');
const secret = 'sk-test-12345';
const enc = vault.encrypt(secret);
const dec = vault.decrypt(enc);
assert(dec === secret, `encrypt/decrypt round-trip ("${secret}" -> "${enc.slice(0, 16)}..." -> "${dec}")`);

console.log('\n=== Free provider config test ===');
const qwen = vault.getProviderConfig('qwen-free');
assert(qwen.type === 'free', 'qwen-free resolves to type free');
assert(qwen.models.length > 0, 'qwen-free has models');

console.log(`\nRESULT: ${failures === 0 ? 'ALL TESTS PASSED' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
