"use client";

/**
 * AnimatedBackground — shader-gradient-like ambient orbs.
 * Visible only in dark mode via CSS. No JS theme detection needed.
 */
export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-700"
      aria-hidden="true"
    >
      {/* Orb 1 — neon cyan, top-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 760,
          height: 760,
          top: -280,
          right: -200,
          background:
            "radial-gradient(circle, rgba(0,255,229,0.09) 0%, rgba(0,255,229,0.03) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbFloat1 22s ease-in-out infinite",
        }}
      />

      {/* Orb 2 — purple, bottom-left */}
      <div
        className="absolute rounded-full"
        style={{
          width: 560,
          height: 560,
          bottom: -160,
          left: -140,
          background:
            "radial-gradient(circle, rgba(124,58,237,0.09) 0%, rgba(124,58,237,0.03) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbFloat2 28s ease-in-out infinite",
        }}
      />

      {/* Orb 3 — blue, center-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: "40%",
          right: "15%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.07) 0%, rgba(37,99,235,0.02) 40%, transparent 70%)",
          filter: "blur(50px)",
          animation: "orbFloat3 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}
