import { Cinzel, Inter } from "next/font/google";
import "../globals.css";
import { NgrokFetchPatch } from "../components/NgrokFetchPatch";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/**
 * Root layout del grupo `(frontend)`. Convive con `app/(payload)/layout.tsx`
 * (cada route group con UI propia necesita su propio `<html>`/`<body>` cuando
 * no hay un layout único en `app/layout.tsx`).
 */
export default function FrontendRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-fci-base text-base text-fci-foreground">
        {process.env.NODE_ENV === "development" ? <NgrokFetchPatch /> : null}
        {children}
      </body>
    </html>
  );
}
