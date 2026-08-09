import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memoreat",
  description: "Scrapbook your meals",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdfcf8] text-slate-800 font-sans relative selection:bg-yellow-200">
        <div className="fixed inset-0 pointer-events-none z-[-1] paper-noise"></div>
        {children}
      </body>
    </html>
  );
}
