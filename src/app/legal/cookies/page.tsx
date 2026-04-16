import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie Notice", robots: "noindex" };

export default function CookiesPage() {
  const storeName = "MindfulStore";
  const lastUpdated = "April 2025";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Cookie & Tracking Notice</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-300">
          ⚠️ <strong>Legal Notice:</strong> This is a template notice. Review with a legal professional before deployment, especially for EU/GDPR compliance.
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device by a website. {storeName} uses <strong>localStorage</strong> (a browser storage mechanism) and minimal cookies to provide core functionality.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cookies and Storage We Use</h2>

          <table className="w-full border-collapse text-xs mt-3">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="text-left p-2 border border-gray-200 dark:border-gray-700">Name</th>
                <th className="text-left p-2 border border-gray-200 dark:border-gray-700">Type</th>
                <th className="text-left p-2 border border-gray-200 dark:border-gray-700">Purpose</th>
                <th className="text-left p-2 border border-gray-200 dark:border-gray-700">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-gray-200 dark:border-gray-700"><code>mindfulstore_cart</code></td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">localStorage</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">Stores your shopping cart items so they persist when you navigate or refresh</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">Until cleared</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-200 dark:border-gray-700"><code>cookie_consent</code></td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">localStorage</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">Stores your cookie consent preference to avoid showing the banner repeatedly</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">Until cleared</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-200 dark:border-gray-700">Stripe cookies</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">Third-party</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">Set by Stripe on their payment page for fraud prevention and payment processing</td>
                <td className="p-2 border border-gray-200 dark:border-gray-700">Session / varies</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics (Optional)</h2>
          <p>If analytics are enabled on this Store, we use a privacy-respecting, self-hosted analytics tool (e.g., Matomo or Plausible) that:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Does not track you across other websites</li>
            <li>Does not share data with advertising networks</li>
            <li>May set a first-party analytics cookie if you consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Essential vs. Optional Cookies</h2>
          <p>The cart storage (<code>mindfulstore_cart</code>) is <strong>essential</strong> for the Store to function correctly. It does not identify you personally.</p>
          <p>Analytics cookies (if used) are <strong>optional</strong> and only set if you consent via the cookie banner.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">How to Control Cookies</h2>
          <p>You can clear localStorage and cookies at any time via your browser settings. Clearing the cart storage will empty your cart. You can also click &quot;Decline&quot; on our cookie banner to opt out of optional analytics cookies.</p>
          <p>For browser-specific instructions:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Chrome: Settings → Privacy and Security → Clear browsing data</li>
            <li>Firefox: Settings → Privacy & Security → Clear Data</li>
            <li>Safari: Settings → Advanced → Privacy → Manage Website Data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact</h2>
          <p>For questions about our cookie practices, see our <a href="/legal/privacy" className="text-indigo-600 dark:text-indigo-400 underline">Privacy Policy</a> or contact us via the email listed there.</p>
        </section>
      </div>
    </div>
  );
}
