// ─────────────────────────────────────────────────────────
// src/app/api/apply/route.ts — admin-only generation
// ─────────────────────────────────────────────────────────

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import {
  buildPrompt,
  formatPortfolioFacts,
  type PortfolioFacts,
} from "@/app/admin/apply/lib/buildPrompt";
import type { GeneratePayload } from "@/app/admin/apply/types";
import { isAdminRequest } from "@/lib/adminAuth";
import { PortfolioService } from "@/services/portfolio";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function getResumeFacts(): Promise<string> {
  const [profile, experience, skills, education, certifications, projects] =
    await Promise.all([
      PortfolioService.getProfile(),
      PortfolioService.getExperience(),
      PortfolioService.getSkills(),
      PortfolioService.getEducation(),
      PortfolioService.getCertifications(),
      PortfolioService.getProjects(),
    ]);

  const facts: PortfolioFacts = {
    profile: profile as unknown as Record<string, unknown> | null,
    experience,
    skills,
    education,
    certifications,
    projects,
  };
  return formatPortfolioFacts(facts);
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminRequest(req))) {
      return NextResponse.json(
        { error: "Unauthorized. Sign in to the admin panel first." },
        { status: 401 }
      );
    }

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
    const isResume = payload.docType === "ats_resume";
    const facts = isResume ? await getResumeFacts() : undefined;
    const prompt = buildPrompt(payload, facts);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // Resume is grounded server-side from the DB — no URL fetch needed.
        tools: isResume ? undefined : [{ urlContext: {} }],
        temperature: isResume ? 0.4 : 0.85,
        maxOutputTokens: isResume ? 3000 : 1200,
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
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
