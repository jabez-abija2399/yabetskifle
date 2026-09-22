// ─────────────────────────────────────────────────────────
// src/app/apply/page.tsx
// ─────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ApplyClient } from "./components/ApplyClient";

export const metadata: Metadata = {
  title: "Apply — Yabets Kifle",
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return <ApplyClient />;
}
