import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "GlobalWatch - Find Where to Watch",
  description: "Discover streaming availability for movies and TV shows across global regions.",
};

import { Github } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <div className="flex-1">
          {children}
        </div>

        <footer className="py-8 bg-black text-white px-4 mt-12 bg-opacity-95 backdrop-blur-sm border-t border-gray-900">
          <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Powered by</span>
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-widest text-[#01b4e4] hover:text-[#90cea1] transition-colors"
              >
                TMDB
              </a>
            </div>

            <a
              href="https://github.com/saheb/global-watch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
            >
              <Github size={18} className="group-hover:scale-110 transition-transform" />
              <span>View on GitHub</span>
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
