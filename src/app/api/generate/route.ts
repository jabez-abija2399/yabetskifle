import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const PORTFOLIO_URL = "https://yabetskifle.vercel.app/";

export async function POST(req: NextRequest) {
  try {
    const { docType, style, jobDescription, companyName, roleName } =
      await req.json();

    if (!jobDescription || !docType || !style) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt({
      docType,
      style,
      jobDescription,
      companyName,
      roleName,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // This tells Gemini to read the URL directly — no manual scraping
        tools: [{ urlContext: {} }],
      },
    });

    const output = response.text;

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}

function buildPrompt({
  docType,
  style,
  jobDescription,
  companyName,
  roleName,
}: {
  docType: string;
  style: string;
  jobDescription: string;
  companyName?: string;
  roleName?: string;
}) {
  const styleGuides: Record<string, string> = {
    punchy: `STYLE: Punchy. Open with a result or project — not "I am writing to apply". 3 short paragraphs max. Every sentence earns its place. No fluff.`,
    story: `STYLE: Story-driven. Open with a specific moment or project that connects to this role. Let the story do the selling. Don't list skills — show them through what was built.`,
    technical: `STYLE: Technical depth. Lead with exact stack and specifics. For engineers who want to know what you can actually do, not what you claim.`,
    warm: `STYLE: Warm and direct. Sounds like a real person — mentions curiosity, care, collaboration. Professional but human. Good for startup culture fits.`,
  };

  const docGuides: Record<string, string> = {
    cover_letter: `
Write a cover letter for the role of "${roleName || "the position"}" at "${companyName || "the company"}".
- 3 to 4 short paragraphs
- Reference at least one real project from the portfolio with a concrete detail
- End with a confident close — not "I hope to hear from you"
- No "Dear Hiring Manager" opener — open with something real
    `,
    proposal: `
Write a freelance project proposal.
Structure:
1. Show you understand the client's specific problem (from the job description)
2. Your solution — reference real projects from the portfolio as proof
3. Why you specifically — one short paragraph
4. A simple next step CTA
No pricing — that comes in discussion.
    `,
    cold_dm: `
Write a cold LinkedIn message.
- Maximum 80 words
- One clear ask at the end
- Reference something specific about the company or role
- No attachments or links mentioned
- End with a simple yes/no question
    `,
  };

  return `
You are writing a job application document on behalf of the person whose portfolio is at: ${PORTFOLIO_URL}

IMPORTANT: Read that portfolio website fully. Extract:
- Their name, skills, tech stack
- Every project they have built with real details
- Their work experience and roles
- Their writing voice and tone from the About section and bio
- Their testimonials and what clients say about them
- Their location, availability, and what roles they are open to

Then use ALL of that real information to write the following document.

${styleGuides[style] || styleGuides.punchy}

${docGuides[docType] || docGuides.cover_letter}

CRITICAL RULES — never break these:
- Never write "I am highly motivated" or "I am passionate about"
- Never write "I believe I would be a great fit" or "I am a strong communicator"
- Never invent projects or details not on the portfolio
- Always reference at least one real project by name with a real detail
- Sound like a human wrote it — calm, confident, specific
- Match the voice and tone from their About section exactly
- Output ONLY the document text. No explanations, no headers, no "here is your letter".

Job description / client brief:
${jobDescription}
`.trim();
}