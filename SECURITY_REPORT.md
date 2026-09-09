# Security Report

Authorized application security review. See `SECURITY_SCOPE.md` for architecture/scope and
`SECURITY_TEST_CASES.md` for the full test matrix. All findings below were reproduced against the
running local application (dev and/or production build) before being fixed; each fix was then
re-verified the same way. No external/production systems were tested. OWASP Top 10:2025 and ASVS
5.0.0 are used as a testing baseline only — this does not imply certification or compliance.

Status legend: **CONFIRMED VULNERABILITY**, **POTENTIAL RISK**, **BEST-PRACTICE IMPROVEMENT**.
All findings below were fixed during this review unless marked otherwise.

---

## SEC-01 — Rate limiter trusts a client-spoofable IP header

**Status**: CONFIRMED VULNERABILITY (mitigated, not fully eliminable in-code) · **Severity**: Medium
**OWASP Top 10:2025**: API4-equivalent / Unrestricted Resource Consumption · **ASVS**: V11.1.4
(anti-automation controls should not rely solely on client-supplied data)
**Affected component**: `app/api/contact/route.ts`

**Description**: The per-IP rate limiter keys on `request.headers.get("x-forwarded-for")`, a
header any HTTP client can set to an arbitrary value. The code applied no validation and had no
fallback signal.

**Reproduction** (see SECURITY_TEST_CASES.md SEC-T-09/10): sent 7 requests with no header (5th
correctly triggered `429`), then sent 7 more requests each with a different fabricated
`X-Forwarded-For` value — **all 7 succeeded**, fully bypassing the limiter.

**Impact**: An attacker can drive unlimited traffic through the endpoint, exhausting the Resend
sending quota/reputation and/or using the form as a spam relay. No data exposure or privilege
escalation — the endpoint is intentionally public and unauthenticated.

**Remediation applied**: Added a global (cross-IP) request counter as a backstop — even with an
infinitely rotated fake IP, total throughput is now capped (30 req/min). This does not eliminate
per-IP spoofing (that requires either a guaranteed trusted-proxy boundary or a persistent shared
store, both deployment/infrastructure decisions outside a code-only fix — see
SECURITY_RELEASE_CHECKLIST.md). Documented the trust assumption directly in the code.

**Verification**: SECURITY_TEST_CASES.md SEC-T-09/10/27.

---

## SEC-02 — In-memory rate-limit state does not survive serverless scaling

**Status**: POTENTIAL RISK (architectural, documented — not independently reproducible in this
single-process local environment) · **Severity**: Low–Medium · **OWASP**: same category as SEC-01
**Affected component**: `app/api/contact/route.ts`

**Description**: Both counters are plain in-memory `Map`/array state, scoped to one Node.js
process. On a serverless platform, concurrent or cold-started function instances each get their
own memory, so the limiter's effectiveness depends on how many warm instances are in play — it is
not a globally consistent limit in that environment.

**Remediation**: Documented in code and here rather than silently claimed as fixed. A production
deployment expecting sustained abuse should move counters to a shared store (Vercel KV / Upstash
Redis) and add a challenge (e.g. Cloudflare Turnstile) — listed as a recommendation in
SECURITY_RELEASE_CHECKLIST.md, not implemented here (new infrastructure dependency, outside a
contained code fix).

---

## SEC-03 — No application-level request body size limit

**Status**: CONFIRMED VULNERABILITY (fixed) · **Severity**: Low–Medium
**OWASP Top 10:2025**: Unrestricted Resource Consumption · **ASVS**: V13.1.1
**Affected component**: `app/api/contact/route.ts`

**Description**: App Router route handlers impose no default body-size limit (unlike the older
Pages API routes' 1MB default). The handler called `request.json()` directly, buffering the entire
body in memory regardless of size before any field-level truncation happened.

**Reproduction** (SEC-T-11): a 2MB JSON body was accepted and fully processed. Platform-level
limits (e.g. Vercel's ~4.5MB serverless payload cap) may mask this in that specific hosting
context, but the application code itself enforced nothing.

**Impact**: Memory-pressure resource-consumption risk, worse in any deployment context without an
equivalent platform-level cap (self-hosted `next start`, a different host, a custom server).

**Remediation applied**: Added an explicit `Content-Length` pre-check plus a post-read byte-length
check, both rejecting bodies over 20,000 bytes (generous headroom over any legitimate form
submission) with `413 Payload Too Large`, before JSON parsing.

**Verification**: SECURITY_TEST_CASES.md SEC-T-11/28 — a 30KB body now correctly returns `413`.

---

## SEC-04 — No Origin validation on a state-changing POST endpoint

**Status**: CONFIRMED VULNERABILITY (fixed) · **Severity**: Low–Medium
**OWASP Top 10:2025**: closest to A01:2025 Broken Access Control / CSRF-adjacent (CWE-352) ·
**ASVS**: V4.2.2
**Affected component**: `app/api/contact/route.ts`

**Description**: The route performed no `Origin`/`Referer` check. A direct `curl` POST from an
arbitrary `Origin` reached full validation and business logic (SEC-T-03/29). Because the endpoint
has no session/auth to hijack, classic CSRF (using a victim's authenticated session against their
will) does not apply — but the missing check still allows any third-party page to trigger
submissions through a visitor's browser (e.g. via `fetch(url, {mode:'no-cors', headers:{'Content-Type':'text/plain'}}, body: JSON.stringify(...))`, which needs no CORS preflight and is
undetectable by the CORS checks alone), which could be used to mass-generate enquiries or spam
via unwitting visitors' browsers as a distributed submission proxy.

**Remediation applied**: Added `isSameOrigin()` — rejects with `403` when an `Origin` header is
present and its host doesn't match the request's own `Host` header. Requests with **no** `Origin`
header (legitimate for some non-browser or same-site cases) are not blocked on that basis alone,
avoiding false positives.

**Verification**: SECURITY_TEST_CASES.md SEC-T-29/30/31 — matching-origin request still reaches
the normal flow (`503`, config-missing), mismatched-origin request now returns `403`, and a
request with no `Origin` header at all is unaffected.

---

## SEC-05 — User input interpolated into email subject without CR/LF stripping

**Status**: POTENTIAL RISK (fixed defense-in-depth; not independently confirmed exploitable) ·
**Severity**: Low · **OWASP**: A03:2025 Injection (email header injection family) · **ASVS**: V5.2.3
**Affected component**: `app/api/contact/route.ts`

**Description**: `name` and `organisation` were interpolated directly into the email `subject`
string with no CR/LF filtering. Resend's API takes structured JSON fields rather than a raw SMTP
header blob — which structurally rules out the classic `mail()`-style header-injection pattern —
but this could not be independently confirmed against the live provider in this environment, since
no `RESEND_API_KEY` is configured (every send attempt short-circuits at the config-check, before
reaching Resend — see SEC-T-04).

**Remediation applied**: `clean()` now strips all `\r`/`\n` from every field before use, closing
the gap regardless of how the provider itself behaves.

**Verification**: SECURITY_TEST_CASES.md SEC-T-04 (marked MANUAL REVIEW REQUIRED for the
provider-side behavior specifically — retest once `RESEND_API_KEY` is configured in a controlled
environment, sending only to a test address).

---

## SEC-06 — No security response headers (CSP, X-Frame-Options, etc.)

**Status**: CONFIRMED VULNERABILITY (fixed) · **Severity**: Medium
**OWASP Top 10:2025**: A05:2025 Security Misconfiguration · **ASVS**: V14.4.1–V14.4.7
**Affected component**: `next.config.ts` (previously absent entirely)

**Description**: `curl -I` against every route confirmed zero security headers were set —
no `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`,
`Referrer-Policy`, `Permissions-Policy`, or `Strict-Transport-Security`.

**Impact**: No defense-in-depth against clickjacking (any page could be framed by a third-party
site), MIME-sniffing, or (in the event of a future XSS regression) script injection — nothing was
constraining what could execute or where content could be embedded.

**Remediation applied**: Added a full header set via `next.config.ts` `headers()`, applied to
every route. The CSP is environment-aware: production omits `'unsafe-eval'` (not needed there);
development includes it because Next.js's dev-mode Fast Refresh/HMR requires `eval()` and the app
would otherwise fail to load in `npm run dev` — this was caught empirically during verification
(see below) and fixed by conditioning on `NODE_ENV`, not assumed. `script-src`/`style-src` still
need `'unsafe-inline'` in both environments: the App Router injects inline RSC-hydration
`<script>` tags on every page (architectural, would require adding CSP-nonce middleware to avoid —
documented as a future hardening item, not implemented here per the review's instruction not to
make unnecessary architectural changes), and `app/international/page.tsx` sets inline
`style={{ left, top }}` on its map markers.

**Verification**: SECURITY_TEST_CASES.md SEC-T-13 through SEC-T-26. Verified with a headless
browser across Home/About/International/Contact/Technology/Services in **both** `npm run dev`
(with `unsafe-eval`) and a real `npm run build && npm run start` (strict, without `unsafe-eval`):
zero CSP violations, zero console/page errors, and the contact form's `fetch()` call to
`/api/contact` completes normally (reaching the expected `503`) in both.

---

## SEC-07 — `X-Powered-By: Next.js` header disclosed

**Status**: BEST-PRACTICE IMPROVEMENT (fixed) · **Severity**: Informational
**OWASP**: A05:2025 Security Misconfiguration
**Affected component**: `next.config.ts`

**Description**: Next.js sets this header by default, confirming the framework (and implicitly
its version-range) to any client. Minor reconnaissance aid, not independently exploitable.

**Remediation applied**: `poweredByHeader: false`. Verified the header is absent from live
responses after the change.

---

## Confirmed-secure areas (tested, no finding)

These were actively tested, not assumed — see SECURITY_TEST_CASES.md for the specific evidence.

- **XSS (stored/reflected)** — PASS. Zero `dangerouslySetInnerHTML` usages anywhere in the codebase
  (grep-verified). All contact-form output is either (a) sent as plain-text email via Resend's
  `text` field, never an HTML template, or (b) rendered through normal React JSX (auto-escaped).
  `<script>`/`<img onerror>` payloads submitted through the form were processed with no reflection
  or execution anywhere in the response.
- **SQL/NoSQL/command/template/LDAP/XPath injection** — NOT APPLICABLE. No database, no shell
  execution, no template-rendering of user input anywhere in the application.
- **Authentication** — "No application authentication surface identified." No login, no sessions,
  no cookies of any kind are set by this application.
- **Authorization/IDOR/BOLA** — NOT APPLICABLE. Zero dynamic route segments, no per-user data, no
  protected routes of any kind exist.
- **Path traversal on static assets** — PASS. `../` and URL-encoded traversal sequences against
  `/images/...` and project-root files (`.env`, `.env.example`, `package.json`) all correctly
  returned `404`/`400`; nothing outside `public/` is reachable.
- **Secrets in the repository** — PASS. Full pattern-based scan across the repo (AWS keys, private
  key blocks, Resend/API-key patterns, DB connection strings with embedded credentials) returned
  four matches, all confirmed false positives on inspection (an empty `KEY=` placeholder repeated
  three times, and base64 image data inside an SVG file coincidentally matching the regex). No real
  secret exists in the repository; `.env`/`.env.local` are git-ignored and untracked.
- **Client-side secret exposure** — PASS. `process.env.RESEND_API_KEY`/`CONTACT_EMAIL`/`EMAIL_FROM`
  are referenced only inside the server-only route file; zero `NEXT_PUBLIC_*` variables exist
  anywhere in the project.
- **CORS** — PASS. No `Access-Control-Allow-Origin` header is returned by default (confirmed via
  direct testing), so no wildcard or reflected-origin misconfiguration exists. (This does not by
  itself stop a same-site-appearing request from reaching the server — that gap is SEC-04, now
  fixed via explicit Origin validation.)
- **Open redirect** — NOT APPLICABLE. Zero redirect/callback/return-URL parameters or
  `router.push`/`NextResponse.redirect` calls exist anywhere in the codebase (grep-verified).
- **SSRF** — NOT APPLICABLE / minimal surface. No user-controllable server-side URL fetching: the
  Resend SDK's endpoint is fixed by the library, not attacker-influenced; no image proxy; no
  `images.remotePatterns` configured in `next.config.ts` (only local `/public` images are used, so
  `next/image` cannot be pointed at an arbitrary remote/internal URL).
- **File upload / path handling** — NOT APPLICABLE. No file upload functionality exists anywhere.
- **HTTP method handling** — PASS. `GET`/other methods against `/api/contact` correctly return
  `405`; only `POST` (and the auto-generated `OPTIONS` preflight response) are accepted.
- **Malformed input handling** — PASS. Invalid JSON returns a generic `400` with no stack trace or
  internal detail; all error responses across every tested failure path (validation, oversized
  payload, provider failure, rate limit, cross-origin) return only static, generic messages.
- **Route normalization** — PASS. Trailing-slash and case-variation requests behave consistently
  (`/about/` redirects via Next.js's standard normalization; `/About`/`/ABOUT` 404 rather than
  serving unexpected content); no parser-confusion behavior observed.
- **Supply chain / lockfile integrity** — PASS. `package-lock.json` is `lockfileVersion: 3` with
  integrity hashes on all 414 resolved packages (100% coverage, script-verified). Only one package
  (`unrs-resolver`, a native module resolver used by ESLint tooling) has an install script;
  reviewed and is standard, reputable dev tooling — not a supply-chain red flag.
- **Client-side storage** — NOT APPLICABLE. No `localStorage`/`sessionStorage` usage anywhere in
  the codebase (grep-verified).

## Dependency findings (see also `npm audit`)

`next@15.5.25` (current) depends on a bundled `postcss@<=8.5.22` inside its own `node_modules`,
which carries several high-severity advisories (XSS via CSS stringification, source-map path
traversal). **Assessed as NOT REACHABLE in this application**: PostCSS here only ever processes
this project's own static `globals.css` at build time — there is no runtime pipeline that feeds
user-submitted or otherwise untrusted CSS through PostCSS. The only fix available
(`npm audit fix --force`) is a Next.js **major** version bump to 16.3.4, a breaking change outside
this review's scope to apply unilaterally — documented as an accepted, low-real-risk item, same
conclusion as the prior `FINAL_AUDIT.md` pass. The critical RCE originally flagged by Vercel
(CVE-2025-66478) and its follow-ups were already patched in an earlier session (upgrade to
`next@15.5.25`) and were re-confirmed absent from `npm audit` output during this review.
