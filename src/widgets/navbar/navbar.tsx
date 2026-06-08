"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/shared/config/navigation";
import { siteConfig } from "@/shared/config/site";
import { useAppSelector } from "@/store/hooks";

export function Navbar() {
  const pathname = usePathname();
  const cartItems = useAppSelector((state) => state.order.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Hide public Navbar on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="site-header">
      <nav className="site-nav container" aria-label="Main navigation">
        <Link className="brand-mark" href="/">
          <span className="brand-mark__icon">BH</span>
          <span>{siteConfig.cafeName}</span>
        </Link>
        <div className="site-nav__links">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/order" className="cart-badge" aria-label="Shopping Cart">
            🛒 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
        </div>
        <Link className="nav-cta" href="/location">
          Visit Us
        </Link>
      </nav>
    </header>
  );
}
