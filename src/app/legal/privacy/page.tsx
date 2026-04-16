import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", robots: "noindex" };

export default function PrivacyPage() {
  const storeName = "MindfulStore";
  const contactEmail = process.env.SMTP_FROM ?? "support@mindfulstore.example.com";
  const lastUpdated = "April 2025";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-300">
          ⚠️ <strong>Legal Notice:</strong> This is a template policy. Review it with a legal professional before deploying in production, especially if serving users in the EU (GDPR) or California (CCPA).
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Introduction</h2>
          <p>{storeName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information when you use our Store.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. Information We Collect</h2>
          <p>We collect only the minimum information necessary to process your order:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Name and email address</strong> — collected at checkout to deliver your order and send download links.</li>
            <li><strong>Payment information</strong> — processed directly by Stripe. We never see or store your full card number.</li>
            <li><strong>Order data</strong> — we store order records (items purchased, total, date) in our database to manage digital delivery.</li>
            <li><strong>Cookies</strong> — we use essential cookies for cart functionality (localStorage). See our <a href="/legal/cookies" className="text-indigo-600 dark:text-indigo-400 underline">Cookie Notice</a> for details.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and fulfill your order</li>
            <li>To send order confirmation and download links to your email</li>
            <li>To provide customer support if you contact us</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p className="mt-2">We do <strong>not</strong> sell, rent, or share your personal data with third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. Third-Party Services</h2>
          <p>We use the following third-party services that may process your data:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Stripe</strong> — payment processing. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">Stripe&apos;s Privacy Policy</a>.</li>
            <li><strong>Email provider (SMTP)</strong> — used to send order confirmation emails. Your email address is passed to our SMTP provider only for this purpose.</li>
            {process.env.NEXT_PUBLIC_ANALYTICS_URL && (
              <li><strong>Analytics</strong> — we use privacy-respecting analytics (self-hosted Matomo or Plausible) to understand traffic. No personal data is shared with third-party analytics platforms.</li>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. Data Retention</h2>
          <p>We retain order records (name, email, items purchased) for up to 3 years for accounting and dispute resolution purposes. You may request deletion by contacting us.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">6. Your Rights (GDPR / CCPA)</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
          </ul>
          <p className="mt-2">To exercise these rights, contact us at <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 underline">{contactEmail}</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">7. Security</h2>
          <p>We implement reasonable technical measures to protect your data, including HTTPS, secure download tokens, and database access controls. However, no system is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">8. Children&apos;s Privacy</h2>
          <p>Our Store is not directed to children under 13. We do not knowingly collect personal information from children.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">9. Changes to This Policy</h2>
          <p>We may update this policy from time to time. Changes will be posted on this page with a new &quot;last updated&quot; date.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">10. Contact</h2>
          <p>For privacy inquiries, contact: <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 underline">{contactEmail}</a></p>
        </section>
      </div>
    </div>
  );
}
