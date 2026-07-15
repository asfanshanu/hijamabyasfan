import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hijama by Shanu | Certified Cupping Therapist",
  description: "Book professional appointment-based cupping sessions with Asfan Shanu, a certified cupping therapist.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

