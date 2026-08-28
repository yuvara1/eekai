/**
 * eekai (ஈகை) brand mark.
 * The Tamil character ஈ — root of ஈகை, "to give generously" — serves as the
 * logo mark. Warm turmeric-to-saffron gradient evokes kolam rangoli and the
 * golden warmth of shared food.
 */

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/** Square icon mark — the Tamil ஈ on a warm gradient field. */
export function LogoMark({ size = 28, className = "" }: LogoMarkProps) {
  const r = size * 0.22; // border-radius proportion
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eekai-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="55%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        {/* Soft inner glow ring */}
        <radialGradient id="eekai-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(187,247,208,0.32)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Background tile */}
      <rect width="28" height="28" rx={r} fill="url(#eekai-grad)" />
      <rect width="28" height="28" rx={r} fill="url(#eekai-glow)" />

      {/* Tamil ஈ character — hand-drawn SVG paths so it renders crisply
          at any size without font fallback issues.
          The glyph: a curved hook (top), horizontal bar, and descender. */}
      <g transform="translate(14,14)" fill="none" stroke="rgba(255,255,255,0.95)" strokeLinecap="round" strokeLinejoin="round">
        {/* Top arch — the curved head of ஈ */}
        <path
          d="M -4.5,-5.5 C -4.5,-8.5 -1.5,-9.2 1,-8.5 C 3.5,-7.8 4.5,-5.8 4,-3.8 C 3.5,-1.8 1.5,-0.6 -1,-0.8"
          strokeWidth="1.55"
          fill="none"
        />
        {/* Horizontal mid-bar */}
        <line x1="-4.5" y1="-0.8" x2="4.5" y2="-0.8" strokeWidth="1.55" />
        {/* Descender loop — the tail of ஈ curving right */}
        <path
          d="M 0,-0.8 C 0,2 2.5,3.5 4,2.8 C 5.5,2 5.5,0.2 4.2,-0.2"
          strokeWidth="1.45"
          fill="none"
        />
        {/* Bottom serif foot */}
        <line x1="-4.5" y1="4.2" x2="4.5" y2="4.2" strokeWidth="1.3" strokeOpacity="0.55" />
        {/* Two small kolam-dot accents above */}
        <circle cx="-2.2" cy="-7" r="0.55" fill="rgba(255,255,255,0.7)" stroke="none" />
        <circle cx="2.2" cy="-7" r="0.55" fill="rgba(255,255,255,0.7)" stroke="none" />
      </g>
    </svg>
  );
}

interface LogoWordmarkProps {
  expanded?: boolean;
  /** Show Tamil script subtitle */
  showTamil?: boolean;
  className?: string;
}

/** Text wordmark — "eekai" + optional ஈகை subtitle. */
export function LogoWordmark({ expanded = true, showTamil = false, className = "" }: LogoWordmarkProps) {
  if (!expanded) return null;
  return (
    <span className={`flex flex-col leading-none select-none ${className}`}>
      <span
        className="font-serif italic font-semibold text-foreground"
        style={{ fontSize: "16px", letterSpacing: "-0.01em" }}
      >
        eekai
      </span>
      {showTamil && (
        <span
          className="text-muted-foreground"
          style={{ fontSize: "9px", letterSpacing: "0.06em", marginTop: "1px" }}
        >
          ஈகை
        </span>
      )}
    </span>
  );
}

/** Full inline logo — mark + wordmark side by side. */
export function Logo({
  expanded = true,
  size = 28,
  showTamil = false,
  className = "",
}: {
  expanded?: boolean;
  size?: number;
  showTamil?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {expanded && <LogoWordmark expanded showTamil={showTamil} />}
    </span>
  );
}
