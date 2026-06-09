import React from "react";

export default function Loading() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "var(--color-cream)",
      color: "var(--color-espresso)",
      fontFamily: "var(--font-poppins, Poppins, sans-serif)",
      gap: "16px"
    }}>
      <div className="spinner-container" style={{ position: "relative" }}>
        {/* Pulsing coffee cup loader */}
        <div style={{
          fontSize: "3.5rem",
          animation: "pulse 1.5s ease-in-out infinite",
          display: "inline-block"
        }}>
          ☕
        </div>
      </div>
      <p style={{
        margin: 0,
        fontWeight: 700,
        fontSize: "1.1rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        opacity: 0.8,
        animation: "blink 1.4s infinite both"
      }}>
        Brewing content...
      </p>

      {/* Styled animation styles in a style tag to keep it self-contained and performant */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 0px rgba(217, 160, 102, 0));
          }
          50% {
            transform: scale(1.15) translateY(-5px);
            filter: drop-shadow(0 8px 12px rgba(217, 160, 102, 0.45));
          }
        }
        @keyframes blink {
          0% {
            opacity: .2;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: .2;
          }
        }
      `}</style>
    </div>
  );
}
