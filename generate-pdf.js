const fs = require('fs');
const path = require('path');

// Stream content containing PDF graphic operations and formatted text
const streamBody = `BT
% Name
/F1 20 Tf
50 790 Td
(DEEPAK P) Tj

% Subtitle
/F2 10.5 Tf
0 -18 Td
(B.Tech Artificial Intelligence and Data Science Student) Tj

% Contact Info
/F2 9 Tf
0 -15 Td
(Phone: +91 9787838534  |  Email: deepaksiva641@gmail.com  |  GitHub: github.com/Siva1286) Tj
0 -12 Td
(LeetCode: leetcode.com/u/Deepakshiva-06  |  Location: Erode, Tamil Nadu, India) Tj
ET

% Drawing a nice visual divider line
0.7 w
50 735 m
545 735 l
S

BT
% Executive Summary
/F1 11 Tf
50 715 Td
(EXECUTIVE SUMMARY) Tj

/F2 9 Tf
0 -14 Td
(B.Tech Artificial Intelligence and Data Science student with hands-on experience in Python, Java, Machine Learning,) Tj
0 -12 Td
(Data Analytics, and Full Stack Development. Skilled in developing real-world applications using modern) Tj
0 -12 Td
(technologies and solving problems through efficient programming and AI-driven solutions. Experienced in building) Tj
0 -12 Td
(MERN stack applications and working on innovative technology projects. Passionate about software development,) Tj
0 -12 Td
(artificial intelligence, and data-driven problem solving.) Tj

% Section: Key Projects
/F1 11 Tf
0 -22 Td
(KEY PROJECTS) Tj

% Project 1
/F1 9.5 Tf
0 -14 Td
(DORMFIX: Smart Hostel Maintenance Workflow Management System \\(MERN Stack\\)) Tj
/F2 9 Tf
0 -12 Td
(- Built a comprehensive web application designed to streamline hostel maintenance and utility request workflows) Tj
0 -11 Td
(- Empowered students to seamlessly raise maintenance complaints and track their real-time resolution progress) Tj
0 -11 Td
(- Integrated robust administrative panels allowing immediate complaint assignment, prioritization, and automated updates) Tj
0 -11 Td
(- Engineered the full-stack architecture completely utilizing MongoDB, Express.js, React.js, and Node.js) Tj

% Project 2
/F1 9.5 Tf
0 -16 Td
(IoT-Based MSand Quality Assurance System \\(ESP32, IoT\\)) Tj
/F2 9 Tf
0 -12 Td
(- Designed an IoT-based quality assurance system for on-site assessment of Manufactured Sand in construction) Tj
0 -11 Td
(- Developed a portable monitoring system using ESP32 with temperature and moisture sensors to analyze MSand) Tj
0 -11 Td
(- Enabled quick on-site quality evaluation by collecting and monitoring key parameters before construction usage) Tj
0 -11 Td
(- Reduced dependency on time-consuming laboratory-based testing by providing instant field-level insights) Tj
0 -11 Td
(- Implemented an IoT approach to improve efficiency, reliability, and decision-making in material quality monitoring) Tj

% Section: Education
/F1 11 Tf
0 -20 Td
(EDUCATION) Tj

/F1 9.5 Tf
0 -14 Td
(Bachelor of Technology in Artificial Intelligence and Data Science) Tj
/F2 9 Tf
0 -11 Td
(Nandha Engineering College, Erode, Tamil Nadu  --  Expected: 05/2027) Tj

/F1 9.5 Tf
0 -15 Td
(Higher Secondary School \\(12th\\)) Tj
/F2 9 Tf
0 -11 Td
(Vivekananda Matriculation Higher Secondary School, Erode, Tamil Nadu  --  Completion: 04/2023) Tj

% Section: Technical Skills
/F1 11 Tf
0 -20 Td
(TECHNICAL SKILLS) Tj

/F1 9 Tf
0 -14 Td
(Programming Languages: ) Tj
/F2 9 Tf
125 0 Td
(Python, Java, SQL, C++) Tj

/F1 9 Tf
-125 -12 Td
(AI & Machine Learning: ) Tj
/F2 9 Tf
125 0 Td
(NumPy, Pandas, Data Analysis) Tj

/F1 9 Tf
-125 -12 Td
(Data Visualization: ) Tj
/F2 9 Tf
125 0 Td
(Tableau, Microsoft PowerBI) Tj

/F1 9 Tf
-125 -12 Td
(Tools & Platforms: ) Tj
/F2 9 Tf
125 0 Td
(Git, VS Code, GitHub) Tj

/F1 9 Tf
-125 -12 Td
(Databases: ) Tj
/F2 9 Tf
125 0 Td
(MySQL, MongoDB) Tj

% Section: Workshops & Internships
/F1 11 Tf
-125 -20 Td
(WORKSHOPS & INTERNSHIPS) Tj

/F1 9.5 Tf
0 -14 Td
(Data Analytics Internship) Tj
/F2 9 Tf
160 0 Td
(SAN Technovation) Tj

/F1 9.5 Tf
-160 -14 Td
(Python Programming Workshop) Tj
/F2 9 Tf
160 0 Td
(IIT Madras Research Park) Tj
ET
`;

const pdfHeader = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /Resources <<
    /Font <<
      /F1 4 0 R
      /F2 5 0 R
    >>
  >>
  /MediaBox [0 0 595.275 841.889]
  /Contents 6 0 R
>>
endobj
4 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj
5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj
6 0 obj
`;

// Build the stream wrapper
const streamHeader = `<< /Length ${Buffer.byteLength(streamBody, 'utf-8')} >>\nstream\n`;
const streamFooter = `\nendstream\nendobj\n`;

// Calculate byte offsets dynamically
const parts = [
  { name: 'header', content: pdfHeader },
  { name: 'streamHeader', content: streamHeader },
  { name: 'streamBody', content: streamBody },
  { name: 'streamFooter', content: streamFooter }
];

let offset = 0;
const offsets = [];
let fullText = '';

// Calculate offsets of all PDF objects
// Obj 1: Catalog
offsets.push(offset + pdfHeader.indexOf('1 0 obj'));
// Obj 2: Pages
offsets.push(offset + pdfHeader.indexOf('2 0 obj'));
// Obj 3: Page
offsets.push(offset + pdfHeader.indexOf('3 0 obj'));
// Obj 4: Font Bold
offsets.push(offset + pdfHeader.indexOf('4 0 obj'));
// Obj 5: Font Regular
offsets.push(offset + pdfHeader.indexOf('5 0 obj'));

// Add length of header
offset += Buffer.byteLength(pdfHeader, 'utf-8');

// Obj 6: Stream Contents
offsets.push(offset);

offset += Buffer.byteLength(streamHeader, 'utf-8') + Buffer.byteLength(streamBody, 'utf-8') + Buffer.byteLength(streamFooter, 'utf-8');

const startxref = offset;

// Generate Xref table
let xref = `xref
0 ${offsets.length + 1}
0000000000 65535 f \n`;

for (let i = 0; i < offsets.length; i++) {
  const pad = '0000000000' + offsets[i];
  xref += pad.substring(pad.length - 10) + ' 00000 n \n';
}

const trailer = `trailer
<<
  /Size ${offsets.length + 1}
  /Root 1 0 R
>>
startxref
${startxref}
%%EOF
`;

const fullPdf = pdfHeader + streamHeader + streamBody + streamFooter + xref + trailer;

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Write file using binary encoding to ensure exact bytes are preserved
fs.writeFileSync(path.join(publicDir, 'resume.pdf'), fullPdf, 'binary');
console.log('Successfully generated the final, real resume.pdf inside the public/ folder!');
