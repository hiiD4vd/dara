import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import { Navigation } from "@/components/ui/Navigation";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rumah Mungil LDR",
  description: "A digital space for us.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${caveat.variable} font-hand min-h-screen antialiased bg-[var(--background)] text-[var(--foreground)] pb-24`}
      >
        <AuthProvider>
          {children}
          <Navigation />
        </AuthProvider>
      </body>
    </html>
  );
}
