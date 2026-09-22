// ─────────────────────────────────────────────────────────
// src/app/api/apply/route.ts
// ─────────────────────────────────────────────────────────

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/app/apply/lib/buildPrompt";
import type { GeneratePayload } from "@/app/apply/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Partial<GeneratePayload>;

    if (!body.docType || !body.style || !body.jobDescription?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: docType, style, jobDescription." },
        { status: 400 }
      );
    }

    if (body.jobDescription.trim().length < 20) {
      return NextResponse.json(
        { error: "Job description too short. Please paste the full description." },
        { status: 400 }
      );
    }

    const payload = body as GeneratePayload;
    const prompt = buildPrompt(payload);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ urlContext: {} }],
        temperature: 0.85,
        maxOutputTokens: 1200,
      },
    });

    const output = response.text;

    if (!output?.trim()) {
      return NextResponse.json(
        { error: "Empty response from AI. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ output: output.trim() });

  } catch (err) {
    console.error("[/api/apply] Error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
