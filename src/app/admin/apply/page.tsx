// ─────────────────────────────────────────────────────────
// src/app/admin/apply/page.tsx — Apply Studio (admin only)
// ─────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ApplyClient } from "./components/ApplyClient";

export const metadata: Metadata = {
  title: "Apply Studio — Admin · Yabets Kifle",
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return <ApplyClient />;
}
