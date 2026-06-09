"use client";

import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export function WhatsAppButton() {
  const pathname = usePathname();
  const siteSettings = useAppSelector((state) => state.settings.data);

  // Hide WhatsApp button on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const cleanPhone = siteSettings.phone.replace(/[^0-9]/g, "");

  return (
    <a
      className="whatsapp-button"
      href={`https://wa.me/${cleanPhone}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      WA
    </a>
  );
}
