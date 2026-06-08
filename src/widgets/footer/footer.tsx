"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/shared/config/navigation";
import { siteConfig } from "@/shared/config/site";

export function Footer() {
  const pathname = usePathname();

  // Hide public Footer on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Link className="brand-mark brand-mark--footer" href="/">
            <span className="brand-mark__icon">BH</span>
            <span>{siteConfig.cafeName}</span>
          </Link>
          <p>{siteConfig.message}</p>
        </div>
        <div>
          <h2>Visit</h2>
          <p>{siteConfig.address}</p>
          <p>{siteConfig.phone}</p>
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
