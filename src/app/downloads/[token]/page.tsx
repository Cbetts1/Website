import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download Your Files",
  robots: "noindex",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function DownloadPage({ params }: Props) {
  const { token } = await params;

  const download = await prisma.download.findUnique({
    where: { token },
    include: {
      order: { select: { customerName: true, customerEmail: true, status: true } },
    },
  });

  if (!download) notFound();

  const now = new Date();
  const expired = download.expiresAt < now;
  const exhausted = download.downloadCount >= download.maxDownloads;
  const orderUnpaid = download.order.status !== "paid";

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm text-center">
        {expired || exhausted || orderUnpaid ? (
          <>
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Download Unavailable
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              {orderUnpaid
                ? "This order has not been paid or has been refunded."
                : expired
                ? "This download link has expired (valid for 7 days after purchase)."
                : "This download link has reached its maximum use limit (5 downloads)."}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              If you believe this is an error, please contact support with your order confirmation email.
            </p>
            <Link href="/shop" className="text-indigo-600 dark:text-indigo-400 underline text-sm">
              Browse more products
            </Link>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">📥</div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Your File is Ready
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Hello, {download.order.customerName}! Click the button below to download your file.
              <br />
              <span className="text-xs text-gray-400 mt-1 block">
                {download.maxDownloads - download.downloadCount} download{(download.maxDownloads - download.downloadCount) !== 1 ? "s" : ""} remaining •{" "}
                Expires {download.expiresAt.toLocaleDateString()}
              </span>
            </p>
            <a
              href={`/api/download/${token}`}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900"
            >
              ⬇️ Download Now
            </a>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              🌱 This product is AI-generated and open-licensed (CC0). All products are digital — no refunds after download. See our{" "}
              <Link href="/legal/refunds" className="underline hover:text-indigo-600 dark:hover:text-indigo-400">Refund Policy</Link>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
