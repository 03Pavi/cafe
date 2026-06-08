"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/shared/config/site";

export function WhatsAppButton() {
  const pathname = usePathname();

  // Hide WhatsApp button on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      className="whatsapp-button"
      href={`https://wa.me/${siteConfig.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      WA
    </a>
  );
}
