"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/shared/config/navigation";
import { useAppSelector } from "@/store/hooks";

export function Footer() {
  const pathname = usePathname();
  const siteSettings = useAppSelector((state) => state.settings.data);

  // Hide public Footer on admin, login, and profile routes
  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/profile") {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Link className="brand-mark brand-mark--footer" href="/">
            <span className="brand-mark__icon">BH</span>
            <span>{siteSettings.cafeName}</span>
          </Link>
          <p>Freshly brewed house coffee with a smooth caramel finish.</p>
        </div>
        <div>
          <h2>Visit</h2>
          <p>{siteSettings.address}</p>
          <p>{siteSettings.phone}</p>
        </div>
        <div>
          <h2>Explore</h2>
          <div className="footer-links">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
