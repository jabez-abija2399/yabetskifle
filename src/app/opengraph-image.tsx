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
  const firstName = fullName.split(" ")[0]
  const lastName = fullName.split(" ").slice(1).join(" ") || "Kifle"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0F0F12",
          color: "#FAFAF7",
          padding: "70px 80px",
          fontFamily: "Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Lime glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, #C9F73C40, transparent 70%)",
          }}
        />

        {/* Top: status */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#C9F73C",
            }}
          />
          <span
            style={{
              fontSize: 18,
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#FAFAF780",
              fontWeight: 500,
            }}
          >
            Open to work · Full-time · Contract · Freelance
          </span>
        </div>

        {/* Center: massive name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
          }}
        >
          <span
            style={{
              fontSize: 200,
              fontStyle: "italic",
              color: "#FAFAF7E0",
            }}
          >
            {firstName}
          </span>
          <span style={{ fontSize: 200, display: "flex", alignItems: "baseline" }}>
            {lastName}
            <span style={{ color: "#C9F73C", marginLeft: 4 }}>.</span>
          </span>
        </div>

        {/* Bottom: role + signature */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #FAFAF725",
            paddingTop: 28,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 500,
              maxWidth: 700,
            }}
          >
            {role}
          </span>
          <span
            style={{
              fontSize: 16,
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#FAFAF770",
              fontWeight: 500,
            }}
          >
            Portfolio · 2026
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
