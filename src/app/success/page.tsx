"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const { clearCart } = useCart();
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Payment Successful!
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        Thank you for your purchase! Your download links have been sent to your email.
        Check your inbox (and spam folder) for your order confirmation.
      </p>

      {sessionId && (
        <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 mb-6">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            Order reference: <code className="font-mono font-semibold">{sessionId.slice(-12).toUpperCase()}</code>
          </p>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8 text-left space-y-3">
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">What happens next?</h2>
        <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>📧</span>
          <span>Check your email for download links. Each link is valid for 7 days and can be used up to 5 times.</span>
        </p>
        <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>❓</span>
          <span>If you have any issues, please check our <Link href="/legal/refunds" className="text-indigo-600 dark:text-indigo-400 underline">Refund Policy</Link> or contact support.</span>
        </p>
        <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>🌱</span>
          <span>All products are AI-generated and open-licensed (CC0). Enjoy!</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
