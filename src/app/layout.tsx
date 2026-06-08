import type { Metadata } from "next";
import { Footer } from "@/widgets/footer/footer";
import { Navbar } from "@/widgets/navbar/navbar";
import { WhatsAppButton } from "@/features/whatsapp-button/whatsapp-button";
import { StoreProvider } from "@/shared/providers/store-provider";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Brew Haven Cafe | Now Open",
  description:
    "A fresh new cafe in your neighborhood, serving love, warmth, and freshly brewed moments.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
        </StoreProvider>
      </body>
    </html>
  );
}
