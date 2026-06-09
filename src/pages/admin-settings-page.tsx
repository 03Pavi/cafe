"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { siteConfig } from "@/shared/config/site";
import SettingsIcon from "@mui/icons-material/Settings";

import { LoadingScreen } from "@/shared/ui/loading-screen";

interface HourSlot {
  startDay: string;
  endDay: string;
  openTime: string; // "HH:MM" format
  closeTime: string; // "HH:MM" format
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function formatTime12h(time24: string): string {
  if (!time24) return "";
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour}:${minuteStr} ${ampm}`;
}

function parseTime12hTo24h(time12h: string): string {
  const match = time12h.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return "08:00";
  let [_, hoursStr, minutesStr, ampm] = match;
  let hours = parseInt(hoursStr, 10);
  if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutesStr}`;
}

function parseHoursString(hourStr: string): HourSlot {
  const parts = hourStr.split(":");
  if (parts.length < 2) {
    return { startDay: "Monday", endDay: "Friday", openTime: "08:00", closeTime: "22:00" };
  }
  const dayPart = parts[0].trim();
  const timePart = parts.slice(1).join(":").trim();
  
  let startDay = "Monday";
  let endDay = "Monday";
  if (dayPart.includes("-")) {
    const days = dayPart.split("-").map(d => d.trim());
    startDay = DAYS_OF_WEEK.includes(days[0]) ? days[0] : "Monday";
    endDay = DAYS_OF_WEEK.includes(days[1]) ? days[1] : "Sunday";
  } else {
    startDay = DAYS_OF_WEEK.includes(dayPart) ? dayPart : "Monday";
    endDay = startDay;
  }

  const times = timePart.split("-").map(t => t.trim());
  const openTime = times[0] ? parseTime12hTo24h(times[0]) : "08:00";
  const closeTime = times[1] ? parseTime12hTo24h(times[1]) : "22:00";

  return { startDay, endDay, openTime, closeTime };
}

function formatHourSlotToString(slot: HourSlot): string {
  const dayStr = slot.startDay === slot.endDay ? slot.startDay : `${slot.startDay} - ${slot.endDay}`;
  const openStr = formatTime12h(slot.openTime);
  const closeStr = formatTime12h(slot.closeTime);
  return `${dayStr}: ${openStr} - ${closeStr}`;
}

export default function AdminSettingsPage() {
  const [cafeName, setCafeName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [hourSlots, setHourSlots] = useState<HourSlot[]>([]);
  const [directionsUrl, setDirectionsUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [mapLatitude, setMapLatitude] = useState("");
  const [mapLongitude, setMapLongitude] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCafeName(data.cafeName || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setDirectionsUrl(data.directionsUrl || "");
          setInstagram(data.instagram || "");
          setMapLatitude(data.mapLatitude || "");
          setMapLongitude(data.mapLongitude || "");
          if (data.hours && Array.isArray(data.hours) && data.hours.length > 0) {
            setHourSlots(data.hours.map(parseHoursString));
          } else {
            setHourSlots([{ startDay: "Monday", endDay: "Friday", openTime: "08:00", closeTime: "22:00" }]);
          }
        } else {
          setCafeName(siteConfig.cafeName);
          setPhone(siteConfig.phone);
          setAddress(siteConfig.address);
          setDirectionsUrl(siteConfig.directionsUrl || "");
          setInstagram(siteConfig.instagram || "");
          setMapLatitude("");
          setMapLongitude("");
          setHourSlots(siteConfig.hours.map(parseHoursString));
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const formattedHours = hourSlots.map(formatHourSlotToString);
      const payload = {
        cafeName,
        phone,
        address,
        hours: formattedHours,
        directionsUrl,
        instagram,
        mapLatitude,
        mapLongitude,
      };
      
      await setDoc(doc(db, "settings", "general"), payload);
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setMessage("Error: Failed to save settings");
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading café settings..." />;
  }

  return (
    <div style={{ maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "24px", color: "var(--color-espresso)", display: "flex", alignItems: "center", gap: "8px" }}>
        <SettingsIcon /> General Café Settings
      </h1>

      {message && (
        <div style={{ background: "rgba(122, 139, 111, 0.16)", border: "1px solid var(--color-green)", borderRadius: "var(--radius-sm)", padding: "12px", marginBottom: "20px", fontWeight: "bold" }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div className="admin-grid-two-columns">
          
          {/* Left Column: General Configuration Card */}
          <div className="contact-form" style={{ padding: "24px", margin: 0, height: "100%" }}>
            <h2 style={{ fontSize: "1.2rem", color: "var(--color-espresso)", marginBottom: "20px", fontWeight: "bold" }}>General Configuration</h2>
            
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
              Café Brand Name
              <input
                type="text"
                required
                value={cafeName}
                onChange={(e) => setCafeName(e.target.value)}
                placeholder={`e.g. ${siteConfig.cafeName}`}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
              Public Phone Number
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
              Physical Street Address
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Cafe Street"
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
              Google Maps Directions Link
              <input
                type="text"
                value={directionsUrl}
                onChange={(e) => setDirectionsUrl(e.target.value)}
                placeholder="e.g. https://www.google.com/maps/..."
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                Map Latitude
                <input
                  type="text"
                  value={mapLatitude}
                  onChange={(e) => setMapLatitude(e.target.value)}
                  placeholder="e.g. 28.6139"
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                Map Longitude
                <input
                  type="text"
                  value={mapLongitude}
                  onChange={(e) => setMapLongitude(e.target.value)}
                  placeholder="e.g. 77.2090"
                />
              </label>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
              Instagram Link
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="e.g. https://www.instagram.com/yourcafe"
              />
            </label>
          </div>

          {/* Right Column: Operating Hours Card */}
          <div className="contact-form" style={{ padding: "24px", margin: 0, height: "100%" }}>
            <h2 style={{ fontSize: "1.2rem", color: "var(--color-espresso)", marginBottom: "20px", fontWeight: "bold" }}>Operating Hours</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {hourSlots.map((slot, index) => (
                <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "rgba(59, 47, 47, 0.04)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(59, 47, 47, 0.08)" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem" }}>
                    From Day
                    <select
                      value={slot.startDay}
                      onChange={(e) => {
                        const updated = [...hourSlots];
                        updated[index].startDay = e.target.value;
                        setHourSlots(updated);
                      }}
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid rgba(59, 47, 47, 0.16)", background: "var(--color-cream)" }}
                    >
                      {DAYS_OF_WEEK.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem" }}>
                    To Day
                    <select
                      value={slot.endDay}
                      onChange={(e) => {
                        const updated = [...hourSlots];
                        updated[index].endDay = e.target.value;
                        setHourSlots(updated);
                      }}
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid rgba(59, 47, 47, 0.16)", background: "var(--color-cream)" }}
                    >
                      {DAYS_OF_WEEK.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem" }}>
                    Open Time
                    <input
                      type="time"
                      required
                      value={slot.openTime}
                      onChange={(e) => {
                        const updated = [...hourSlots];
                        updated[index].openTime = e.target.value;
                        setHourSlots(updated);
                      }}
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid rgba(59, 47, 47, 0.16)", background: "var(--color-cream)", minHeight: "38px" }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem" }}>
                    Close Time
                    <input
                      type="time"
                      required
                      value={slot.closeTime}
                      onChange={(e) => {
                        const updated = [...hourSlots];
                        updated[index].closeTime = e.target.value;
                        setHourSlots(updated);
                      }}
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid rgba(59, 47, 47, 0.16)", background: "var(--color-cream)", minHeight: "38px" }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setHourSlots(hourSlots.filter((_, i) => i !== index));
                    }}
                    disabled={hourSlots.length === 1}
                    style={{
                      gridColumn: "span 2",
                      background: "rgba(220, 53, 69, 0.1)",
                      color: "#dc3545",
                      border: "1px solid rgba(220, 53, 69, 0.2)",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      opacity: hourSlots.length === 1 ? 0.5 : 1,
                      minHeight: "38px",
                      marginTop: "6px"
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setHourSlots([...hourSlots, { startDay: "Monday", endDay: "Friday", openTime: "08:00", closeTime: "22:00" }]);
                }}
                style={{
                  background: "var(--color-espresso)",
                  color: "var(--color-cream)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  width: "100%"
                }}
              >
                + Add Time Slot
              </button>
            </div>
          </div>

        </div>

        <button type="submit" className="button button--primary" style={{ width: "100%", padding: "12px", marginTop: "24px" }}>
          Save Configuration
        </button>
      </form>
    </div>
  );
}
