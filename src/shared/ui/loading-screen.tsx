import React from "react";
import CoffeeIcon from "@mui/icons-material/Coffee";

interface LoadingScreenProps {
  message?: string;
  fullHeight?: boolean;
}

export function LoadingScreen({ message = "Loading...", fullHeight = true }: LoadingScreenProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: fullHeight ? "80vh" : "200px",
        background: "transparent",
        gap: "16px",
        width: "100%",
        padding: "24px",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Animated Bouncing/Pulsing Coffee Cup */}
        <div
          style={{
            animation: "pulse-bounce 2s ease-in-out infinite",
            color: "var(--color-espresso)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <CoffeeIcon style={{ fontSize: "3rem" }} />
        </div>
        
        {/* Glowing Background Ring */}
        <div
          style={{
            position: "absolute",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "3px solid rgba(217, 160, 102, 0.2)",
            borderTopColor: "var(--color-caramel)",
            animation: "spin 1.2s linear infinite",
            zIndex: 1,
          }}
        />
      </div>
      <p
        style={{
          fontSize: "1.1rem",
          fontWeight: "bold",
          color: "var(--color-espresso)",
          margin: 0,
          fontFamily: "Poppins, sans-serif",
          letterSpacing: "0.5px",
          textAlign: "center",
          animation: "fade-pulse 1.8s ease-in-out infinite"
        }}
      >
        {message}
      </p>

      {/* Inject Keyframe CSS safely */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-bounce {
          0%, 100% {
            transform: scale(0.9) translateY(0);
          }
          50% {
            transform: scale(1.1) translateY(-6px);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fade-pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}} />
    </div>
  );
}
