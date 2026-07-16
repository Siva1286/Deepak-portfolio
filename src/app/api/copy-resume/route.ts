import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Exact path of the user uploaded PDF file from the Gemini Artifact workspace
    const sourcePath = 'C:\\Users\\DEEPAK\\.gemini\\antigravity\\brain\\b8dfbbc3-2b77-4943-85d6-621858694cf9\\.user_uploaded\\media__1784180191640.pdf';
    
    // Target paths inside the workspace public folder
    const targetPath1 = path.join(process.cwd(), 'public', 'resume', 'Deepak_P_Resume.pdf');
    const targetPath2 = path.join(process.cwd(), 'public', 'assets', 'resume', 'Deepak_P_Resume.pdf');

    // Create target directories if they don't exist
    await fs.mkdir(path.dirname(targetPath1), { recursive: true });
    await fs.mkdir(path.dirname(targetPath2), { recursive: true });

    // Perform copy operations
    await fs.copyFile(sourcePath, targetPath1);
    await fs.copyFile(sourcePath, targetPath2);

    console.log('[File Copy Success] Copied PDF resume to target public directories.');

    return NextResponse.json({
      success: true,
      message: 'Resume PDF successfully copied to public directories.',
      paths: [
        '/public/resume/Deepak_P_Resume.pdf',
        '/public/assets/resume/Deepak_P_Resume.pdf'
      ]
    });
  } catch (error: any) {
    console.error('[File Copy Error]', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to copy resume PDF.'
    }, { status: 500 });
  }
}
