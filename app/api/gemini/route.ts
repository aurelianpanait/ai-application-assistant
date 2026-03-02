import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export async function POST(request: Request) {
  try {
    const ai = getAiClient();
    const { cv, jobDescription } = await request.json();

    if (!cv || !jobDescription) {
      return NextResponse.json(
        { error: 'CV and Job Description are required' },
        { status: 400 }
      );
    }

    const prompt = `
      You are an expert career coach and ATS optimization specialist.
      Your task is to help a student/early professional tailor their application to a specific job description.

      Core rules:
      - Use ONLY information provided in the user's CV.
      - NEVER invent experience, skills, companies, or achievements.
      - Optimize outputs for ATS keyword matching based on the job description.
      - Write concise, professional, impact-focused bullet points.
      - Prefer quantified achievements when possible.
      - Keep tone professional and realistic for internships and graduate roles.

      User's CV:
      ${cv}

      Job Description:
      ${jobDescription}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cvBulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Tailored CV bullet points highlighting relevant experience from the user CV for the job description.',
            },
            atsKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of ATS keywords extracted from the job description that match the user CV.',
            },
            coverLetter: {
              type: Type.STRING,
              description: 'A tailored cover letter (max 150 words) using ONLY facts from the user CV, addressing the job description.',
            },
          },
          required: ['cvBulletPoints', 'atsKeywords', 'coverLetter'],
        },
        systemInstruction: 'You are a career assistant. Always return valid JSON.',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response from AI.');
    }

    // Return only the generated text to the frontend
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating content.' },
      { status: 500 }
    );
  }
}
