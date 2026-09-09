# Security Test Cases

Executed against the running local application (`npm run dev` unless noted as run against a real
`npm run build && npm run start`). Evidence commands are reproducible with `curl` against
`http://localhost:3000` unless noted. Results below reflect the **post-remediation** state; where
a test caught a bug, both the original (FAIL) and post-fix (PASS) results are given.

| ID | Category | Target | Test | Expected secure behavior | Observed behavior | Result | Severity | Evidence |
|---|---|---|---|---|---|---|---|---|
| SEC-T-01 | Reconnaissance | Whole app | Enumerate all routes, API endpoints, dynamic segments | Full picture of attack surface | 15 static pages, 1 API route (`POST /api/contact`), 0 dynamic route segments, no middleware | INFO | — | `SECURITY_SCOPE.md` |
| SEC-T-02 | Secrets | Whole repo | Grep for AWS keys, private keys, API key patterns, DB connection strings w/ credentials | No real secret values in repo | 4 matches, all confirmed false positives (empty `KEY=` placeholders ×3, base64 SVG noise ×1) | PASS | — | grep output reviewed manually |
| SEC-T-03 | Contact form | `/api/contact` | POST with `Origin` from a different host (before fix) | Rejected or ignored if no session to protect | Request reached full validation/processing logic (no rejection) | FAIL → fixed | Low–Medium | SEC-04 |
| SEC-T-04 | Injection | `/api/contact` `name`/`organisation` | Submit `\r\n` sequences intended for the email subject line | CR/LF stripped or rejected before use | Passed through unmodified prior to fix; Resend never reached (no API key configured) so provider-side behavior unconfirmed | POTENTIAL RISK → mitigated | Low | SEC-05; MANUAL REVIEW REQUIRED once a Resend key is configured |
| SEC-T-05 | XSS | `/api/contact` `name`/`message` | Submit `<script>alert(1)</script>` and `<img src=x onerror=alert(2)>` | Never reflected/executed anywhere | Processed as inert text; no `dangerouslySetInnerHTML` anywhere in codebase; email body is plain-text, not HTML | PASS | — | grep for `dangerouslySetInnerHTML` (0 results); manual submission |
| SEC-T-06 | Injection | Whole app | Determine if SQL/NoSQL/command/template/LDAP/XPath injection surfaces exist | N/A if technology absent | No database, no shell exec, no template engine rendering user input | NOT APPLICABLE | — | Source review |
| SEC-T-07 | Authentication | Whole app | Identify login/session/password functionality | Document if absent | None exists | NOT APPLICABLE | — | "No application authentication surface identified." |
| SEC-T-08 | Authorization | Whole app | Attempt IDOR via route/query param manipulation | N/A if no protected/parameterized routes | Zero dynamic route segments, zero per-user data | NOT APPLICABLE | — | `find app -type d -name "[*]"` → empty |
| SEC-T-09 | Rate limiting | `/api/contact` | 7 rapid POSTs, same/no IP header | 6th+ request rejected (429) | Requests 6–7 correctly returned `429` | PASS | — | curl loop, see SECURITY_REPORT.md SEC-01 |
| SEC-T-10 | Rate limiting | `/api/contact` | 7 rapid POSTs, unique spoofed `X-Forwarded-For` per request (before fix) | Still rate-limited (global backstop) | All 7 succeeded before fix; capped by new global counter after fix | FAIL → fixed | Medium | SEC-01 |
| SEC-T-11 | Input limits | `/api/contact` | POST with a 2MB `message` field (before fix) | Rejected before full parse | Accepted and fully processed prior to fix | FAIL → fixed | Low–Medium | SEC-03 |
| SEC-T-12 | Contact form | `/api/contact` | Fill honeypot `company` field | Silently accepted, no email attempted | `200 {"ok":true}`, short-circuits before validation/send | PASS | — | curl test |
| SEC-T-13 | Headers | `/` | `curl -I` before fix | CSP, X-Frame-Options, etc. present | All security headers absent (only `X-Powered-By: Next.js` present) | FAIL → fixed | Medium | SEC-06, SEC-07 |
| SEC-T-14 | Headers | `/` | `curl -I` after fix | Full header set present | CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS all present; `X-Powered-By` absent | PASS | — | curl output captured |
| SEC-T-15 | CORS | `/api/contact` | POST with foreign `Origin`, inspect response headers | No wildcard/reflected ACAO | No `Access-Control-Allow-Origin` header returned at all | PASS | — | curl -D - |
| SEC-T-16 | CORS | `/api/contact` | `OPTIONS` preflight with foreign `Origin` | Only intended methods allowed | `204`, `Allow: OPTIONS, POST`, no ACAO grant | PASS | — | curl -X OPTIONS |
| SEC-T-17 | Open redirect | Whole app | Search for redirect/callback/return-URL parameters | None, or safely allowlisted | Zero redirect logic anywhere in the codebase | NOT APPLICABLE | — | grep for `redirect(`/`router.push` → 0 results |
| SEC-T-18 | SSRF | Whole app | Identify server-side URL-fetching from user input | None, or constrained | No image proxy, no remote image domains configured, Resend SDK target is fixed by the library | NOT APPLICABLE | — | Source review, `next.config.ts` |
| SEC-T-19 | File handling | Whole app | Identify file upload/path-based functionality | None, or safe | No file upload exists | NOT APPLICABLE | — | Source review |
| SEC-T-20 | Path traversal | Static assets | `../../package.json`, URL-encoded `..%2f`, `.env` at web root | 404/blocked | All attempts returned `404` (one encoded variant `400`) | PASS | — | curl loop, 5 payloads |
| SEC-T-21 | Info disclosure | `/api/contact` | Malformed JSON body | Generic error, no stack trace | `400 {"ok":false,"error":"Invalid request body."}` | PASS | — | curl test |
| SEC-T-22 | Info disclosure | `/api/contact` | All error paths (validation, size, rate-limit, cross-origin, config-missing) | Static, generic messages only | Confirmed across all paths — no raw provider errors, no internal paths, no env values | PASS | — | Source review + live tests |
| SEC-T-23 | Method handling | `/api/contact` | `GET` request | `405 Method Not Allowed` | `405` returned | PASS | — | curl -I |
| SEC-T-24 | Routing | Whole app | Trailing slash, case variation (`/About`, `/ABOUT`) | Consistent, no parser confusion | `/about/` → `308` redirect; `/About`, `/ABOUT` → `404` | PASS | — | curl loop |
| SEC-T-25 | Headers/CSP | Whole app (dev) | Headless-browser load of Home/About/International/Contact/Technology/Services + form submit, before adding `unsafe-eval` | Zero console/CSP errors | 8 `PAGEERROR`s: CSP blocked `eval()` used by Next.js dev-mode Fast Refresh | FAIL → fixed | — | Playwright console capture |
| SEC-T-26 | Headers/CSP | Whole app (dev) | Same as SEC-T-25, after adding `'unsafe-eval'` for non-production only | Zero console/CSP errors | 0 errors across all 6 pages + form submission | PASS | — | Playwright console capture |
| SEC-T-27 | Headers/CSP | Whole app (production build) | Same headless-browser pass against `npm run build && npm run start` (strict CSP, no `unsafe-eval`) | Zero CSP violations in the policy that actually matters for production | 0 CSP violations; 1 unrelated console entry (expected `503` from the unconfigured-Resend path, not a CSP issue) | PASS | — | Playwright console capture against prod build |
| SEC-T-28 | Contact form | `/api/contact` | Same-origin POST (`Origin` header matching `Host`) after SEC-04 fix | Passes through normally | `503` (config-missing) — correctly not blocked | PASS | — | curl test |
| SEC-T-29 | Contact form | `/api/contact` | Cross-origin POST (`Origin: https://evil-attacker.example`) after SEC-04 fix | Rejected | `403 {"error":"Cross-origin submissions are not accepted."}` | PASS | — | curl test |
| SEC-T-30 | Contact form | `/api/contact` | POST with no `Origin` header at all, after SEC-04 fix | Not falsely rejected | `503` (config-missing) — passes through as before | PASS | — | curl test |
| SEC-T-31 | Input limits | `/api/contact` | POST a 30KB body after SEC-03 fix | `413 Payload Too Large` | `413` returned | PASS | — | curl test |
| SEC-T-32 | Dependencies | `package.json`/`package-lock.json` | `npm audit`, `npm outdated`, lockfile integrity/install-script review | Known-vulnerable/malicious packages identified and assessed | 2 findings (`next` moderate, `postcss` high — bundled, build-time-only, not reachable at runtime); 100% integrity-hash coverage; 1 benign install script (`unrs-resolver`) | PASS (with 1 documented, accepted, non-reachable finding) | — | `npm audit`, custom lockfile script |
| SEC-T-33 | Client-side security | Whole app | Grep for `localStorage`/`sessionStorage`/unsafe DOM APIs/`postMessage` | None, or safely used | Zero usages of any of the above anywhere in the codebase | NOT APPLICABLE | — | grep, 0 results |
| SEC-T-34 | Privacy/data minimization | Contact form → email | Identify what personal data is collected and where it goes | Minimal, documented | Name, work email, organisation (optional), interest (optional), message, plus submitter IP appended to the email body sent only to Tropical Digital's own inbox | INFO, documented | — | `SECURITY_REPORT.md` |
| SEC-T-35 | Configuration | `next.config.ts` | Review for exposed dev settings, remote image domains, permissive redirects/rewrites | None found | No `images.remotePatterns`, no redirects/rewrites configured, `devIndicators` explicitly disabled | PASS | — | `next.config.ts` review |
| SEC-T-36 | Regression | Whole app | Full verification after all fixes | Typecheck/lint/build pass, app functions | All three pass; all pages return `200`; contact form flow unaffected | PASS | — | `npm run typecheck && npm run lint && npm run build` |

## Coverage summary against required categories

Authentication ✓ (N/A, documented) · Authorization ✓ (N/A, documented) · Injection ✓ (XSS tested,
SQLi/command/template N/A) · XSS ✓ · CSRF ✓ (Origin-validation gap found and fixed) · Security
headers ✓ (found absent, fixed, re-verified in dev and production) · CORS ✓ · Open redirect ✓
(N/A) · SSRF ✓ (N/A, minimal surface) · Path traversal ✓ · Secrets ✓ · Dependencies ✓ · Contact
form ✓ (primary focus — 4 of 7 fixed findings originate here) · Rate limiting ✓ (bypass found and
mitigated) · Error handling ✓ · Information disclosure ✓ · Client-side security ✓ · Configuration
✓ · Privacy/data handling ✓ (documented, no fabricated compliance claim).
