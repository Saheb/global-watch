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
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Powered by</span>
              {/* Using a simple text for TMDB if SVG external link issues arise, but standard TMDB attribution usually requires logo. 
                         I'll use their official short logo URL. */}
              <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB" className="h-4 w-auto" />
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
