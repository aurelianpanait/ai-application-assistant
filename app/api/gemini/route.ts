import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

// Note: In the AI Studio environment, the key is injected as NEXT_PUBLIC_GEMINI_API_KEY.
// For a standard Vercel deployment, you can change this to process.env.GEMINI_API_KEY
// as long as you have it set in your Vercel environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
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