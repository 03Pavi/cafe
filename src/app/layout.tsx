import type { Metadata } from "next";
import { Footer } from "@/widgets/footer/footer";
import { Navbar } from "@/widgets/navbar/navbar";
import { WhatsAppButton } from "@/features/whatsapp-button/whatsapp-button";
import { StoreProvider } from "@/shared/providers/store-provider";
import { siteConfig } from "@/shared/config/site";
import "./globals.scss";

export const metadata: Metadata = {
  title: `${siteConfig.cafeName} | Now Open`,
  description: siteConfig.description,
  icons: {
    icon: "/logo.png",
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
