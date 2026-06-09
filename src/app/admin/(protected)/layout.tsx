"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { LoadingScreen } from "@/shared/ui/loading-screen";
import { 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CoffeeIcon from "@mui/icons-material/Coffee";
import CategoryIcon from "@mui/icons-material/Category";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const siteSettings = useAppSelector((state) => state.settings.data);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === process.env.ADMIN_EMAIL) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (err) {
      console.error("Log out failed:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--color-cream)" }}>
        <LoadingScreen message="Verifying authorization credentials..." />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const links = [
    { label: "Dashboard", href: "/admin", icon: DashboardIcon },
    { label: "Orders", href: "/admin/orders", icon: ReceiptLongIcon },
    { label: "Menu Items", href: "/admin/menu", icon: CoffeeIcon },
    { label: "Categories", href: "/admin/categories", icon: CategoryIcon },
    { label: "Coupons", href: "/admin/discounts", icon: ConfirmationNumberIcon },
    { label: "Gallery", href: "/admin/gallery", icon: PhotoLibraryIcon },
    { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-cream)" }}>
      {/* Top Header Bar */}
      <header
        style={{
          background: "var(--color-espresso)",
          color: "var(--color-cream)",
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: "16px",
          borderBottom: "1px solid rgba(255, 243, 230, 0.1)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}
      >
        <IconButton
          onClick={() => setIsSidebarOpen(true)}
          sx={{ color: "var(--color-cream)" }}
          aria-label="open drawer"
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <h1 style={{ fontSize: "1.25rem", color: "var(--color-cream)", margin: 0, fontFamily: "Poppins" }}>
          {siteSettings.cafeName} Admin
        </h1>
      </header>

      {/* Main Content Container */}
      <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
        {children}
      </main>

      {/* Temporary Drawer Sidebar */}
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            backgroundColor: "var(--color-espresso)",
            color: "var(--color-cream)",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }
        }}
      >
        <div>
          {/* Drawer Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 2, borderBottom: "1px solid rgba(255, 243, 230, 0.15)" }}>
            <div>
              <h2 style={{ fontSize: "1.15rem", margin: 0, color: "var(--color-cream)", fontFamily: "Poppins" }}>
                {siteSettings.cafeName}
              </h2>
              <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>Admin Console</span>
            </div>
            <IconButton onClick={() => setIsSidebarOpen(false)} sx={{ color: "var(--color-cream)" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <List sx={{ p: 0 }}>
            {links.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href;
              return (
                <ListItem key={link.href} disablePadding sx={{ mb: 1 }}>
                  <Link href={link.href} passHref style={{ width: "100%" }} onClick={() => setIsSidebarOpen(false)}>
                    <ListItemButton
                      selected={isActive}
                      sx={{
                        borderRadius: "8px",
                        color: "var(--color-cream)",
                        "&.Mui-selected": {
                          backgroundColor: "var(--color-cream)",
                          color: "var(--color-espresso)",
                          "& .MuiListItemIcon-root": {
                            color: "var(--color-espresso)",
                          },
                          "&:hover": {
                            backgroundColor: "rgba(255, 243, 230, 0.9)",
                          }
                        },
                        "&:hover": {
                          backgroundColor: "rgba(255, 243, 230, 0.08)",
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "36px", color: isActive ? "var(--color-espresso)" : "var(--color-cream)" }}>
                        <IconComponent style={{ fontSize: "1.3rem" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={link.label}
                        primaryTypographyProps={{
                          fontWeight: isActive ? 800 : 600,
                          fontSize: "0.95rem",
                          fontFamily: "Nunito Sans"
                        }}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </div>

        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          className="button button--ghost"
          style={{
            width: "100%",
            background: "transparent",
            color: "var(--color-cream)",
            border: "1px solid rgba(255, 243, 230, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px"
          }}
        >
          <ExitToAppIcon style={{ fontSize: "1.2rem" }} />
          Log Out
        </button>
      </Drawer>
    </div>
  );
}
