# AIMind Vault - Project Design Document

## Style Anchor
**Modern AI Dashboard** - Similar to Vercel Dashboard / OpenAI Platform UI with clean, minimal design for managing AI API keys.

## Palette
- Background: #0a0a0a (deep dark)
- Ink: #e5e5e5 (light gray)
- Accent: #10b981 (emerald green for success/confirm)

## Typography
- Latin: Inter (400/500/600/700)
- CJK: System UI fallback
- Title: 24px medium, Body: 14px regular, Caption: 12px light

## Layout System
- Container: 1200px max-width with 24px padding
- Grid: 12-column responsive grid
- Spacing: 8px baseline grid
- Density: Medium (comfortable interaction)

## Core Components

### 1. Key Card
- Display: Provider name, model availability, usage limits
- Actions: Copy, Edit, Delete
- Status indicator: Active/Restricted

### 2. Provider Form
- Fields: API URL, Models (multi-select), Token limit
- Encryption toggle
- Test connection button

### 3. Profile Panel
- Saved profiles (Personal, Work, Development)
- Quick switch capability
- Export/import functionality

## Slide Manifest
1. **index.html** - Dashboard showing all API keys with status
2. **key-manager.html** - Form to add/edit keys with encryption options
3. **profile.html** - Manage multiple user profiles
4. **settings.html** - Account and notification settings

## Image Manifest
- hero-key.svg - Key icon for brand
- lock-icon.svg - Encryption indicator
- No external images required

## Technical Decisions
- Vanilla JavaScript (no framework for simplicity)
- Web Crypto API for encryption
- LocalStorage for initial storage (upgradeable to IndexedDB)
- Responsive CSS Grid for layout