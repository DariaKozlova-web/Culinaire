import { type RequestHandler, type Response } from 'express';
import { Resend } from 'resend';
import { contactSchema } from '#schemas';
import { z } from 'zod/v4';

interface TurnstileResult {
  success: boolean;
  error?: string[];
}

export type contactDTO = z.infer<typeof contactSchema>;

export const sendContactEmail: RequestHandler<
  {},
  { success: boolean } | { error: string },
  contactDTO
> = async (req, res, next): Promise<void> => {
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;

    if (!resendKey) {
      console.error('Missing RESEND_API_KEY in environment variables.');
      res.status(503).json({
        success: false,
        error: 'Email service is currently unavailable.'
      });
      return;
    }

    if (!turnstileSecret) {
      console.error('Missing TURNSTILE_SECRET_KEY in environment variables.');
      res.status(503).json({
        success: false,
        error: 'Security verification service is currently unavailable.'
      });
      return;
    }

    if (!receiverEmail) {
      console.error('Missing CONTACT_RECEIVER_EMAIL in environment variables.');
      res.status(500).json({
        success: false,
        error: 'Server configuration error. Please try again later.'
      });
      return;
    }

    const resend = new Resend(resendKey);

    const { name, email, subject, message, turnstileToken } = req.body;

    if (!turnstileToken) {
      console.warn('Contact form submitted without turnstile token.');
      res.status(400).json({
        success: false,
        error: 'Security verification is missing.'
      });
      return;
    }

    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    const turnstileResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstileToken
      })
    });

    const outcome = (await turnstileResponse.json()) as TurnstileResult;

    if (!outcome.success) {
      console.error('Turnstile verification failed:', outcome['error']);
      res.status(400).json({
        success: false,
        error: 'Security check failed. Please try again.'
      });
      return;
    }

    const textMessage = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;

    await resend.emails.send({
      from: 'Culinaire <onboarding@resend.dev>',
      to: receiverEmail,
      replyTo: email,
      subject: `Culinaire - ${subject.toUpperCase()}`,
      text: textMessage
      //html: `...`
    });

    res.status(200).json({ success: true });
    return;
  } catch (error) {
    console.error('Email service error:', error);
    next(error);
  }
};
