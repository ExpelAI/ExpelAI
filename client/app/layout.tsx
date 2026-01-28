import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Dashboard/Sidebar"; // We will create this next
import MobileNav from "@/components/Dashboard/MobileNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExpelAI | Polyhouse Monitor",
  description: "AI-Powered Pest Detection and Environmental Monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex bg-[#020617] text-slate-200 min-h-screen`}>
        {/* The Sidebar stays fixed on the left */}
        <Sidebar />

        {/* The Main Content area changes based on the page you are on */}
        <main className="flex-1 h-screen overflow-y-auto p-6 md:p-12 pb-24 md:pb-12">
          {children}
        </main>

        <MobileNav />
      </body>
    </html>
  );
}