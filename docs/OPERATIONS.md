# Daily & Weekly Operations Checklist

> Assuming minimal human time — most operations are fully automated.

---

## What is Fully Automated ✅

| Task | How It Works |
|------|-------------|
| Order processing | Stripe handles payment capture |
| Database record creation | Stripe webhook → creates Order + OrderItem |
| Download token generation | Webhook handler creates secure tokens |
| Download link delivery | Nodemailer sends email with links immediately |
| Download expiry enforcement | `/api/download/[token]` checks date and attempt count |
| Product catalog | Seeded once from JSON; managed via Prisma Studio |
| Cart persistence | localStorage (client-side, zero server load) |

---

## Daily Checklist (5 minutes) 📅

- [ ] **Check for failed orders** — Review Stripe Dashboard → Payments for any failed/disputed charges
- [ ] **Check email delivery** — Review your SMTP provider's delivery logs for bounced emails
- [ ] **Check disk space** — If self-hosting, ensure `secure-downloads/` and `prisma/dev.db` have adequate space

```bash
# Quick order count check
npx tsx -e "
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from './src/generated/prisma/client';
const p = new PrismaClient({ adapter: new PrismaLibSql({ url: process.env.DATABASE_URL }) } as any);
const n = await p.order.count({ where: { status: 'paid', createdAt: { gte: new Date(Date.now()-86400000) } } });
console.log('Orders last 24h:', n);
await p.\$disconnect();
"
```

---

## Weekly Checklist (15 minutes) 📅

- [ ] **Review revenue** — Admin panel at `/admin` or Stripe Dashboard
- [ ] **Check for support emails** — Look for refund requests, download issues, etc.
- [ ] **Backup database** (if self-hosting SQLite):
  ```bash
  cp prisma/dev.db backups/dev-$(date +%Y%m%d).db
  ```
- [ ] **Review analytics** — If using Matomo/Plausible, check traffic sources and conversion rates
- [ ] **Check for dependency updates** (monthly is fine):
  ```bash
  npm outdated
  ```

---

## Monthly Tasks (30 minutes) 📅

- [ ] **Database backup** — Archive monthly database snapshot
- [ ] **Review legal pages** — Check if any policies need updating
- [ ] **Add new products** — Add to `data/products.json` and run `npm run seed`
- [ ] **Review Stripe disputes** — Stripe Dashboard → Disputes

---

## What Still Needs Manual Review ⚠️

| Situation | Action Required |
|-----------|----------------|
| Refund requests | Review via email, issue refund via Stripe Dashboard |
| Chargebacks/disputes | Respond through Stripe with order evidence |
| Download issues | Manually re-send download link or extend token expiry in DB |
| Spam orders | Review via Stripe radar / block cards |
| Support questions | Reply to emails |

---

## Adding New Products

```bash
# 1. Add to data/products.json (copy existing structure)
# 2. Place the file in secure-downloads/
# 3. Run seed (skips existing, only adds new)
npm run seed

# 4. Optionally add a product image to public/images/products/
```

---

## Generating AI Content

### Ebook outline pattern (use with ChatGPT, Claude, etc.):
```
Create a comprehensive ebook outline for "[TITLE]" targeted at [AUDIENCE].
Structure: 10 chapters with 3-5 sections each.
Include: introduction, actionable tips, examples, and a conclusion.
All content should be original and educational.
Format: Markdown.
License: CC0 (public domain).
```

### Sticker pack image prompts (use with Midjourney, DALL-E, Stable Diffusion):
```
[THEME] digital sticker, [STYLE: flat/watercolor/line-art], 
[COLORS], transparent background PNG, high resolution 2048x2048,
commercial use allowed, no text, clean edges
```

### Tool/template generation:
```
Create a printable [PLANNER TYPE] template in A4/Letter format.
Include: [SECTIONS]. Design should be clean and minimal.
Provide the content as structured text for layout in Canva or similar.
```

---

## Extending the Store

### Add PayPal as alternative payment
- Install `@paypal/paypal-js` (free SDK)
- Create `/api/checkout/paypal/route.ts` using the PayPal Orders API
- PayPal pricing: 3.49% + fixed fee (higher than Stripe but broader reach)

### Add email marketing
- Install [Listmonk](https://listmonk.app) on your VPS (free, self-hosted)
- Export customer emails from orders: `SELECT DISTINCT customerEmail FROM "Order" WHERE status='paid'`
- Or use Brevo/Mailchimp free tier for newsletters

### Add self-hosted analytics
```bash
# Install Plausible CE (self-hosted, free)
git clone https://github.com/plausible/community-edition
# Follow setup at https://github.com/plausible/community-edition

# Or install Matomo on your VPS
# https://matomo.org/faq/on-premise/
```

Add to `next.config.ts`:
```env
NEXT_PUBLIC_ANALYTICS_URL="https://analytics.yourstore.com"
NEXT_PUBLIC_ANALYTICS_SITE_ID="1"
```

### Add admin authentication
```bash
npm install next-auth@beta
```
Create `src/app/api/auth/[...nextauth]/route.ts` with simple credentials provider and add middleware to protect `/admin`.

### Switch to PostgreSQL for production
1. Update `prisma/schema.prisma`: change `provider = "sqlite"` to `provider = "postgresql"`
2. Set `DATABASE_URL="postgresql://..."` in `.env`
3. Update `src/lib/prisma.ts` to use `@prisma/adapter-pg` instead of `@prisma/adapter-libsql`
4. Run `npx prisma migrate dev`
5. Re-seed: `npm run seed`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Download link not working | Check `Download` table in Prisma Studio — verify `expiresAt` and `downloadCount` |
| Email not received | Check SMTP logs, verify `SMTP_*` env vars, check spam folder |
| Stripe webhook not firing | Run `stripe listen` locally, check `STRIPE_WEBHOOK_SECRET` |
| Build fails | Check `.env` for missing required vars, run `npx prisma generate` |
| "No such table" error | Run `npx prisma migrate dev` then `npm run seed` |

---

## Environment Variables Reference

```env
# Required
DATABASE_URL              # SQLite file path or PostgreSQL URL
STRIPE_SECRET_KEY         # Stripe secret key (sk_live_ or sk_test_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Stripe publishable key
STRIPE_WEBHOOK_SECRET     # Stripe webhook signing secret
NEXT_PUBLIC_BASE_URL      # Your store URL (no trailing slash)

# Required for email delivery
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
SMTP_FROM

# Optional
STORE_NAME                # Displayed in emails (default: "MindfulStore")
DOWNLOAD_EXPIRY_DAYS      # Days links are valid (default: 7)
DOWNLOAD_MAX_ATTEMPTS     # Max downloads per link (default: 5)
NEXT_PUBLIC_ANALYTICS_URL # Self-hosted analytics URL
NEXT_PUBLIC_ANALYTICS_SITE_ID  # Analytics site ID
```
