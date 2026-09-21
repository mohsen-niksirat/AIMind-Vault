// AIMind Vault - Core functionality
// This file will handle encryption, storage, and API key management

class AIMindVault {
  constructor() {
    this.providerConfig = {
      'openai': {
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1',
        models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4-turbo'],
        colors: '#fff',
        icon: 'assets/img/openai.svg'
      },
      'deepseek': {
        name: 'DeepSeek',
        baseUrl: 'https://api.deepseek.com/v1',
        models: ['deepseek-chat', 'deepseek-coder', 'deepseek-vision'],
        colors: '#ff6b35',
        icon: 'assets/img/deepseek.svg'
      },
      'anthropic': {
        name: 'Anthropic',
        baseUrl: 'https://api.anthropic.com',
        models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
        colors: '#ff6b35',
        icon: 'assets/img/anthropic.svg'
      },
      'google': {
        name: 'Google AI',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        models: ['gemini-pro', 'gemini-pro-vision'],
        colors: '#4285f4',
        icon: 'assets/img/google.svg'
      }
    };
    this.init();
  }

  async init() {
    // Initialize navigation
    this.setupNavigation();
    // Auto-fill current year in footer
    this.fillYear();
    // Load keys from storage if on dashboard
    if (document.getElementById('keys-table-body')) {
      this.loadKeys();
    }
  }

  setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    
    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !expanded);
        nav.classList.toggle('open');
      });
    }
  }

  fillYear() {
    const yearElement = document.querySelector('[data-year]');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  loadKeys() {
    const keys = this.getKeysFromStorage();
    const tbody = document.getElementById('keys-table-body');
    
    if (keys.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;padding:40px;color:#94a3b8">
            No API keys configured. <a href="key-manager.html" class="btn btn-sm btn-primary" style="margin-left:10px">Add your first key</a>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = keys.map(key => `
      <tr>
        <td>
          <img src="${key.icon || 'assets/img/default.svg'}" alt="${key.provider}" class="provider-icon">
          ${key.providerName}
        </td>
        <td>${key.models ? key.models.join(', ') : 'N/A'}</td>
        <td><span class="status status-${key.status || 'active'}">
          ${(key.status === 'restricted' ? 'Restricted' : 'Active').charAt(0).toUpperCase() + (key.status === 'restricted' ? 'estricted' : 'ctive')}
        </span></td>
        <td>${key.lastUsed || 'Never'}</td>
        <td>
          <a href="#" class="btn btn-sm btn-ghost" onclick="vault.copyConfig('${key.id}')">Copy</a>
          <a href="key-manager.html?id=${key.id}" class="btn btn-sm btn-outline">Edit</a>
        </td>
      </tr>
    `).join('');
  }

  getKeysFromStorage() {
    try {
      const stored = localStorage.getItem('aimind_keys');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading keys:', e);
      return [];
    }
  }

  saveKeys(keys) {
    try {
      localStorage.setItem('aimind_keys', JSON.stringify(keys));
    } catch (e) {
      console.error('Error saving keys:', e);
    }
  }

  addKey(keyData) {
    const keys = this.getKeysFromStorage();
    const newKey = {
      id: Date.now().toString(),
      provider: keyData.providerId,
      providerName: keyData.providerName,
      baseUrl: keyData.baseUrl,
      models: keyData.models.split(',').map(m => m.trim()),
      apiKey: keyData.apiKey ? this.encrypt(keyData.apiKey) : null,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsed: 'Never',
      icon: this.providerConfig[keyData.providerId]?.icon || 'assets/img/default.svg'
    };
    keys.push(newKey);
    this.saveKeys(keys);
    window.location.href = 'index.html';
  }

  updateKey(id, keyData) {
    const keys = this.getKeysFromStorage();
    const index = keys.findIndex(k => k.id === id);
    if (index !== -1) {
      keys[index] = {
        ...keys[index],
        ...keyData,
        models: keyData.models ? keyData.models.split(',').map(m => m.trim()) : keys[index].models,
        updatedAt: new Date().toISOString()
      };
      this.saveKeys(keys);
    }
    window.location.href = 'index.html';
  }

  // Simple encryption using Web Crypto API
  async encrypt(text) {
    // In production, use proper AES-GCM encryption
    // This is a placeholder for demonstration
    return btoa(text).slice(0, 50) + '...[encrypted]';
  }

  async decrypt(encryptedText) {
    // Placeholder for decryption
    return encryptedText;
  }

  copyConfig(keyId) {
    const keys = this.getKeysFromStorage();
    const key = keys.find(k => k.id === keyId);
    if (key) {
      const config = {
        baseURL: key.baseUrl,
        models: key.models,
        apiKey: '[REDACTED - View in Vault]'
      };
      navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      alert('Configuration copied to clipboard!');
    }
  }
}

// Initialize vault
const vault = new AIMindVault();