// ─────────────────────────────────────────────────────────
// src/app/admin/apply/lib/exportPdf.tsx
// ATS-safe PDF: single column, Arial/Helvetica, 1" margins,
// plain text layer (searchable, machine-parseable).
// ─────────────────────────────────────────────────────────

import { Document, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import type { DocSegment } from "./exportText";
import { docFilename, downloadBlob, segmentDocument } from "./exportText";
import type { DocType } from "../types";

const FONT = "Helvetica";

const s = StyleSheet.create({
  page: {
    paddingTop: 54,
    paddingBottom: 54,
    paddingHorizontal: 54,
    fontFamily: FONT,
    color: "#000000",
    fontSize: 10.5,
    lineHeight: 1.5,
  },
  name: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
  contact: { fontSize: 9.5, color: "#333333", marginBottom: 10 },
  heading: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 14,
    marginBottom: 5,
    letterSpacing: 0.6,
  },
  bullet: {
    fontSize: 10.5,
    marginTop: 2,
    marginLeft: 14,
    flexDirection: "row",
  },
  bulletMarker: { width: 12 },
  paragraph: { fontSize: 10.5, marginTop: 2 },
});

function Segments({ segments }: { segments: DocSegment[] }) {
  return (
    <View>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case "name":
            return (
              <Text key={i} style={s.name}>
                {seg.text}
              </Text>
            );
          case "contact":
            return (
              <Text key={i} style={s.contact}>
                {seg.text}
              </Text>
            );
          case "heading":
            return (
              <Text key={i} style={s.heading}>
                {seg.text}
              </Text>
            );
          case "bullet":
            return (
              <View key={i} style={s.bullet} fixed={false}>
                <Text style={s.bulletMarker}>•</Text>
                <Text style={{ flex: 1 }}>{seg.text}</Text>
              </View>
            );
          default:
            return (
              <Text key={i} style={s.paragraph}>
                {seg.text}
              </Text>
            );
        }
      })}
    </View>
  );
}

export function ResumeDoc({ text }: { text: string }) {
  const segments = segmentDocument(text);
  return (
    <Document
      author="Yabets Kifle"
      title="Yabets Kifle — Resume"
      creator="Yabets Kifle Portfolio"
    >
      <Page size="A4" style={s.page}>
        <Segments segments={segments} />
      </Page>
    </Document>
  );
}

export async function exportPdf(
  text: string,
  docType: DocType,
  roleName?: string,
  companyName?: string
): Promise<void> {
  const blob = await pdf(<ResumeDoc text={text} />).toBlob();
  downloadBlob(blob, docFilename(docType, "pdf", roleName, companyName));
}
