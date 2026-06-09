"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/shared/config/navigation";
import { siteConfig } from "@/shared/config/site";
import { useAppSelector } from "@/store/hooks";
import { Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CollectionsIcon from "@mui/icons-material/Collections";
import EmailIcon from "@mui/icons-material/Email";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";

function getRouteIcon(href: string) {
  switch (href) {
    case "/":
      return HomeIcon;
    case "/menu":
      return LocalCafeIcon;
    case "/about":
      return InfoIcon;
    case "/location":
      return LocationOnIcon;
    case "/gallery":
      return CollectionsIcon;
    case "/contact":
      return EmailIcon;
    default:
      return HomeIcon;
  }
}

export function Navbar() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.order.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const siteSettings = useAppSelector((state) => state.settings.data);
  const initials = siteSettings.cafeName
    ? siteSettings.cafeName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "CF";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        if (user.email === process.env.ADMIN_EMAIL) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const profileLink = isAdmin ? "/admin" : isLoggedIn ? "/profile" : "/login";

  // Hide public Navbar on admin, login, and profile routes
  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/profile") {
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
    </div>
  );

  return (
    <header className="site-header">
      <nav className="site-nav container" aria-label="Main navigation">
        <div className="site-nav__left">
          <IconButton
            color="inherit"
            aria-label="menu"
            className="hamburger-menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Link className="brand-mark" href="/">
            <span className="brand-mark__icon">{initials}</span>
            <span>{siteSettings.cafeName}</span>
          </Link>
        </div>

        <div className="site-nav__desktop-links">
          {navLinks}
        </div>

        <div className="site-nav__right">
          <Link href={profileLink} className="profile-badge" aria-label="User Profile">
            <PersonIcon style={{ fontSize: "1.65rem", display: "block" }} />
          </Link>
          <Link href="/order" className="cart-badge" aria-label="Shopping Cart">
            <ShoppingCartIcon style={{ fontSize: "1.55rem", display: "block" }} />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
          <Link className="nav-cta" href="/location">
            Visit Us
          </Link>
        </div>

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
            <span className="brand-mark__icon">{initials}</span>
            <span>{siteSettings.cafeName}</span>
          </Link>
          <List>
            {navigationItems.map((item) => {
              const Icon = getRouteIcon(item.href);
              return (
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
                      <ListItemIcon sx={{ minWidth: "40px", color: "inherit" }}>
                        <Icon />
                      </ListItemIcon>
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
              );
            })}
            {/* <ListItem disablePadding>
              <Link href="/order" passHref style={{ width: "100%" }} onClick={toggleDrawer(false)}>
                <ListItemButton
                  selected={pathname === "/order"}
                  sx={{
                    borderRadius: "8px",
                    mb: 1,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(59, 47, 47, 0.08)",
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "40px", color: "inherit" }}>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Cart (${totalItems})`}
                    primaryTypographyProps={{
                      fontWeight: pathname === "/order" ? 800 : 600,
                      fontFamily: "Nunito Sans"
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem> */}
             <ListItem disablePadding>
              <Link href={profileLink} passHref style={{ width: "100%" }} onClick={toggleDrawer(false)}>
                <ListItemButton
                  selected={pathname === profileLink}
                  sx={{
                    borderRadius: "8px",
                    "&.Mui-selected": {
                      backgroundColor: "rgba(59, 47, 47, 0.08)",
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "40px", color: "inherit" }}>
                    {isAdmin ? <DashboardIcon /> : isLoggedIn ? <PersonIcon /> : <LoginIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={isAdmin ? "Admin Panel" : isLoggedIn ? "My Profile" : "Log In"}
                    primaryTypographyProps={{
                      fontWeight: pathname === profileLink ? 800 : 600,
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
