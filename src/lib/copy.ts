import React from "react"

export type SiteCopy = Record<string, string>

/** Get a copy value with fallback. Use in components: t(copy, "about.eyebrow", "— 01 / About") */
export const t = (copy: SiteCopy | undefined, key: string, fallback: string): string => {
  const v = copy?.[key]
  return v && v.length > 0 ? v : fallback
}

/**
 * Render a "rich title" string where *italic phrases* become italic spans.
 * Example: "Tools of the *trade*" → "Tools of the <i>trade</i>"
 */
export const renderRichTitle = (text: string, italicClassName = "italic"): React.ReactNode => {
  if (!text) return null
  const parts = text.split(/(\*[^*]+\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith("*") && p.endsWith("*")) {
      return React.createElement("span", { key: i, className: italicClassName }, p.slice(1, -1))
    }
    return p
  })
}

/**
 * Like renderRichTitle but also splits on \n into separate lines (used in footer).
 */
export const renderRichLines = (text: string, italicClassName = "italic"): React.ReactNode => {
  if (!text) return null
  const lines = text.split(/\\n|\n/)
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*[^*]+\*)/g)
    return React.createElement(
      React.Fragment,
      { key: lineIdx },
      ...parts.map((p, i) => {
        if (p.startsWith("*") && p.endsWith("*")) {
          return React.createElement("span", { key: i, className: italicClassName }, p.slice(1, -1))
        }
        return p
      }),
      lineIdx < lines.length - 1 ? React.createElement("br", { key: `br-${lineIdx}` }) : null
    )
  })
}
