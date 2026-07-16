import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// In-memory rate limiting map for basic spam mitigation
// Maps IP Address -> { count, lastRequestTime }
const rateLimitMap = new Map<string, { count: number; lastRequestTime: number }>();

// Rate limit configuration: Max 5 submissions per hour per IP
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * Basic server-side rate limiter based on client IP
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitData = rateLimitMap.get(ip);

  if (!limitData) {
    rateLimitMap.set(ip, { count: 1, lastRequestTime: now });
    return false;
  }

  // If the window has expired, reset the rate limit counter
  if (now - limitData.lastRequestTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastRequestTime: now });
    return false;
  }

  // If within the window, check count
  if (limitData.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  // Increment the request count
  limitData.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    // 1. Get client IP address for logging, rate limiting, and email metadata
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    
    // 2. Basic Rate Limiting check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many contact requests from this IP. Please try again in an hour.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, phone, subject, message, website_url, timestamp } = body;

    // 3. Honeypot check for spam bots
    // website_url is hidden via CSS. If a bot fills it in, quietly discard the request.
    if (website_url) {
      console.warn(`[Spam Blocked] Honeypot field filled by IP: ${ip}`);
      // Return a simulated success response so the bot thinks it succeeded
      return NextResponse.json({ success: true, message: 'Message sent successfully (mocked).' });
    }

    // 4. Quick Bot check: Dynamic submission time check
    // If the submission took less than 2.0 seconds since page/component mount, it's likely a bot.
    if (timestamp && Date.now() - Number(timestamp) < 2000) {
      console.warn(`[Spam Blocked] Submitted too quickly (${Date.now() - Number(timestamp)}ms) by IP: ${ip}`);
      return NextResponse.json({ success: true, message: 'Message sent successfully (mocked).' });
    }

    // 5. Server-side validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    // Cleaned fields
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone ? phone.trim() : '';
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();
    const formattedDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    // 6. Save Contact Request to local contacts.json file
    const contactRecord = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
      date: formattedDate,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || 'Unknown',
    };

    const filePath = path.join(process.cwd(), 'contacts.json');
    let contacts: any[] = [];

    try {
      // Attempt to read existing contacts file
      const fileData = await fs.readFile(filePath, 'utf-8');
      contacts = JSON.parse(fileData);
    } catch (readError: any) {
      // If the file doesn't exist, start with an empty list
      if (readError.code !== 'ENOENT') {
        console.error('Error reading contacts.json:', readError);
      }
    }

    // Append new contact and write to file
    contacts.push(contactRecord);
    try {
      await fs.writeFile(filePath, JSON.stringify(contacts, null, 2), 'utf-8');
    } catch (writeError) {
      // Log write errors but don't fail the request (Vercel has read-only temp systems)
      console.error('Error writing to contacts.json:', writeError);
    }

    // 7. Resend API Email notification
    const resendApiKey = process.env.RESEND_API_KEY;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'deepaksiva641@gmail.com';
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

    if (!resendApiKey || resendApiKey.includes('your_api_key_goes_here')) {
      console.log('--- DEVELOPMENT MOCK EMAIL ---');
      console.log(`To: ${receiverEmail}`);
      console.log(`From: ${fromEmail}`);
      console.log(`Subject: ${cleanSubject}`);
      console.log(`Body:`, contactRecord);
      console.log('------------------------------');

      return NextResponse.json({
        success: true,
        message: 'Message received locally (email skipped due to missing RESEND_API_KEY).',
        record: contactRecord
      });
    }

    // Call Resend API for the portfolio owner notification
    const ownerEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: `Deepak Portfolio <${fromEmail}>`,
        to: receiverEmail,
        reply_to: `${cleanName} <${cleanEmail}>`,
        subject: `New Portfolio Contact: ${cleanSubject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #2b6cb0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">New Contact Submission</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568; width: 140px;">Sender Name:</td>
                <td style="padding: 8px 0; color: #1a202c;">${cleanName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Sender Email:</td>
                <td style="padding: 8px 0; color: #1a202c;"><a href="mailto:${cleanEmail}">${cleanEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Sender Phone:</td>
                <td style="padding: 8px 0; color: #1a202c;">${cleanPhone || 'Not Provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Subject:</td>
                <td style="padding: 8px 0; color: #1a202c; font-style: italic;">${cleanSubject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Date & Time:</td>
                <td style="padding: 8px 0; color: #1a202c;">${formattedDate} (IST)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">User IP:</td>
                <td style="padding: 8px 0; color: #718096; font-size: 12px;">${ip}</td>
              </tr>
            </table>

            <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #2b6cb0; margin-top: 10px;">
              <h4 style="margin: 0 0 10px 0; color: #4a5568;">Message:</h4>
              <p style="margin: 0; line-height: 1.6; color: #2d3748; white-space: pre-wrap;">${cleanMessage}</p>
            </div>
            
            <p style="font-size: 11px; color: #a0aec0; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              This email was generated automatically by the contact system in the Deepak Portfolio website.
            </p>
          </div>
        `
      })
    });

    if (!ownerEmailResponse.ok) {
      const errorData = await ownerEmailResponse.json();
      console.error('Resend notification email failed:', errorData);
      return NextResponse.json(
        { error: `Failed to dispatch notification email: ${errorData.message || 'Unknown Resend Error'}` },
        { status: 500 }
      );
    }

    // Call Resend API for the visitor auto-reply confirmation email
    const visitorEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: `Deepak P <${fromEmail}>`,
        to: cleanEmail,
        subject: 'Thank You for Contacting Deepak',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px; color: #2d3748; background-color: #ffffff;">
            <h2 style="color: #4f46e5; margin-top: 0;">Hello ${cleanName},</h2>
            
            <p style="font-size: 15px; line-height: 1.6;">
              Thank you for reaching out.
            </p>
            <p style="font-size: 15px; line-height: 1.6;">
              I have received your message successfully.
            </p>
            <p style="font-size: 15px; line-height: 1.6;">
              I will get back to you as soon as possible.
            </p>
            
            <div style="margin: 25px 0; padding: 15px; background-color: #f8fafc; border-radius: 6px; border: 1px dashed #e2e8f0; font-size: 14px;">
              <strong style="color: #4f46e5;">Your Message Copy:</strong>
              <p style="margin: 5px 0 0 0; font-style: italic; color: #64748b; white-space: pre-wrap;">${cleanMessage}</p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
            
            <p style="font-size: 14px; margin-bottom: 0;">
              Best regards,<br />
              <strong>Deepak P</strong><br />
              <span style="color: #64748b; font-size: 12px;">AI & Data Science Student | Aspiring Data Analyst</span>
            </p>
          </div>
        `
      })
    });

    // Note: We don't fail the entire request if the visitor auto-reply fails, 
    // because Resend sandbox only allows sending to the account owner (meaning the auto-reply to the visitor will fail by default in sandbox).
    // Failing the request would block testing. So we log and succeed.
    if (!visitorEmailResponse.ok) {
      const errorData = await visitorEmailResponse.json();
      console.warn('Visitor auto-reply failed (this is expected on free Resend plans without custom domains):', errorData);
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });

  } catch (error: any) {
    console.error('Contact handler error:', error);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
