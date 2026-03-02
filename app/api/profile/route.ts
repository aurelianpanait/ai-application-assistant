import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'profile.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // Return default empty profile if file doesn't exist
      const defaultProfile = {
        education: [],
        experiences: [],
        projects: [],
        skillsKeywords: {
          hardSkills: '',
          softSkills: '',
          domains: ''
        }
      };
      return NextResponse.json(defaultProfile);
    }
    return NextResponse.json({ error: 'Failed to read profile data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Ensure directory exists
    const dirPath = path.dirname(dataFilePath);
    await fs.mkdir(dirPath, { recursive: true });

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save profile data' }, { status: 500 });
  }
}
