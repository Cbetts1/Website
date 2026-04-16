import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: "noindex, nofollow",
};

// NOTE: In production, secure this route with authentication middleware.
// This is a read-only dashboard for demonstration purposes.

export default async function AdminPage() {
  const [
    totalOrders,
    paidOrders,
    totalProducts,
    recentOrders,
    topProducts,
    revenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "paid" } }),
    prisma.product.count({ where: { active: true } }),
    prisma.order.findMany({
      where: { status: "paid" },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        orderItems: { include: { product: { select: { title: true, category: true } } } },
      },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _count: { productId: true },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "paid" },
    }),
  ]);

  const totalRevenue = revenue._sum.total ?? 0;

  // Resolve product names for top products
  const topProductIds = topProducts.map((tp) => tp.productId);
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, title: true, category: true },
  });
  const productMap = Object.fromEntries(topProductDetails.map((p) => [p.id, p]));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          🛡️ Admin Dashboard
        </h1>
        <div className="text-xs text-gray-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg">
          ⚠️ Add authentication before production use
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: "💰", color: "text-green-600" },
          { label: "Paid Orders", value: paidOrders, icon: "✅", color: "text-blue-600" },
          { label: "Total Orders", value: totalOrders, icon: "📦", color: "text-indigo-600" },
          { label: "Active Products", value: totalProducts, icon: "🛍️", color: "text-purple-600" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="text-2xl mb-1">{icon}</div>
            <div className={`text-2xl font-bold ${color} mb-0.5`}>{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="text-left px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">Customer</th>
                  <th className="text-left px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">Items</th>
                  <th className="text-right px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">Total</th>
                  <th className="text-right px-4 py-2 text-gray-500 dark:text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-2">
                      <div className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{order.customerName}</div>
                      <div className="text-gray-400 truncate max-w-[120px]">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                      {order.orderItems.map((i) => i.product.title).join(", ").slice(0, 40)}
                      {order.orderItems.reduce((s, i) => s + i.product.title.length, 0) > 40 ? "…" : ""}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-400">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white">Top Selling Products</h2>
          </div>
          <div className="p-4 space-y-3">
            {topProducts.map((tp, i) => {
              const p = productMap[tp.productId];
              return (
                <div key={tp.productId} className="flex items-center gap-3">
                  <span className="text-lg w-6 text-center">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}</span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${p?.id ?? ""}`} className="text-sm font-medium text-gray-900 dark:text-white truncate block hover:text-indigo-600 dark:hover:text-indigo-400">
                      {p?.title ?? "Unknown Product"}
                    </Link>
                    <span className="text-xs text-gray-400">{p?.category}</span>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {tp._count.productId} sold
                  </span>
                </div>
              );
            })}
            {topProducts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No sales data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/api/products"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            📡 Products API
          </a>
          <a
            href="http://localhost:5555"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            🗄️ Prisma Studio
          </a>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
          >
            🛍️ View Store
          </Link>
        </div>
      </div>
    </div>
  );
}
