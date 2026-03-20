
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    template: '%s | CampusGebeya',
    default: 'CampusGebeya - Student Marketplace',
  },
  description: 'A student-only marketplace for university students in Addis Ababa to buy, sell, and trade gear, and find gigs',
  keywords: ['marketplace', 'student', 'Ethiopia', 'Addis Ababa', 'university', 'buy', 'sell', 'gear', 'gigs'],
  authors: [{ name: 'CampusGebeya Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'CampusGebeya',
    title: 'CampusGebeya - Student Marketplace',
    description: 'A student-only marketplace for university students in Addis Ababa',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
