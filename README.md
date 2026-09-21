# 🔐 AIMind Vault

**Secure, client-side dashboard for managing your AI API keys.**

[فارسی](#فارسی) · [English](#english)

---

## English

A privacy-first vault for AI API keys — OpenAI, DeepSeek, Anthropic, Google, plus **custom providers** and **free community APIs**. All data is encrypted in the browser and never leaves your device.

### Features

- **All providers in one dashboard** — built-in (OpenAI, DeepSeek, Anthropic, Google AI), free community APIs (Qwen, Gemini guest, GLM, DeepSeek V4.1 Flash), and your own custom providers
- **Custom providers** — add any provider with its name, base URL, and model list
- **Multiple profiles per provider** — separate keys for work, personal, and dev under the same provider
- **One-click save & copy** — copy the full config (baseURL + models + key) to paste into your IDE or tool
- **Encrypted storage** — keys encrypted client-side; nothing is sent anywhere
- **Backup** — export/import your vault as JSON
- **Bilingual** — English and Persian (فارسی) interfaces

### Quick start

No build step. Open `index.html` directly in a browser, or visit the deployed site:

```
https://mohsen-niksirat.github.io/AIMind-Vault/
```

### Pages

| File | Purpose |
|------|---------|
| `index.html` | Dashboard — all saved keys |
| `key-manager.html` | Add/edit a key (all providers in the dropdown) |
| `providers.html` | Manage built-in, free, and custom providers |
| `profile.html` | Profiles |
| `settings.html` | Settings, export/import |
| `fa.html` | Persian landing page |

### Add a custom provider

1. Open `providers.html` → **Add Provider**
2. Enter name, base URL, and models (comma separated)
3. Save — it now appears in the key-manager dropdown

### Deploy

GitHub Pages is configured via `.github/workflows/deploy.yml` and publishes from the **`master`** branch on every push.

---

## فارسی

یک داشبورد امن و سمت-کاربر برای مدیریت کلیدهای API هوش مصنوعی.

### امکانات

- **تمام ارائه‌دهندگان در یک داشبورد** — OpenAI، DeepSeek، Anthropic، Google AI، APIهای رایگان جامعه (Qwen، Gemini مهمان، GLM، DeepSeek V4.1 Flash) و ارائه‌دهندگان سفارشی شما
- **ارائه‌دهنده سفارشی** — هر ارائه‌دهنده‌ای را با نام، آدرس پایه و لیست مدل‌ها اضافه کنید
- **چند پروفایل برای هر ارائه‌دهنده** — کلیدهای جداگانه برای کار، شخصی و توسعه
- **ذخیره و کپی با یک کلیک** — کانفیگ کامل را کپی کنید
- **رمزگذاری سمت کاربر** — کلیدها در مرورگر رمزگذاری می‌شوند و جایی ارسال نمی‌شوند
- **بکاپ** — خروجی/ورودی JSON
- **دوزبانه** — انگلیسی و فارسی

### شروع سریع

بدون نیاز به بیلد. فایل `index.html` را در مرورگر باز کنید یا به سایت منتشرشده بروید:

```
https://mohsen-niksirat.github.io/AIMind-Vault/
```

### افزودن ارائه‌دهنده سفارشی

1. صفحه `providers.html` را باز کنید → **Add Provider**
2. نام، آدرس پایه و مدل‌ها را وارد کنید
3. ذخیره کنید — حالا در منوی کشی مدیر کلید ظاهر می‌شود

### انتشار

GitHub Pages از طریق `.github/workflows/deploy.yml` پیکربندی شده و از شاخه **`master`** در هر پوش منتشر می‌شود.

---

## License

MIT
