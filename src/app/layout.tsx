import type { Metadata } from "next";
import { Fredoka, Fuzzy_Bubbles, Patrick_Hand, Poppins, Space_Grotesk } from "next/font/google";
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

const handFont = Patrick_Hand({
  subsets: ["latin"],
  variable: "--font-patrick-hand",
  weight: ["400"],
});

const fuzzyBubbles = Fuzzy_Bubbles({
  subsets: ["latin"],
  variable: "--font-fuzzy-bubbles",
  weight: ["400", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
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
        className={`${bodyFont.variable} ${displayFont.variable} ${handFont.variable} ${fuzzyBubbles.variable} ${poppins.variable} bg-white text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
