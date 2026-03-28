"use client";

import Lottie from "lottie-react";

/**
 * Lottie animation: two counter-rotating dashed rings (neon-cyan + purple).
 * Inline JSON — no external CDN required.
 * Sostituisci animationData con qualsiasi animazione da lottiefiles.com se preferisci.
 */
const cyberLoaderAnimation = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 80,
  h: 80,
  nm: "cyber-loader",
  ddd: 0,
  assets: [],
  layers: [
    // Outer ring — cyan, clockwise
    {
      ddd: 0, ind: 1, ty: 4, nm: "outer", sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0,   s: [0]   },
            { t: 120, s: [360] },
          ],
        },
        p: { a: 0, k: [40, 40, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { d: 1, ty: "el", s: { a: 0, k: [66, 66] }, p: { a: 0, k: [0, 0] }, nm: "E" },
            {
              ty: "st",
              c: { a: 0, k: [0.003, 1.0, 0.898, 1] }, // #00FFE5
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
              lc: 2, lj: 2, bm: 0,
              d: [
                { nm: "Dash", n: "d", v: { a: 0, k: 55 } },
                { nm: "Gap",  n: "g", v: { a: 0, k: 22 } },
              ],
              nm: "S",
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: "T",
            },
          ],
          nm: "G1", np: 3, cix: 2, bm: 0, ix: 1,
        },
      ],
      ip: 0, op: 120, st: 0, bm: 0,
    },
    // Inner ring — purple, counter-clockwise
    {
      ddd: 0, ind: 2, ty: 4, nm: "inner", sr: 1,
      ks: {
        o: { a: 0, k: 60 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0,   s: [0]    },
            { t: 120, s: [-360] },
          ],
        },
        p: { a: 0, k: [40, 40, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { d: 1, ty: "el", s: { a: 0, k: [38, 38] }, p: { a: 0, k: [0, 0] }, nm: "E" },
            {
              ty: "st",
              c: { a: 0, k: [0.486, 0.227, 0.929, 1] }, // #7C3AED
              o: { a: 0, k: 100 },
              w: { a: 0, k: 2 },
              lc: 2, lj: 2, bm: 0,
              d: [
                { nm: "Dash", n: "d", v: { a: 0, k: 28 } },
                { nm: "Gap",  n: "g", v: { a: 0, k: 14 } },
              ],
              nm: "S",
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: "T",
            },
          ],
          nm: "G2", np: 3, cix: 2, bm: 0, ix: 1,
        },
      ],
      ip: 0, op: 120, st: 0, bm: 0,
    },
    // Center dot — cyan pulse
    {
      ddd: 0, ind: 3, ty: 4, nm: "dot", sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0,  s: [100] },
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 60, s: [30]  },
            { t: 120, s: [100] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [40, 40, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { d: 1, ty: "el", s: { a: 0, k: [8, 8] }, p: { a: 0, k: [0, 0] }, nm: "E" },
            {
              ty: "fl",
              c: { a: 0, k: [0.003, 1.0, 0.898, 1] },
              o: { a: 0, k: 100 },
              r: 1, bm: 0, nm: "F",
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: "T",
            },
          ],
          nm: "G3", np: 3, cix: 2, bm: 0, ix: 1,
        },
      ],
      ip: 0, op: 120, st: 0, bm: 0,
    },
  ],
};

interface CyberLoaderProps {
  size?: number;
  className?: string;
}

export default function CyberLoader({ size = 80, className = "" }: CyberLoaderProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Lottie
        animationData={cyberLoaderAnimation}
        loop
        style={{ width: size, height: size }}
      />
    </div>
  );
}
