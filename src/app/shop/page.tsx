import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}

export const metadata: Metadata = {
  title: "Shop All Digital Products",
  description: "Browse our full catalog of ebooks, digital sticker packs, and productivity templates.",
};

const CATEGORY_LABELS: Record<string, string> = {
  ebook: "📖 Ebooks",
  "sticker-pack": "🎨 Sticker Packs",
  tool: "🛠️ Tools & Templates",
};

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const { category, q, sort } = params;

  const where = {
    active: true,
    ...(category ? { category } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { shortDesc: { contains: q } },
            { tags: { contains: q } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({ where, orderBy });
  const totalCount = products.length;

  const title = category
    ? CATEGORY_LABELS[category] ?? category
    : q
    ? `Search: "${q}"`
    : "All Products";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {totalCount} product{totalCount !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <form method="GET" action="/shop" className="flex-1">
          {category && <input type="hidden" name="category" value={category} />}
          <div className="relative">
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
        </form>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "", label: "All" },
            { key: "ebook", label: "📖 Ebooks" },
            { key: "sticker-pack", label: "🎨 Stickers" },
            { key: "tool", label: "🛠️ Tools" },
          ].map(({ key, label }) => (
            <a
              key={key}
              href={key ? `/shop?category=${key}` : "/shop"}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                (category ?? "") === key
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400"
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Sort */}
        <form method="GET" action="/shop">
          {category && <input type="hidden" name="category" value={category} />}
          {q && <input type="hidden" name="q" value={q} />}
          <select
            name="sort"
            defaultValue={sort ?? ""}
            onChange={undefined}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            aria-label="Sort products"
          >
            <option value="">Sort: Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </form>
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No products found</h2>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter.</p>
          <a href="/shop" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
            Clear filters
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
