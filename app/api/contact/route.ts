import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 4000;
// Generous headroom over the actual field lengths this form ever legitimately sends,
// while rejecting the multi-megabyte bodies a scripted abuser could otherwise send
// (see SECURITY_REPORT.md, finding SEC-03). App Router route handlers impose no
// default body-size limit of their own.
const MAX_BODY_BYTES = 20_000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  organisation?: unknown;
  interest?: unknown;
  message?: unknown;
  company?: unknown; // honeypot
};

// Per-IP and global request counters. Deliberately simple (in-memory, per-process):
// - Per-IP limiting trusts the X-Forwarded-For header, which is only meaningful
//   behind a proxy that overwrites it with the real client IP (Vercel does this
//   at the edge). Deployed without such a proxy, this header is attacker-supplied
//   and trivially spoofable — see SECURITY_REPORT.md finding SEC-01.
// - The global counter below exists specifically as a backstop against that
//   bypass: even an attacker rotating a fake IP on every request cannot drive
//   unbounded traffic through this endpoint or the Resend sending quota.
// - Both counters live in process memory, so they reset on redeploy/cold start
//   and are not shared across concurrent serverless instances (finding SEC-02).
//   A production deployment expecting sustained abuse should move this to a
//   shared store (e.g. Vercel KV / Upstash) and add a CAPTCHA/Turnstile challenge.
const rateLimitWindowMs = 60_000;
const perIpMax = 5;
const globalMax = 30;
const ipRequestLog = new Map<string, number[]>();
let globalRequestLog: number[] = [];

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  globalRequestLog = globalRequestLog.filter((t) => now - t < rateLimitWindowMs);
  globalRequestLog.push(now);
  if (globalRequestLog.length > globalMax) return true;

  const timestamps = (ipRequestLog.get(ip) ?? []).filter((t) => now - t < rateLimitWindowMs);
  timestamps.push(now);
  ipRequestLog.set(ip, timestamps);
  return timestamps.length > perIpMax;
}

// Strips CR/LF before any user-controlled value is interpolated into the email
// subject line. Resend's API takes structured JSON fields rather than raw SMTP
// header text, which already rules out classic header injection — this is
// defense-in-depth for that field specifically, not a workaround for a confirmed
// bypass (see SECURITY_REPORT.md finding SEC-05).
function clean(value: unknown): string {
  return typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim().slice(0, MAX_FIELD_LENGTH) : "";
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  // Non-browser or same-site navigations can omit Origin; that's expected and
  // isn't itself a signal of abuse. Only reject when Origin is present AND
  // doesn't match this request's own host — this catches cross-site browser
  // submissions (including the fetch(..., {mode:'no-cors'}) trick that avoids
  // a CORS preflight) without breaking legitimate same-origin usage.
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin submissions are not accepted." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Request is too large." }, { status: 413 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Request is too large." }, { status: 413 });
  }

  let payload: ContactPayload;
  try {
    payload = JSON.parse(rawBody);
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
