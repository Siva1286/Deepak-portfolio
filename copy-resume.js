const fs = require('fs');
const path = require('path');

// Target paths inside the workspace public folder
const targetPath1 = path.join(__dirname, 'public', 'resume', 'Deepak_P_Resume.pdf');
const targetPath2 = path.join(__dirname, 'public', 'assets', 'resume', 'Deepak_P_Resume.pdf');

// If the files already exist in public folder (e.g. committed to Git / already copied), we don't need to do anything
if (fs.existsSync(targetPath1) && fs.existsSync(targetPath2)) {
  console.log('[Resume Setup] Official resume PDF already exists in public folders. Skipping copy.');
  process.exit(0);
}

// Source path of the user uploaded PDF resume from the Gemini workspace
const sourcePath = 'C:\\Users\\DEEPAK\\.gemini\\antigravity\\brain\\b8dfbbc3-2b77-4943-85d6-621858694cf9\\.user_uploaded\\media__1784180191640.pdf';

try {
  if (fs.existsSync(sourcePath)) {
    // Create directories if they don't exist
    const dir1 = path.dirname(targetPath1);
    const dir2 = path.dirname(targetPath2);
    
    if (!fs.existsSync(dir1)) {
      fs.mkdirSync(dir1, { recursive: true });
    }
    if (!fs.existsSync(dir2)) {
      fs.mkdirSync(dir2, { recursive: true });
    }

    // Copy files
    fs.copyFileSync(sourcePath, targetPath1);
    fs.copyFileSync(sourcePath, targetPath2);

    console.log('SUCCESS: Copied official resume PDF to public directories:');
    console.log('  -> ' + targetPath1);
    console.log('  -> ' + targetPath2);
  } else {
    // If running in a CI/CD environment like Vercel, the source path won't exist.
    // That is fine as long as the resume PDF has been copied locally and committed to Git.
    console.warn('[Resume Warning] Official source resume PDF not found at: ' + sourcePath);
    console.warn('Ensure you run "node copy-resume.js" locally once and commit the copied file to your repository before deploying.');
  }
} catch (error) {
  console.error('ERROR: Failed to copy resume PDF:', error.message);
}
