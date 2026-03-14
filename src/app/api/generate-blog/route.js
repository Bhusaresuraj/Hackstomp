import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { prompt, title, doctorName } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const effectivePrompt = prompt?.trim() || title?.trim();

    if (!apiKey) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY in server environment." },
        { status: 500 }
      );
    }

    if (!effectivePrompt) {
      return Response.json(
        { error: "Prompt missing. Add a title or rough notes first." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(
      `Write a professional medical blog for a healthcare platform.

Make it:
- grammatically correct
- educational
- suitable for public health awareness
- structured with a strong title, introduction, key points, and conclusion
- written in clear plain English

Doctor:
${doctorName || "Doctor"}

Keywords or rough notes:
${effectivePrompt}`
    );

    const text = result.response.text();

    return Response.json({ blog: text });

  } catch (error) {

    console.error("Gemini error:", error);

    return Response.json(
      { error: error?.message || "AI generation failed" },
      { status: 500 }
    );

  }
}
