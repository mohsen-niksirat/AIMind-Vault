# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-09-22

### Added
- Initial project setup
- Dashboard page (`index.html`) with key overview
- Key manager page (`key-manager.html`) for adding/editing API keys
- Profile management page (`profile.html`)
- Settings page (`settings.html`) for configuration
- Features page (`features.html`) showcasing capabilities
- Secure encryption for API keys using Web Crypto API
- Multi-provider support: OpenAI, DeepSeek, Anthropic, Google AI
- Copy configuration feature for easy integration
- Responsive design with mobile navigation
- Dark theme optimized for developer experience

### Security
- All keys stored locally in browser storage (localStorage)
- AES-256-like encryption (placeholder for production)
- No data leaves the user's device

### Technologies
- Pure HTML5, CSS3, and vanilla JavaScript
- No build tools or frameworks required
- MIT Licensed