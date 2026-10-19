import { ImageResponse } from "next/og"
import { PortfolioService } from "@/services/portfolio"
import { brand } from "@/lib/brand"

export const runtime = "nodejs"
export const revalidate = 3600
export const alt = "Yabets Kifle — Frontend Developer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const profile = await PortfolioService.getProfile().catch(() => null)
  const fullName = profile?.full_name || "Yabets Kifle"
  const role = profile?.role_title || "Frontend Developer · Full-stack with Next.js"
  const year = new Date().getFullYear()

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: brand.ink950,
          backgroundImage: `radial-gradient(circle at 88% 0%, rgba(200,241,105,0.28), transparent 45%), radial-gradient(circle at 0% 100%, rgba(139,124,255,0.22), transparent 50%)`,
          color: brand.mist,
          padding: "60px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top rail — availability pill + version */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 20px",
              borderRadius: 999,
              border: `1px solid rgba(200,241,105,0.4)`,
              backgroundColor: "rgba(200,241,105,0.1)",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: brand.volt }} />
            <span style={{ fontSize: 22, color: brand.volt, fontFamily: "ui-monospace, monospace" }}>
              Open to roles · Full-time · Contract · Remote
            </span>
          </div>
          <span style={{ fontSize: 20, fontFamily: "ui-monospace, monospace", color: brand.slate }}>
            {year}
          </span>
        </div>

        {/* Center — name and role */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 124,
              fontWeight: 700,
              letterSpacing: -5,
              color: brand.mist,
              lineHeight: 0.95,
            }}
          >
            {fullName}
          </span>
          <span style={{ fontSize: 34, color: brand.slate, maxWidth: 940 }}>{role}</span>
        </div>

        {/* Bottom rail — stack and tagline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid rgba(237,238,242,0.1)`,
            paddingTop: 26,
          }}
        >
          <span style={{ fontSize: 22, fontFamily: "ui-monospace, monospace", color: brand.mist }}>
            React · Next.js · TypeScript
          </span>
          <span style={{ fontSize: 22, color: brand.violet }}>Thoughtful, fast, beautifully crafted web products</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
