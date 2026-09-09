import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 4000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  organisation?: unknown;
  interest?: unknown;
  message?: unknown;
  company?: unknown; // honeypot
};

const rateLimitWindowMs = 60_000;
const rateLimitMax = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < rateLimitWindowMs);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > rateLimitMax;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) : "";
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots that fill this hidden field are silently accepted and dropped.
  if (clean(payload.company)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(payload.name);
  const email = clean(payload.email);
  const organisation = clean(payload.organisation);
  const interest = clean(payload.interest);
  const message = clean(payload.message);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Enter your name.";
  if (!email) errors.email = "Enter your work email.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  if (!message) errors.message = "Tell us what you are working on.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors: errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;

  if (!apiKey || !recipient) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "This form is not yet connected to a live inbox. Contact infrastructure (RESEND_API_KEY / CONTACT_EMAIL) has not been configured on the server.",
      },
      { status: 503 },
    );
  }

  const fromAddress = process.env.EMAIL_FROM || "Tropical Digital Website <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: recipient,
      replyTo: email,
      subject: `New enquiry from ${name}${organisation ? ` (${organisation})` : ""}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        organisation ? `Organisation: ${organisation}` : null,
        interest ? `Area of interest: ${interest}` : null,
        "",
        "Message:",
        message,
        "",
        `Submitted from IP: ${ip}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      return NextResponse.json({ ok: false, error: "The email provider rejected this message. Please try again later." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong while sending. Please try again later." }, { status: 500 });
  }
}
