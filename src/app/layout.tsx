import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: {
    default: "MindfulStore — Digital Products for Mindful Living",
    template: "%s | MindfulStore",
  },
  description:
    "Premium AI-generated digital products: ebooks, digital sticker packs, and productivity templates for mindful living and intentional productivity.",
  keywords: ["digital products", "ebooks", "stickers", "planner", "productivity", "mindfulness", "wellness"],
  openGraph: {
    siteName: "MindfulStore",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
