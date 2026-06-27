import { Resend } from "resend";
import { NextResponse } from "next/server";
import {
  hasContactFormErrors,
  validateContactForm,
  type ContactFormData,
} from "@/lib/contact-form";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many messages sent. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 },
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.CONTACT_TO_EMAIL || "uttham188@gmail.com";

    if (!fromEmail) {
      return NextResponse.json(
        { error: "Sender email is not configured." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as Partial<ContactFormData>;
    const payload: ContactFormData = {
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      subject: String(body.subject ?? ""),
      message: String(body.message ?? ""),
    };

    const errors = validateContactForm(payload);
    if (hasContactFormErrors(errors)) {
      return NextResponse.json(
        { error: "Please fix the highlighted fields.", fieldErrors: errors },
        { status: 400 },
      );
    }

    const name = payload.name.trim();
    const email = payload.email.trim();
    const subject = payload.subject.trim();
    const message = payload.message.trim();

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `[Portfolio Contact] ${subject}`,
      html: `
        <h2>New portfolio message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send your message. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
