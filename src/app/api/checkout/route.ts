import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

interface CheckoutItem {
  id: string;
  quantity: number;
}

interface CheckoutBody {
  items: CheckoutItem[];
  customerName: string;
  customerEmail: string;
}

export async function POST(request: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { items, customerName, customerEmail } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!customerName?.trim() || !customerEmail?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Fetch products from DB (never trust client-side prices)
  const productIds = items.map((i) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "One or more products are unavailable" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: customerEmail,
    mode: "payment",
    line_items: products.map((product) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100), // cents
        product_data: {
          name: product.title,
          description: product.shortDesc.slice(0, 500),
          images: product.imageUrl.startsWith("/")
            ? [`${baseUrl}${product.imageUrl}`]
            : [product.imageUrl],
          metadata: {
            productId: product.id,
            productSlug: product.slug,
          },
        },
      },
      quantity: 1,
    })),
    metadata: {
      customerName,
      customerEmail,
      productIds: productIds.join(","),
    },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart`,
    // Collect billing address for tax compliance
    billing_address_collection: "auto",
  });

  return NextResponse.json({ url: session.url });
}
