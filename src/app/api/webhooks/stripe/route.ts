import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, type DownloadItem } from "@/lib/email";
import { addDays } from "date-fns";
import type Stripe from "stripe";

// Required for Stripe raw body verification
export const runtime = "nodejs";

function addDaysFallback(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function safeAddDays(date: Date, days: number): Date {
  try {
    return addDays(date, days);
  } catch {
    return addDaysFallback(date, days);
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { metadata } = session;
  if (!metadata) return;

  const { customerName, customerEmail, productIds } = metadata;
  if (!customerName || !customerEmail || !productIds) return;

  // Idempotency: skip if order already exists
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
  });
  if (existing) return;

  const productIdList = productIds.split(",");
  const products = await prisma.product.findMany({
    where: { id: { in: productIdList } },
  });

  const total = session.amount_total ? session.amount_total / 100 : 0;

  // Create order
  const order = await prisma.order.create({
    data: {
      stripeSessionId: session.id,
      stripePaymentId: session.payment_intent as string | undefined,
      customerEmail,
      customerName,
      status: "paid",
      total,
      currency: session.currency ?? "usd",
      orderItems: {
        create: products.map((p) => ({
          productId: p.id,
          price: p.price,
        })),
      },
    },
  });

  const expiryDays = parseInt(process.env.DOWNLOAD_EXPIRY_DAYS ?? "7");
  const maxDownloads = parseInt(process.env.DOWNLOAD_MAX_ATTEMPTS ?? "5");
  const expiresAt = safeAddDays(new Date(), expiryDays);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  // Create download tokens
  const downloadItems: DownloadItem[] = [];
  for (const product of products) {
    const dl = await prisma.download.create({
      data: {
        orderId: order.id,
        productId: product.id,
        expiresAt,
        maxDownloads,
      },
    });

    downloadItems.push({
      productTitle: product.title,
      downloadUrl: `${baseUrl}/downloads/${dl.token}`,
      expiresAt: expiresAt.toLocaleDateString(),
    });
  }

  // Send confirmation email (non-blocking — log errors but don't fail webhook)
  try {
    await sendOrderConfirmationEmail(customerEmail, customerName, order.id, downloadItems);
  } catch (emailErr) {
    console.error("Failed to send order confirmation email:", emailErr);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === "paid") {
          await handleCheckoutComplete(session);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const existing = await prisma.order.findUnique({
          where: { stripeSessionId: session.id },
        });
        if (existing) {
          await prisma.order.update({
            where: { id: existing.id },
            data: { status: "failed" },
          });
        }
        break;
      }
      default:
        // Ignore unhandled events
        break;
    }
  } catch (err) {
    console.error(`Error handling webhook event ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
