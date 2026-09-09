# Security Release Checklist

Status as of this review. Re-check before each production deployment — several items are
environment-dependent and can't be permanently "done" from a code review alone.

- [x] No secrets committed — repo-wide pattern scan found no real secret values; `.env`/`.env.local`
      are git-ignored and untracked; only `.env.example` (empty placeholders) is tracked.
- [x] Dependencies reviewed — `npm audit` shows 2 findings, both traced to a `postcss` version
      bundled inside Next.js's own `node_modules`, assessed as not reachable at runtime (build-time
      tool only). The critical RCE originally flagging this project (CVE-2025-66478) was already
      patched in a prior session. Full major-version (Next 16) remediation is a deliberate, deferred
      decision — see `SECURITY_REPORT.md`.
- [x] Contact form server-side validation — required fields, email format, and length caps are all
      enforced server-side in `app/api/contact/route.ts`, independent of the client.
- [x] Contact form abuse protection — honeypot, per-IP + global rate limiting, Origin validation,
      and a request body size cap are all implemented and verified. **Caveat**: per-IP limiting
      trusts `X-Forwarded-For`, which is only trustworthy behind a proxy that overwrites it (see
      below).
- [x] Secure error handling — every error path returns a static, generic message; no stack traces,
      provider errors, internal paths, or environment values are ever returned to the client.
- [x] Security headers — CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
      Permissions-Policy, and HSTS are set via `next.config.ts`, verified with zero breakage against
      both a dev build and a real production build.
- [x] Secure environment configuration — secrets are read only in server-only code; no
      `NEXT_PUBLIC_*` variables exist; `.env.example` documents required variables without values.
- [x] No unnecessary public files — path-traversal and direct-access attempts against `.env`,
      `.env.example`, and project files outside `public/` all correctly return `404`.
- [x] No client-side secrets — confirmed via grep; `process.env` is referenced only in the
      server-only API route.
- [x] Redirect validation — not applicable; no redirect/callback functionality exists in the
      application.
- [x] CORS reviewed — no `Access-Control-Allow-Origin` is returned by default (no wildcard/reflected
      origin misconfiguration); the separate Origin-validation gap for the POST endpoint is fixed.
- [x] CSP reviewed — implemented, environment-aware (strict in production, `unsafe-eval` only in
      dev where Next.js's Fast Refresh genuinely requires it), verified with a headless browser
      against both dev and a production build with zero violations.
- [ ] **HTTPS/HSTS production configuration** — the `Strict-Transport-Security` header is set in
      code (no-op over plain HTTP, correct once served over HTTPS), but actual TLS termination,
      certificate management, and HTTP→HTTPS redirection are hosting-platform configuration, not
      something this local review can verify. **Confirm on the actual deployment before launch.**
- [x] Logging/privacy reviewed — no centralized logging exists in this local project (documented as
      an operational consideration, not a fabricated finding). The outbound contact-form email
      includes the submitter's IP in its body, sent only to Tropical Digital's own configured inbox
      — not written to any public or third-party log.
- [ ] **Legal/privacy pages reviewed separately** — `/privacy`, `/terms`, `/cookie-policy` are
      explicitly marked as unapproved drafts within the application itself and were out of scope
      for this technical review; they require legal sign-off before launch (tracked in the existing
      `FINAL_AUDIT.md`, not duplicated here).
- [ ] **Production email credentials configured securely** — `RESEND_API_KEY` and `CONTACT_EMAIL`
      must be set in the hosting platform's environment configuration (not committed to the repo).
      Not yet configured as of this review — the form correctly reports "not connected" rather than
      pretending to work. **Action required before the form can deliver mail in production.**
- [x] Security tests passed — see `SECURITY_TEST_CASES.md`: all applicable tests PASS; two items
      remain NOT APPLICABLE (documented, not fabricated) and two are marked for manual re-review
      once specific production conditions exist (see below).
- [x] Remaining accepted risks documented — see "Accepted risks" below.

## Accepted risks (documented, not blocking, revisit later)

1. **Per-IP rate limiting is only as strong as the deployment's trusted-proxy boundary.** Mitigated
   with a global backstop counter; full protection requires either (a) confirming the hosting
   platform overwrites `X-Forwarded-For` with the true client IP (true on Vercel), or (b) adding a
   CAPTCHA/Turnstile challenge and a shared rate-limit store for a deployment where that assumption
   doesn't hold.
2. **Rate-limit state is in-process memory**, not shared across concurrent/cold-started serverless
   instances. Acceptable for the current traffic expectations of a pre-launch marketing site;
   revisit with a shared store (Vercel KV / Upstash) if sustained abuse is observed.
3. **`postcss` advisory bundled inside `next`'s own dependencies** — not reachable in this app's
   usage (build-time only), fix requires a Next.js major-version upgrade deferred as a separate,
   bigger decision.
4. **CR/LF stripping on email-subject fields is defense-in-depth, not independently confirmed
   against the live Resend API** — no `RESEND_API_KEY` is configured in this environment. Retest
   with a real (test) key and a controlled recipient once credentials exist.
