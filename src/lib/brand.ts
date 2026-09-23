/**
 * Brand palette — JS/TS source of truth (mirrors globals.css :root).
 * Use in non-DOM contexts: Satori/OG images, jsPDF exports, SVG generation.
 * In markup prefer semantic classes: bg-accent, text-accent, text-signal,
 * text-muted-foreground — they resolve per theme automatically.
 */
export const brand = {
  /** Warm paper-white — page background */
  paper: "#F5F3EE",
  /** Ink-black — primary text */
  ink: "#1A1D23",
  /** Deep blueprint teal — accent (links, active states, key data) */
  teal: "#2D5F6B",
  /** Teal hover/deep shade */
  tealDeep: "#234B54",
  /** Muted rust-red — secondary accent (status indicators only) */
  rust: "#C4432E",
  /** Warm gray — secondary text/metadata */
  warmGray: "#8B8577",
  /** Hairline border on paper */
  border: "#DDD8CD",
} as const
