import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Navbar from "./components/Navbar";
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
  title: "TripSync — Tours, Stays & Car Rentals",
  description:
    "Discover and book guided tours, properties, and rental cars all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">
            <p>
              © {new Date().getFullYear()} TripSync. Plan your perfect trip.
            </p>
            <div className="flex gap-4">
              <Link href="/search?tab=properties" className="transition hover:text-emerald-600">
                Stays
              </Link>
              <Link href="/search?tab=tours" className="transition hover:text-emerald-600">
                Tours
              </Link>
              <Link href="/search?tab=cars" className="transition hover:text-emerald-600">
                Cars
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
