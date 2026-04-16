"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, type CartItem } from "@/context/CartContext";

interface Product {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  price: number;
  category: string;
  tags: string;
  fileFormat: string;
  imageUrl: string;
  featured: boolean;
  aiGenNote: string;
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem, hasItem } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = hasItem(product.id);

  // Reset "added" feedback
  useEffect(() => {
    if (added) {
      const t = setTimeout(() => setAdded(false), 3000);
      return () => clearTimeout(t);
    }
  }, [added]);

  const handleAddToCart = () => {
    if (inCart) return;
    const item: Omit<CartItem, "quantity"> = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      fileFormat: product.fileFormat,
    };
    addItem(item);
    setAdded(true);
  };

  const tags = product.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-indigo-600 dark:hover:text-indigo-400">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 capitalize">
          {product.category === "sticker-pack" ? "Sticker Packs" : product.category === "ebook" ? "Ebooks" : "Tools"}
        </Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Product image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          {product.imageUrl.endsWith(".svg") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
          {product.featured && (
            <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Product info */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 block">
            {product.category === "sticker-pack" ? "🎨 Sticker Pack" : product.category === "ebook" ? "📖 Ebook" : "🛠️ Tool / Template"}
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
            {product.title}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Price & CTA */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                📄 {product.fileFormat}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                inCart
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 cursor-default"
                  : added
                  ? "bg-green-500 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {inCart ? "✓ In Cart" : added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>

            {inCart && (
              <Link
                href="/cart"
                className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-3"
              >
                View Cart & Checkout →
              </Link>
            )}

            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
              🔒 Secure checkout via Stripe. Instant digital delivery after payment.
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-2 mb-5 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2">⚡ Instant download after purchase</li>
            <li className="flex items-center gap-2">📧 Delivery link also sent to your email</li>
            <li className="flex items-center gap-2">🔁 5 download attempts, valid 7 days</li>
            <li className="flex items-center gap-2">🌱 {product.aiGenNote}</li>
          </ul>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/shop?q=${encodeURIComponent(tag)}`}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Long description */}
      <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Product</h2>
        <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {product.longDesc}
        </div>
      </div>
    </div>
  );
}
