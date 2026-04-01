import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { GoogleAnalytics } from "@/lib/analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "VibhavSri | Premium Ecommerce",
  description: "Experience the future of online shopping with VibhavSri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased selection:bg-primary selection:text-primary-foreground`}
      >
        <GoogleAnalytics />
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
            filter: "contrast(150%) brightness(1000%)",
          }}
        />
        <MotionProvider>
          <div className="relative min-h-screen">
            {children}
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
