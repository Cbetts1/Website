import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-3">
              <span className="text-xl">🧘</span>
              <span>MindfulStore</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Premium digital products for mindful living and intentional productivity.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              All products are AI-generated and open-licensed (CC0).
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">Shop</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop?category=ebook", label: "Ebooks" },
                { href: "/shop?category=sticker-pack", label: "Sticker Packs" },
                { href: "/shop?category=tool", label: "Tools & Templates" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/legal/refunds", label: "Refund Policy" },
                { href: "/legal/terms", label: "Terms of Service" },
                { href: "/legal/privacy", label: "Privacy Policy" },
                { href: "/legal/cookies", label: "Cookie Notice" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500 dark:text-gray-400">
                📦 Instant digital delivery
              </li>
              <li className="text-gray-500 dark:text-gray-400">
                🔒 Secure checkout via Stripe
              </li>
              <li className="text-gray-500 dark:text-gray-400">
                📧 Email delivery included
              </li>
              <li className="text-gray-500 dark:text-gray-400">
                🌱 Open-source stack (MIT)
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {year} MindfulStore. Built with Next.js, Tailwind CSS, Prisma, and Stripe. Open-source (MIT).
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            All digital products are AI-generated. Content is for educational and personal use only.
          </p>
        </div>
      </div>
    </footer>
  );
}
