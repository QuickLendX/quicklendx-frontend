import type { Metadata } from "next";
import "./globals.css";
import { FeatureFlagsDebugOverlay } from "@/components/FeatureFlagsDebugOverlay";

export const metadata: Metadata = {
  title: "QuickLendX",
  description: "Invoice-lending on Stellar, powered by Soroban.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <FeatureFlagsDebugOverlay />
      </body>
    </html>
  );
}
