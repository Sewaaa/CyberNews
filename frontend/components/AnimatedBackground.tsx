"use client";

/**
 * AnimatedBackground — ambient orbs con palette fox (arancione / ambra / rosso caldo).
 * Visibile solo in dark mode via CSS.
 */
export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-700"
      aria-hidden="true"
    >
      {/* Orb 1 — arancione fox, top-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 760,
          height: 760,
          top: -280,
          right: -200,
          background:
            "radial-gradient(circle, rgba(249,115,22,0.10) 0%, rgba(249,115,22,0.03) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbFloat1 22s ease-in-out infinite",
        }}
      />

      {/* Orb 2 — rosso caldo, bottom-left */}
      <div
        className="absolute rounded-full"
        style={{
          width: 560,
          height: 560,
          bottom: -160,
          left: -140,
          background:
            "radial-gradient(circle, rgba(185,28,28,0.08) 0%, rgba(185,28,28,0.03) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbFloat2 28s ease-in-out infinite",
        }}
      />

      {/* Orb 3 — ambra, center-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: "40%",
          right: "15%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.02) 40%, transparent 70%)",
          filter: "blur(50px)",
          animation: "orbFloat3 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}
