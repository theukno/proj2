import type React from "react";
import dynamic from "next/dynamic";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
import { Toaster } from "@/components/ui/toaster";

// Lazy load ChatBot for performance optimization
const ChatBot = dynamic(() => import("@/components/chat-bot"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  return {
    title: "Mood Shop - Personalized Shopping Based on Your Mood",
    description: "Discover products that match your mood and enhance your wellbeing.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <ChatBot />
            </div>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
