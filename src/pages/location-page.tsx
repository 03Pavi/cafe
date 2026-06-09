"use client";

import { useState } from "react";
import { siteConfig } from "@/shared/config/site";
import { Skeleton, Box } from "@mui/material";

export default function LocationPage() {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <main className="page-surface">
      <section className="container location-page">
        <div className="location-card">
          <span className="eyebrow">We Are Now Open</span>
          <h1>Visit us for your first cup.</h1>
          <p>{siteConfig.address}</p>
          <div className="location-details">
            <h2>Opening Hours</h2>
            {siteConfig.hours.map((hour) => (
              <p key={hour}>{hour}</p>
            ))}
          </div>
          <div className="location-details">
            <h2>Contact</h2>
            <p>{siteConfig.phone}</p>
          </div>
          <a className="button button--primary" href={siteConfig.directionsUrl}>
            Visit Us Today
          </a>
        </div>
        <Box className="map-frame" sx={{ position: "relative" }}>
          {!mapLoaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                borderRadius: "var(--radius-lg)"
              }}
            />
          )}
          <iframe
            title="Cafe location map"
            src="https://www.google.com/maps?q=cafe&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setMapLoaded(true)}
            style={{ border: 0 }}
          />
        </Box>
      </section>
    </main>
  );
}
