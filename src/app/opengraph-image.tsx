import { ImageResponse } from "next/og"
import { PortfolioService } from "@/services/portfolio"

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
          backgroundColor: "#F5F3EE",
          color: "#1A1D23",
          padding: "56px 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Drafting grid — faint technical lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: 0.5,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 1, backgroundColor: "#DDD8CD" }} />
          ))}
        </div>

        {/* Top rail — mono status + version */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: "#C4432E",
              }}
            />
            <span
              style={{
                fontSize: 20,
                fontFamily: "ui-monospace, monospace",
                color: "#8B8577",
              }}
            >
              Open to roles — Full-time · Contract · Remote
            </span>
          </div>
          <span
            style={{
              fontSize: 20,
              fontFamily: "ui-monospace, monospace",
              color: "#2D5F6B",
            }}
          >
            v{year}.sys
          </span>
        </div>

        {/* Center — name, intentional sans scale (no serif italic) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontFamily: "ui-monospace, monospace",
              color: "#2D5F6B",
            }}
          >
            system.profile // portfolio
          </span>
          <span
            style={{
              fontSize: 118,
              fontWeight: 700,
              letterSpacing: -4,
              color: "#1A1D23",
              lineHeight: 1,
            }}
          >
            {fullName}
          </span>
          <span
            style={{
              fontSize: 32,
              color: "#1A1D23",
              opacity: 0.85,
              maxWidth: 900,
            }}
          >
            {role}
          </span>
        </div>

        {/* Bottom rail — hairline + colophon */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #DDD8CD",
            paddingTop: 24,
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontFamily: "ui-monospace, monospace",
              color: "#1A1D23",
            }}
          >
            React · Next.js · TypeScript
          </span>
          <span
            style={{
              fontSize: 20,
              fontFamily: "ui-monospace, monospace",
              color: "#8B8577",
            }}
          >
            Systems, not screens · {year}
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
