import type { Metadata } from "next";
import { Fredoka, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const displayFont = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EAT – Endangered Animals Tracker",
  description:
    "Kid-friendly project builder that helps students study endangered species and present their findings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${bodyFont.variable} ${displayFont.variable} bg-white text-slate-900 antialiased`}
      >
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(214,233,255,0.8),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(255,228,234,0.6),_transparent_50%)]">
          {children}
        </div>
      </body>
    </html>
  );
}
