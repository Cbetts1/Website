import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, active: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

const CATEGORIES = [
  {
    key: "ebook",
    label: "Ebooks",
    emoji: "📖",
    desc: "In-depth guides on productivity, wellness, and personal growth.",
    color: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
  },
  {
    key: "sticker-pack",
    label: "Sticker Packs",
    emoji: "🎨",
    desc: "Beautiful AI-generated digital stickers for planners and journals.",
    color: "from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800",
    text: "text-pink-700 dark:text-pink-300",
  },
  {
    key: "tool",
    label: "Tools & Templates",
    emoji: "🛠️",
    desc: "Practical planners, trackers, and templates for every area of life.",
    color: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800",
    text: "text-green-700 dark:text-green-300",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-gray-950 dark:to-purple-950 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>✨</span> AI-generated digital products — instant download
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Live More{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Intentionally</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Ebooks, digital sticker packs, and productivity templates designed to help you build better habits, reduce stress, and create a life you love.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900"
            >
              Browse All Products
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/shop?category=ebook"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-semibold px-6 py-3 rounded-xl border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
            >
              📖 Browse Ebooks
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-12 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "⚡", label: "Instant Delivery", desc: "Download immediately after purchase" },
              { icon: "🔒", label: "Secure Checkout", desc: "Powered by Stripe — your data is safe" },
              { icon: "♾️", label: "Lifetime Access", desc: "Download links valid for 7 days, 5 uses" },
              { icon: "🌱", label: "Open Licensed", desc: "CC0 — free for personal & commercial use" },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="p-4">
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">{label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/shop?category=${cat.key}`}
                className={`bg-gradient-to-br ${cat.color} border rounded-2xl p-6 hover:shadow-md transition-shadow`}
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <h3 className={`font-bold text-lg ${cat.text} mb-1`}>{cat.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                ⭐ Featured Products
              </h2>
              <Link href="/shop" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to start your mindful journey?
          </h2>
          <p className="text-indigo-100 mb-8">
            Explore our full catalog of AI-generated ebooks, sticker packs, and productivity tools.
            All products are open-licensed and available for instant download.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Shop Now — Starting at $3.99
          </Link>
        </div>
      </section>
    </>
  );
}
