// ─────────────────────────────────────────────────────────
// src/app/admin/apply/lib/exportDoc.ts
// ATS-safe DOCX: single column, Arial 10.5pt, standard headings.
// ─────────────────────────────────────────────────────────

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { DocType } from "../types";
import { docFilename, downloadBlob, segmentDocument } from "./exportText";

export async function exportDoc(
  text: string,
  docType: DocType,
  roleName?: string,
  companyName?: string
): Promise<void> {
  const segments = segmentDocument(text);

  const children = segments.map((seg) => {
    switch (seg.type) {
      case "name":
        return new Paragraph({
          children: [
            new TextRun({ text: seg.text, bold: true, size: 32, font: "Arial" }),
          ],
          spacing: { after: 60 },
          alignment: AlignmentType.LEFT,
        });
      case "contact":
        return new Paragraph({
          children: [
            new TextRun({ text: seg.text, size: 19, color: "444444", font: "Arial" }),
          ],
          spacing: { after: 160 },
          alignment: AlignmentType.LEFT,
        });
      case "heading":
        return new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: seg.text,
              bold: true,
              size: 22,
              font: "Arial",
              color: "000000",
            }),
          ],
          spacing: { before: 220, after: 80 },
          alignment: AlignmentType.LEFT,
        });
      case "bullet":
        return new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: seg.text, size: 21, font: "Arial" }),
          ],
          spacing: { after: 40 },
          alignment: AlignmentType.LEFT,
        });
      default:
        return new Paragraph({
          children: [
            new TextRun({ text: seg.text, size: 21, font: "Arial" }),
          ],
          spacing: { after: 120 },
          alignment: AlignmentType.LEFT,
        });
    }
  });

  const doc = new Document({
    creator: "Yabets Kifle",
    title: "Yabets Kifle — Document",
    description: "Generated via Yabets Kifle Portfolio Apply Studio",
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1"
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, docFilename(docType, "docx", roleName, companyName));
}
