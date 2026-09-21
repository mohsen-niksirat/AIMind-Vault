# AIMind Vault

A secure, privacy-first dashboard for managing your AI API keys across multiple providers.

## Why AIMind Vault?

Struggling with scattered API keys for OpenAI, Anthropic, Google, DeepSeek, and others? Never lose access to your credentials again with our smart management system.

## Features

- **Encrypted Storage**: All keys are encrypted locally using Web Crypto API
- **Multi-Provider Support**: OpenAI, Anthropic, Google, DeepSeek, and more
- **Profile Management**: Create separate profiles for work, freelance, and personal use
- **Quick Access**: Copy API URLs, models, and configurations instantly
- **Cost Tracking**: Track usage limits and estimate costs
- **Offline First**: Works without a server - everything stays on your device

## Quick Start

```bash
# Clone the repository
git clone https://github.com/mohsen-niksirat/AIMind-Vault.git
cd AIMind-Vault

# Open in browser
open index.html
```

Or simply double-click on `index.html` - no server needed!

## Usage

1. Click "Add New Key" to add your API credentials
2. Select your provider (OpenAI, DeepSeek, etc.)
3. Enter your API key - it's encrypted automatically
4. Access your keys anytime from the dashboard
5. Click "Copy Config" to get pre-formatted settings for your IDE

## Security

- No data leaves your device
- Keys encrypted with AES-256-GCM
- Master password optional for extra protection
- Local storage only - no server sync

## Supported Providers

| Provider | Base URL | Default Models |
|----------|----------|----------------|
| OpenAI | api.openai.com | gpt-4, gpt-3.5-turbo |
| Anthropic | api.anthropic.com | claude-3-opus, claude-3-sonnet |
| DeepSeek | api.deepseek.com | deepseek-chat, deepseek-coder |
| Google | generativelanguage.googleapis.com | gemini-pro |

## Development

```bash
# Run tests
npm test

# Lint
npm run lint
```

## Contributing

Contributions are welcome! Feel free to submit a PR for new providers or features.

## License

MIT - Free to use, modify, and distribute.

---

Create your own vault at [AIMind-Vault](https://github.com/mohsen-niksirat/AIMind-Vault)