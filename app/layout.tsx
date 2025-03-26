import type { Metadata } from "next";
import "@/styles/globals.css";
import { LanguageProvider } from "@/lang/LanguageContext"; // Import the language provider

export const metadata: Metadata = {
  title: "Vocora",
  description: "Created by Andrea, Teresa, Mariana, Perla",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <html lang="en"> {/* Static lang attribute set to English */}
        <body>{children}</body>
      </html>
    </LanguageProvider>
  );
}
