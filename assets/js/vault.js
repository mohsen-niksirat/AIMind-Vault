// AIMind Vault - Core functionality
// This file handles encryption, storage, and API key management

class AIMindVault {
  constructor() {
    this.storageKey = 'aimind_keys';
    this.masterPassword = null;
    this.init();
  }

  /**
   * Initialize the vault
   */
  async init() {
    this.setupNavigation();
    this.fillYear();
    this.loadMasterPassword();
    
    if (document.getElementById('keys-table-body')) {
      this.loadKeys();
    }
    
    if (document.getElementById('profiles-list')) {
      this.loadProfiles();
    }
  }

  /**
   * Setup navigation toggle for mobile
   */
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

  /**
   * Auto-fill current year in footer
   */
  fillYear() {
    const yearElement = document.querySelector('[data-year]');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * Load master password from storage
   */
  loadMasterPassword() {
    const saved = localStorage.getItem('aimind_master_password');
    if (saved) {
      this.masterPassword = saved;
    }
  }

  /**
   * Load keys from storage
   */
  getKeysFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading keys:', e);
      return [];
    }
  }

  /**
   * Save keys to storage
   */
  saveKeys(keys) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(keys));
    } catch (e) {
      console.error('Error saving keys:', e);
    }
  }

  /**
   * Load keys and display on dashboard
   */
  loadKeys() {
    this.updateStats();
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
          <div style="display:flex;align-items:center;gap:8px">
            ${key.icon ? `<img src="${key.icon}" alt="${key.providerName}" class="provider-icon" width="24" height="24">` : ''}
            <span>${key.providerName}</span>
          </div>
        </td>
        <td>${key.models ? key.models.join(', ') : 'N/A'}</td>
        <td><span class="status status-${key.status || 'active'}">
          ${key.status === 'restricted' ? 'Restricted' : 'Active'}
        </span></td>
        <td>${this.formatDate(key.lastUsed)}</td>
        <td>
          <button onclick="vault.copyConfig('${key.id}')" class="btn btn-sm btn-ghost">Copy</button>
          <a href="key-manager.html?id=${key.id}" class="btn btn-sm btn-outline">Edit</a>
        </td>
      </tr>
    `).join('');
  }

  /**
   * Update dashboard stats
   */
  updateStats() {
    const keys = this.getKeysFromStorage();
    const totalKeys = keys.length;
    const activeKeys = keys.filter(k => k.status === 'active').length;
    const usedToday = keys.filter(k => {
      if (!k.lastUsed) return 0;
      const today = new Date().toISOString().split('T')[0];
      return k.lastUsed.includes(today) ? 1 : 0;
    }).length;

    const totalInput = document.getElementById('total-keys');
    const activeInput = document.querySelector('.kpi-value.success');
    
    if (totalInput) totalInput.textContent = totalKeys;
    if (activeInput) activeInput.textContent = activeKeys;
  }

  /**
   * Format date for display
   */
  formatDate(dateString) {
    if (!dateString || dateString === 'Never') return 'Never';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffHours < 48) return 'Yesterday';
      
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  /**
   * Add a new API key
   */
  addKey(keyData) {
    const keys = this.getKeysFromStorage();
    const provider = this.getProviderConfig(keyData.providerId);
    
    const newKey = {
      id: Date.now().toString(),
      providerId: keyData.providerId,
      providerName: provider.name,
      baseUrl: keyData.baseUrl || provider.baseUrl,
      models: keyData.models.split(',').map(m => m.trim()),
      apiKey: keyData.apiKey ? this.encrypt(keyData.apiKey) : null,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsed: 'Never',
      icon: provider.icon || '',
      profile: keyData.profile || 'default'
    };
    
    keys.push(newKey);
    this.saveKeys(keys);
    this.updateStats();
    window.location.href = 'index.html';
  }

  /**
   * Update an existing API key
   */
  updateKey(id, keyData) {
    const keys = this.getKeysFromStorage();
    const index = keys.findIndex(k => k.id === id);
    
    if (index !== -1) {
      const provider = this.getProviderConfig(keyData.providerId);
      keys[index] = {
        ...keys[index],
        providerName: provider.name,
        baseUrl: keyData.baseUrl || provider.baseUrl,
        models: keyData.models ? keyData.models.split(',').map(m => m.trim()) : keys[index].models,
        status: keyData.status || keys[index].status,
        updatedAt: new Date().toISOString()
      };
      
      if (keyData.apiKey) {
        keys[index].apiKey = this.encrypt(keyData.apiKey);
      }
      
      this.saveKeys(keys);
      this.updateStats();
    }
  }

  /**
   * Get provider configuration
   */
  getProviderConfig(providerId) {
    const configs = {
      'openai': {
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1',
        models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4-turbo'],
        icon: 'assets/img/openai.svg'
      },
      'deepseek': {
        name: 'DeepSeek',
        baseUrl: 'https://api.deepseek.com/v1',
        models: ['deepseek-chat', 'deepseek-coder', 'deepseek-vision'],
        icon: 'assets/img/deepseek.svg'
      },
      'anthropic': {
        name: 'Anthropic',
        baseUrl: 'https://api.anthropic.com',
        models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
        icon: 'assets/img/anthropic.svg'
      },
      'google': {
        name: 'Google AI',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        models: ['gemini-pro', 'gemini-pro-vision'],
        icon: 'assets/img/google.svg'
      }
    };
    return configs[providerId] || configs['openai'];
  }

  /**
   * Encrypt text (placeholder - uses basic encoding for demo)
   */
  encrypt(text) {
    // In production, use proper AES-GCM encryption
    // For now, we'll use a simple approach for demonstration
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    return Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Decrypt text (placeholder)
   */
  decrypt(encryptedText) {
    try {
      const bytes = new Uint8Array(encryptedText.match(/[0-9a-f]{2}/g).map(h => parseInt(h, 16)));
      const decoder = new TextDecoder();
      return decoder.decode(bytes);
    } catch {
      return encryptedText;
    }
  }

  /**
   * Copy configuration for use in apps
   */
  copyConfig(keyId) {
    const keys = this.getKeysFromStorage();
    const key = keys.find(k => k.id === keyId);
    
    if (key) {
      const config = {
        baseURL: key.baseUrl,
        models: key.models,
        apiKey: '[ENCRYPTED - View in Vault]'
      };
      
      navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      this.showNotification('Configuration copied to clipboard!', 'success');
    }
  }

  /**
   * Test API connection
   */
  async testConnection(keyId) {
    const keys = this.getKeysFromStorage();
    const key = keys.find(k => k.id === keyId);
    
    if (!key || !key.apiKey) {
      this.showNotification('No API key found', 'error');
      return false;
    }

    try {
      const response = await fetch(key.baseUrl + '/models', {
        headers: {
          'Authorization': `Bearer ${this.decrypt(key.apiKey)}`
        }
      });
      
      if (response.ok) {
        this.showNotification('Connection successful!', 'success');
        return true;
      } else {
        this.showNotification('Connection failed. Check your API key.', 'error');
        return false;
      }
    } catch (e) {
      this.showNotification('Network error. Please check your connection.', 'error');
      return false;
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 12px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: #fff;
      z-index: 1000;
      font-family: var(--font-display, 'Inter', sans-serif);
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  /**
   * Delete a key
   */
  deleteKey(keyId) {
    if (confirm('Are you sure you want to delete this API key?')) {
      const keys = this.getKeysFromStorage();
      const filtered = keys.filter(k => k.id !== keyId);
      this.saveKeys(filtered);
      this.updateStats();
      this.loadKeys();
    }
  }

  /**
   * Load profiles
   */
  loadProfiles() {
    const keys = this.getKeysFromStorage();
    const profiles = [...new Set(keys.map(k => k.profile || 'default'))];
    
    const list = document.getElementById('profiles-list');
    if (list) {
      list.innerHTML = profiles.map(p => `
        <div style="background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:16px;margin-bottom:12px">
          <h4 style="margin:0 0 8px;color:#fff">${p}</h4>
          <p style="color:#94a3b8;font-size:14px">${keys.filter(k => k.profile === p).length} keys</p>
        </div>
      `).join('');
    }
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Initialize vault when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.vault = new AIMindVault();
});