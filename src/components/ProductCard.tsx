"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, type CartItem } from "@/context/CartContext";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    shortDesc: string;
    price: number;
    category: string;
    tags: string;
    fileFormat: string;
    imageUrl: string;
    featured: boolean;
  };
}

const CATEGORY_EMOJI: Record<string, string> = {
  ebook: "📖",
  "sticker-pack": "🎨",
  tool: "🛠️",
};

const CATEGORY_COLOR: Record<string, string> = {
  ebook: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "sticker-pack": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  tool: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, hasItem } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = hasItem(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-shadow duration-200 flex flex-col">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        {/* Use standard img for SVG placeholders; Next.js Image for real photos */}
        {product.imageUrl.endsWith(".svg") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {product.featured && (
          <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
            ⭐ Featured
          </span>
        )}
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[product.category] ?? "bg-gray-100 text-gray-700"}`}>
          {CATEGORY_EMOJI[product.category]} {product.category === "sticker-pack" ? "Stickers" : product.category === "ebook" ? "Ebook" : "Tool"}
        </span>
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2 flex-1">
          {product.shortDesc}
        </p>
        <div className="text-xs text-gray-400 dark:text-gray-500 mb-3">
          📄 {product.fileFormat}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-lg text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={inCart}
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              inCart
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 cursor-default"
                : added
                ? "bg-green-500 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
            }`}
          >
            {inCart ? "✓ In Cart" : added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
