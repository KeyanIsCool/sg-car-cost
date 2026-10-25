// Lightweight brand-tinted SVG car silhouette — used as a fallback hero when
// a vehicle has no image set, and as decorative art on cards.
export function CarArt({ tint = "#ff5e3a", className = "" }: { tint?: string; className?: string }) {
  return (
    <svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <defs>
        <linearGradient id="body" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={tint} stopOpacity="0.95" />
          <stop offset="100%" stopColor={tint} stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <g>
        <path
          d="M30,105 C45,80 70,55 110,52 C140,50 180,50 210,55 C235,58 265,70 290,90 L300,110 C300,118 294,122 288,122 L246,122 C244,112 234,105 222,105 C210,105 200,112 198,122 L112,122 C110,112 100,105 88,105 C76,105 66,112 64,122 L36,122 C30,122 26,117 26,112 Z"
          fill="url(#body)"
        />
        <path
          d="M115,60 C135,56 175,56 200,60 C215,63 235,72 250,85 L130,85 C122,85 118,80 118,75 Z"
          fill="url(#glass)"
          opacity="0.9"
        />
        <circle cx="88" cy="118" r="12" fill="#1a1a1a" />
        <circle cx="88" cy="118" r="5" fill="#333" />
        <circle cx="222" cy="118" r="12" fill="#1a1a1a" />
        <circle cx="222" cy="118" r="5" fill="#333" />
      </g>
    </svg>
  );
}

// Pick an accent colour from vehicle id so cars look varied without data.
export function tintFor(key: string): string {
  const palette = ["#ff5e3a", "#2b7fff", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#f43f5e"];
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}
