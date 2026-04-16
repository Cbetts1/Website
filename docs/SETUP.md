# MindfulStore — Setup & Run Guide

> **AI-Generated E-Commerce Store** | Next.js · Tailwind CSS · Prisma · SQLite · Stripe

MindfulStore is a fully functional, legally-structured e-commerce site selling AI-generated digital products (ebooks, sticker packs, productivity tools). Everything is open-source except Stripe (required only for payment processing; completely free to integrate — you pay per transaction, not per month).

---

## 1. Prerequisites

### Accounts & Services
- **Stripe account** (free) — [https://stripe.com](https://stripe.com)
  - Get your test API keys from the Dashboard → Developers → API Keys
  - Create a webhook endpoint (see Step 3)
- **SMTP email provider** (free tiers available):
  - [Brevo (Sendinblue)](https://brevo.com) — free up to 300 emails/day
  - [Mailgun](https://mailgun.com) — free sandbox for testing
  - Gmail App Password — works for low volume
  - For development, [Ethereal](https://ethereal.email) creates free test accounts

### Tools to Install
- **Node.js** ≥ 20 — [https://nodejs.org](https://nodejs.org)
- **npm** ≥ 9 (comes with Node.js)
- **Git** — [https://git-scm.com](https://git-scm.com)
- Optional: **Prisma Studio** (included via `npm run db:studio`)

---

## 2. Setting Up the Codebase

```bash
# Clone the repository
git clone https://github.com/Cbetts1/Website.git
cd Website

# Install dependencies
npm install

# Copy the environment file and fill in your values
cp .env.example .env
```

Edit `.env` with your real values:

```env
DATABASE_URL="file:./prisma/dev.db"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
STORE_NAME="MindfulStore"
SMTP_HOST="smtp.brevo.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your@email.com"
SMTP_PASS="your_smtp_password"
SMTP_FROM="MindfulStore <noreply@yourstore.com>"
```

### Initialize the Database

```bash
# Run the Prisma migration to create tables
npx prisma migrate dev

# Seed with all 36 products (10 ebooks, 20 sticker packs, 10 tools)
npm run seed
```

### Start Development Server

```bash
npm run dev
# Open http://localhost:3000
```

---

## 3. Configuring Stripe Payments

### Get API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys
2. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** → `STRIPE_SECRET_KEY`

### Set Up Webhooks (for automated order fulfillment)

**Development:**
```bash
# Install the Stripe CLI (free)
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook secret printed → STRIPE_WEBHOOK_SECRET
```

**Production:**
1. Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://yourstore.com/api/webhooks/stripe`
3. Events to listen for:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
4. Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

---

## 4. Generating and Importing Products

### Current Product Catalog (pre-seeded)
- **10 Ebooks**: Morning routines, deep work, anxiety toolkit, solopreneur systems, meal prep, finances, digital declutter, creativity, sleep, minimalism
- **20 Sticker Packs**: Morning affirmations, productivity icons, botanicals, mindfulness quotes, goals, self-care, seasonal, celestial, study, fitness, travel, food, gratitude, budget, doodles, reading, and more
- **10 Tools & Templates**: Daily planner, habit tracker, weekly review, brain dump, goal workbook, budget spreadsheet, project planner, meal planning, content creator toolkit, wellness tracker

### Adding New Products via CSV/JSON

1. Add products to `data/products.json` following the existing schema
2. Re-run the seed: `npm run seed` (it skips existing slugs)

**Product JSON schema:**
```json
{
  "slug": "unique-url-slug",
  "title": "Product Title",
  "shortDesc": "Short description (1-2 sentences)",
  "longDesc": "Detailed description for the product page",
  "price": 9.99,
  "category": "ebook | sticker-pack | tool",
  "tags": "comma,separated,tags",
  "fileFormat": "PDF | ZIP (PNG Pack) | etc.",
  "filePath": "relative/path/from/secure-downloads/",
  "imageUrl": "/images/products/product-image.svg",
  "featured": false,
  "aiGenNote": "Content is AI-generated. License: CC0."
}
```

### Adding Real Product Files

Place your actual downloadable files in the `secure-downloads/` directory:
```
secure-downloads/
├── ebooks/
│   ├── mindful-morning-mastery.pdf
│   └── ...
├── stickers/
│   └── morning-affirmations-pack.zip
└── tools/
    └── daily-planner-template.zip
```

These files are **never** publicly accessible — they are served only through the secure download API (`/api/download/[token]`) after a verified purchase.

### AI Image Generation Prompts

For generating actual product cover images, use these prompt patterns:

**Ebook covers:**
```
Professional ebook cover, [TOPIC] theme, minimalist design, [COLOR] palette, 
modern sans-serif typography, clean layout, digital product, 1600x2400px, 
flat illustration style
```

**Sticker pack previews:**
```
Digital sticker pack preview collage, [THEME] stickers arranged in grid, 
transparent background, vibrant colors, commercial use, high resolution
```

---

## 5. Deploying and Testing

### Local Testing (Stripe Test Mode)
1. Set up the Stripe CLI for local webhooks (see Step 3)
2. Use Stripe's test card: `4242 4242 4242 4242`, any future expiry, any CVC
3. Complete a test purchase and verify:
   - Order appears in your database (`npm run db:studio`)
   - Download links work at `/downloads/[token]`
   - Email is received (check Ethereal inbox if using test SMTP)

### Production Deployment

#### Option A: VPS (Recommended — full control)
```bash
# On Ubuntu/Debian VPS (e.g., DigitalOcean Droplet, Hetzner, Linode)
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/Cbetts1/Website.git /app/mindfulstore
cd /app/mindfulstore
npm install
cp .env.example .env
# Edit .env with production values

# Build the app
npm run build

# Start with PM2 (process manager)
npm install -g pm2
pm2 start npm --name mindfulstore -- start
pm2 startup
pm2 save

# For HTTPS, use Nginx + Let's Encrypt
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d yourstore.com
```

#### Option B: Railway / Render (Free tier PaaS)
1. Push to GitHub (already done)
2. Connect Railway/Render to your GitHub repo
3. Set all environment variables in the platform dashboard
4. Set build command: `npm run build`
5. Set start command: `npm start`
6. For SQLite: Railway/Render support persistent disk — mount at `/app/prisma`

#### Option C: Vercel (Easiest, free tier)
```bash
npm install -g vercel
vercel --prod
```
> **Note:** Vercel's free tier doesn't support SQLite (ephemeral filesystem). Upgrade to PostgreSQL:
> ```
> DATABASE_URL="postgresql://user:pass@host:5432/mindfulstore"
> ```
> Then update `prisma/schema.prisma` to use `provider = "postgresql"`.

### Post-Deploy Checklist
- [ ] Change `NEXT_PUBLIC_BASE_URL` to your production domain
- [ ] Switch Stripe to live mode keys
- [ ] Set up production webhook endpoint in Stripe dashboard
- [ ] Configure real SMTP for email delivery
- [ ] Test end-to-end with a real $0.50 test purchase
- [ ] Add actual product files to `secure-downloads/`
- [ ] Review and customize all legal pages with a lawyer
- [ ] Add admin authentication (see `src/app/admin/page.tsx`)

---

## Admin Panel

Visit `/admin` for the dashboard with:
- Revenue and order statistics
- Recent orders with customer info
- Top-selling products
- Links to Prisma Studio and the products API

> ⚠️ **Important:** Add authentication to `/admin` before deploying to production. Consider using Next.js middleware with a password or an auth library like [NextAuth.js](https://next-auth.js.org/) (free, open-source).

---

## Tech Stack Summary

| Layer | Technology | License |
|-------|-----------|---------|
| Frontend | Next.js 16 + React 19 | MIT |
| Styling | Tailwind CSS 4 | MIT |
| Backend | Next.js API Routes | MIT |
| Database | SQLite + Prisma 7 | MIT / Apache 2 |
| Payment | Stripe (JS SDK) | MIT (SDK) |
| Runtime | Node.js 20+ | MIT |

**What's free/open-source:** Everything except Stripe transaction fees (2.9% + $0.30 per successful charge — no monthly fee).
