/**
 * Brand palette — JS/TS source of truth (mirrors globals.css :root).
 * Use in non-DOM contexts: Satori/OG images, jsPDF exports, SVG generation.
 * In markup prefer semantic classes: bg-accent, text-accent, text-signal,
 * text-muted-foreground — they resolve per theme automatically.
 */
export const brand = {
  /** Volt lime — the single loud accent on dark */
  volt: "#C8F169",
  /** Lighter volt for hover on dark */
  voltHover: "#D8FA8A",
  /** Violet — secondary glow and gradients */
  violet: "#8B7CFF",
  /** Near-black canvas — dark background */
  ink950: "#0A0B0E",
  /** Card surface on dark */
  ink850: "#14171D",
  /** Primary text on dark */
  mist: "#EDEEF2",
  /** Muted text on dark */
  slate: "#9499A8",
  /** Warm paper — light background */
  paper: "#F7F7F4",
  /** Deep green — accent on light (AA text) */
  green700: "#3F6212",
  /** Charcoal — primary text on light */
  charcoal: "#0B0C10",
  /** Muted text on light */
  graphite: "#5C5F6A",
} as const
