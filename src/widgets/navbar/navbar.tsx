"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/shared/config/navigation";
import { siteConfig } from "@/shared/config/site";
import { useAppSelector } from "@/store/hooks";
import { Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export function Navbar() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.order.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Hide public Navbar on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const navLinks = (
    <div className="site-nav__links-wrapper">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? "active-link" : ""}
        >
          {item.label}
        </Link>
      ))}
      <Link href="/order" className="cart-badge" aria-label="Shopping Cart">
        🛒 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </Link>
    </div>
  );

  return (
    <header className="site-header">
      <nav className="site-nav container" aria-label="Main navigation">
        <div className="site-nav__left">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className="hamburger-menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Link className="brand-mark" href="/">
            <span className="brand-mark__icon">BH</span>
            <span>{siteConfig.cafeName}</span>
          </Link>
        </div>

        <div className="site-nav__desktop-links">
          {navLinks}
        </div>

        <Link className="nav-cta" href="/location">
          Visit Us
        </Link>

        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              width: 280,
              backgroundColor: "var(--color-cream)",
              padding: "20px",
            }
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Link className="brand-mark" href="/" onClick={toggleDrawer(false)} style={{ marginBottom: "32px" }}>
            <span className="brand-mark__icon">BH</span>
            <span>{siteConfig.cafeName}</span>
          </Link>
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <Link href={item.href} passHref style={{ width: "100%" }} onClick={toggleDrawer(false)}>
                  <ListItemButton
                    selected={pathname === item.href}
                    sx={{
                      borderRadius: "8px",
                      mb: 1,
                      "&.Mui-selected": {
                        backgroundColor: "rgba(59, 47, 47, 0.08)",
                        color: "var(--color-espresso)",
                        "&:hover": {
                          backgroundColor: "rgba(59, 47, 47, 0.12)",
                        }
                      }
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: pathname === item.href ? 800 : 600,
                        fontFamily: "Nunito Sans"
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <Link href="/order" passHref style={{ width: "100%" }} onClick={toggleDrawer(false)}>
                <ListItemButton
                  selected={pathname === "/order"}
                  sx={{
                    borderRadius: "8px",
                    "&.Mui-selected": {
                      backgroundColor: "rgba(59, 47, 47, 0.08)",
                    }
                  }}
                >
                  <ListItemText
                    primary={`Cart (${totalItems})`}
                    primaryTypographyProps={{
                      fontWeight: pathname === "/order" ? 800 : 600,
                      fontFamily: "Nunito Sans"
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </Drawer>
      </nav>
    </header>
  );
}
