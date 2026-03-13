import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Stars3DBackground } from "@/components/ui/Stars3DBackground";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerAI - Discover Your Path",
  description: "AI-powered career readiness and roadmap platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased flex flex-col min-h-screen relative`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Stars3DBackground />
          <AppProvider>
            <Navbar />
            <main className="flex-1 flex flex-col relative z-0">
              {children}
            </main>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
