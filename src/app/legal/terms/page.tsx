import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service", robots: "noindex" };

export default function TermsPage() {
  const storeName = "MindfulStore";
  const contactEmail = process.env.SMTP_FROM ?? "support@mindfulstore.example.com";
  const lastUpdated = "April 2025";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-300">
          ⚠️ <strong>Legal Notice:</strong> This document is a template generated for informational purposes. It should be reviewed and customized by a qualified legal professional before use in a real commercial context.
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>By accessing or using {storeName} (&quot;the Store&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the Store.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. Products and Digital Goods</h2>
          <p>All products sold on {storeName} are digital goods (ebooks, digital sticker packs, templates, and similar files). All content is either AI-generated or sourced from open-licensed (CC0/Public Domain) sources.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Products are for personal and commercial use under CC0 license terms, unless stated otherwise.</li>
            <li>AI-generated content is provided as-is and is intended for educational, personal, and business purposes.</li>
            <li>No professional advice (medical, legal, financial) is provided. Consult a qualified professional for such matters.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Payment and Pricing</h2>
          <p>All prices are in USD. Payment is processed by Stripe, a third-party payment processor. By completing a purchase, you authorize the charge to your payment method. Prices may change at any time without notice.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. Digital Delivery</h2>
          <p>After successful payment, you will receive an email with secure download links. Download links are valid for 7 days and may be used up to 5 times. {storeName} is not responsible for missed delivery emails due to spam filters or incorrect email addresses.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. Refund Policy</h2>
          <p>Please see our separate <a href="/legal/refunds" className="text-indigo-600 dark:text-indigo-400 underline">Refund Policy</a> for details on refunds for digital goods.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">6. Intellectual Property</h2>
          <p>All AI-generated content and store assets are released under CC0 (Public Domain) unless otherwise noted. You are free to use, adapt, and redistribute them for any purpose. The {storeName} brand name and logo are not covered by CC0 and remain the property of the store operator.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">7. Prohibited Uses</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Attempt to gain unauthorized access to any part of the Store</li>
            <li>Use the Store for any unlawful purpose</li>
            <li>Resell the Store software itself as your own product</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">8. Disclaimer of Warranties</h2>
          <p>The Store and its products are provided &quot;as is&quot; without any warranty of any kind, express or implied. We do not warrant that the Store will be uninterrupted, error-free, or that the content will be accurate or complete.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">9. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, {storeName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Store or its products.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">10. Governing Law</h2>
          <p>These Terms are governed by the laws of the jurisdiction in which the Store operator is located. Any disputes shall be resolved in the courts of that jurisdiction.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">11. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Store after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">12. Contact</h2>
          <p>For questions about these Terms, contact us at: <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 underline">{contactEmail}</a></p>
        </section>
      </div>
    </div>
  );
}
