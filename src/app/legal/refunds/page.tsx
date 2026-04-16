import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund Policy", robots: "noindex" };

export default function RefundsPage() {
  const storeName = "MindfulStore";
  const contactEmail = process.env.SMTP_FROM ?? "support@mindfulstore.example.com";
  const lastUpdated = "April 2025";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Refund & Return Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-300">
          ⚠️ <strong>Legal Notice:</strong> This is a template policy. Review and customize with a legal professional before real-world use. Digital goods refund rules may vary by jurisdiction (e.g., EU consumer protection laws).
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Overview</h2>
          <p>All products sold by {storeName} are <strong>digital goods</strong> (ebooks, sticker packs, templates, and similar downloadable files). Because digital products are delivered immediately and cannot be &quot;returned&quot;, our refund policy is limited but fair.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">No Refunds After Download</h2>
          <p>Once a digital product has been downloaded, we generally do not offer refunds. This is because:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Digital files cannot be &quot;returned&quot; once received</li>
            <li>Full product descriptions and previews are provided before purchase</li>
            <li>All products are clearly described as AI-generated and open-licensed</li>
          </ul>
          <p>By completing a purchase, you acknowledge that you are waiving your right to a cooling-off period under applicable consumer law (where permitted) because digital content delivery begins immediately upon purchase.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Exceptions — When Refunds Are Granted</h2>
          <p>We will issue a full refund in the following cases:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Duplicate purchase:</strong> If you accidentally purchased the same product twice, we will refund the duplicate charge.</li>
            <li><strong>Non-delivery:</strong> If you paid but never received your download link email and the link is not working, contact us within 14 days of purchase.</li>
            <li><strong>File corruption:</strong> If the downloaded file is corrupt and we cannot provide a replacement within 3 business days.</li>
            <li><strong>Significant misrepresentation:</strong> If a product is materially different from what was described on the product page.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">EU Consumers</h2>
          <p>If you are located in the European Union, you may have additional rights under the EU Consumer Rights Directive. However, you acknowledge that by requesting immediate digital delivery of the content at checkout, you consent to the waiver of your 14-day withdrawal right for digital content, to the extent permitted by applicable law.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">How to Request a Refund</h2>
          <p>To request a refund, email us at <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 underline">{contactEmail}</a> within <strong>14 days of purchase</strong> with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your order email address</li>
            <li>Order reference number (from your confirmation email)</li>
            <li>The reason for your refund request</li>
          </ul>
          <p>We will respond within 3 business days. Approved refunds are processed via Stripe to your original payment method within 5–10 business days.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact</h2>
          <p>For refund requests or questions: <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 underline">{contactEmail}</a></p>
        </section>
      </div>
    </div>
  );
}
