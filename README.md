# 🧘 MindfulStore

> **A fully functional, legally compliant, open-source e-commerce store for AI-generated digital products.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-blue)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-white)](https://prisma.io)

---

## Overview

MindfulStore is a **Mindful Productivity & Digital Wellness** theme e-commerce platform selling digital products:

- 📖 **10 Ebooks** — Morning routines, deep work, anxiety toolkit, finances, minimalism, and more
- 🎨 **20 Sticker Packs** — Botanicals, affirmations, productivity icons, celestial, seasonal, and more
- 🛠️ **10 Tools & Templates** — Daily planners, habit trackers, goal workbooks, budget spreadsheets

All content is **AI-generated** or from **CC0/public-domain** sources — no copyright concerns.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Product catalog with categories, search, and sort | ✅ |
| Shopping cart (persistent via localStorage) | ✅ |
| Stripe Checkout integration (PCI-compliant) | ✅ |
| Automated digital delivery via secure download tokens | ✅ |
| Order confirmation email with download links | ✅ |
| Download expiry and attempt limits | ✅ |
| Admin dashboard with revenue and order stats | ✅ |
| Legal pages (Terms, Privacy, Refund, Cookies) | ✅ |
| Cookie consent banner | ✅ |
| Mobile-first responsive design | ✅ |
| Security headers (X-Frame, CSRF, etc.) | ✅ |
| Dark mode support | ✅ |

---

## 🏗 Tech Stack

| Layer | Technology | License |
|-------|-----------|---------|
| Frontend | Next.js 16 + React 19 | MIT |
| Styling | Tailwind CSS 4 | MIT |
| Backend | Next.js API Routes | MIT |
| Database | SQLite + Prisma 7 | MIT / Apache 2 |
| DB Adapter | @prisma/adapter-libsql | MIT |
| Payment | Stripe (SDK free; pay per transaction) | MIT SDK |
| Email | Nodemailer | MIT |
| Date utilities | date-fns | MIT |

**100% open-source** except Stripe (free to integrate; 2.9% + $0.30 per transaction).

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone https://github.com/Cbetts1/Website.git
cd Website
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Stripe keys and SMTP settings

# 3. Create database and seed products
npx prisma migrate dev
npm run seed

# 4. Start development
npm run dev
# → http://localhost:3000
```

See [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

---

## 📁 Project Structure

```
/
├── data/
│   └── products.json          # All 36 product definitions
├── docs/
│   ├── SETUP.md               # Full setup & deploy guide
│   └── OPERATIONS.md          # Daily/weekly operations checklist
├── prisma/
│   ├── schema.prisma           # DB schema: Product, Order, OrderItem, Download
│   └── migrations/             # SQL migrations
├── public/
│   └── images/products/        # Product placeholder SVGs
├── scripts/
│   └── seed.ts                 # Product seeder
├── secure-downloads/           # Product files (served via secure API only)
│   ├── ebooks/
│   ├── stickers/
│   └── tools/
└── src/
    ├── app/
    │   ├── page.tsx            # Home page
    │   ├── shop/               # Product listing + detail pages
    │   ├── cart/               # Shopping cart
    │   ├── checkout/           # Checkout (Stripe redirect)
    │   ├── success/            # Post-payment success page
    │   ├── downloads/[token]/  # Secure download page
    │   ├── admin/              # Admin dashboard
    │   ├── legal/              # Terms, Privacy, Refund, Cookies pages
    │   └── api/
    │       ├── products/       # Products REST API
    │       ├── checkout/       # Create Stripe checkout session
    │       ├── download/[token]/ # Serve file securely
    │       └── webhooks/stripe/ # Stripe webhook handler
    ├── components/
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   ├── ProductCard.tsx
    │   ├── ProductDetail.tsx
    │   └── CookieBanner.tsx
    ├── context/
    │   └── CartContext.tsx      # Global cart state
    └── lib/
        ├── prisma.ts            # Prisma client singleton
        ├── stripe.ts            # Stripe client
        └── email.ts             # Nodemailer email sender
```

---

## 📦 Product Catalog

### 📖 Ebooks (10 products, $9.99–$14.99)
1. Mindful Morning Mastery: 30 Days to a Transformative Routine
2. Deep Work in the Digital Age: Focus Strategies for Distracted Minds
3. The Anxiety Toolkit: Evidence-Based Strategies for Everyday Calm
4. Solopreneur Systems: Build a Business That Runs Without You
5. Plant-Based Meal Prep Made Simple: 4-Week Plan for Busy People
6. Financial Freedom Roadmap: From Debt to Financial Independence
7. Digital Declutter: Reclaim Your Focus by Simplifying Your Digital Life
8. Creative Unblocked: Overcome Creative Blocks and Reignite Your Inspiration
9. The Better Sleep Blueprint: Science-Based Strategies for Restorative Rest
10. The Minimalist Home: A Room-by-Room Guide to Intentional Living

### 🎨 Sticker Packs (20 products, $3.99–$5.99)
Morning Affirmations · Productivity Icons · Watercolor Botanicals · Mindfulness Quotes · Goal-Setting · Self-Care Sunday · Seasonal Planner · Moon Phases & Celestial · Study & School · Fitness & Workout · Travel & Adventure · Food & Recipe · Gratitude & Positivity · Budget & Finance · Pastel Doodle · Reading & Book Club · and more

### 🛠️ Tools & Templates (10 products, $5.99–$9.99)
Ultimate Daily Planner · 90-Day Habit Tracker · Weekly Review System · Brain Dump & Journaling Kit · Annual Goal Setting Workbook · Budget & Net Worth Tracker · Freelance Project Planner · Monthly Meal Planning System · Content Creator Toolkit · Sleep & Wellness Tracker

---

## ⚖️ Legal

All legal page templates included in `src/app/legal/`:
- **Terms of Service** — Purchase terms, digital goods policy, IP
- **Privacy Policy** — GDPR-style, covers Stripe + email data use
- **Refund Policy** — Digital goods policy with exception cases
- **Cookie Notice** — localStorage usage, Stripe cookies, analytics

> ⚠️ These are AI-generated templates. **Review with a legal professional** before real-world use.

---

## 🔒 Security Features

- Server-side price validation (client prices never trusted)
- Stripe webhook signature verification
- Cryptographically random download tokens (CUID)
- Download expiry (7 days) and attempt limits (5 uses)
- Path traversal prevention on file downloads
- Security HTTP headers (X-Frame-Options, CSP, etc.)
- No sensitive data in client-side code

---

## 🤝 Contributing

This project is open-source under the MIT license. Contributions welcome!

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

All AI-generated product content (ebooks, sticker prompts, templates) is released under CC0 (Public Domain).

---

## 🙏 Attribution

Built with:
- [Next.js](https://nextjs.org) by Vercel
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://prisma.io)
- [Stripe](https://stripe.com)
- [Nodemailer](https://nodemailer.com)
- [libsql](https://github.com/libsql/libsql)
